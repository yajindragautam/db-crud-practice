CREATE OR REPLACE FUNCTION public.create_translation(
    p_translationcode character varying,
    p_translations jsonb
)
RETURNS jsonb
LANGUAGE 'plpgsql'
COST 100
VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    translationcode_id INTEGER;
    locale_ids INTEGER[];
    locale_id INTEGER;
    elem_record JSONB;  -- Declare a variable to hold the elem value
BEGIN
    -- Check if local codes are valid in the provided translations array
    SELECT DISTINCT elem->>'localcode' INTO locale_id
    FROM jsonb_array_elements(p_translations) AS elem
    LEFT JOIN locales l ON elem->>'localcode' = l.code
    WHERE l.id IS NULL;

    -- If local code is not valid, throw an error
    IF locale_id IS NOT NULL THEN
        RAISE EXCEPTION 'Local Code Invalid: %', locale_id;
    END IF;

    -- Insert into translationcodes and return the ID
    INSERT INTO translationcodes (translationcode) VALUES (p_translationcode) RETURNING id INTO translationcode_id;

    -- Fetch all locales' IDs from the locales table
    SELECT ARRAY_AGG(id) FROM locales INTO locale_ids;

    -- Insert into translations for each locale using a loop
    FOREACH locale_id IN ARRAY locale_ids
    LOOP
        -- Get the elem value for the current iteration
        SELECT elem INTO elem_record
        FROM jsonb_array_elements(p_translations) AS elem
        WHERE elem->>'localcode' = (SELECT code FROM locales WHERE id = locale_id);

        -- Check if the localeid already exists in the translations table
        IF EXISTS (
            SELECT 1
            FROM translations
            WHERE localeid = locale_id
        ) THEN
            RETURN jsonb_build_object('message','The localecode is already in use..! :');
        ELSE
            
            INSERT INTO translations (translationcodeid, localeid, languagetext)
            SELECT translationcode_id, locale_id, elem_record->>'languagetext';
        END IF;
    END LOOP;

    -- Return response
    RETURN jsonb_build_object('message', 'Translation created');

END;
$BODY$;

ALTER FUNCTION public.create_translation(character varying, jsonb)
    OWNER TO postgres;


-- FUNCTION: public.edit_translation(integer, character varying, jsonb)

-- DROP FUNCTION IF EXISTS public.edit_translation(integer, character varying, jsonb);

CREATE OR REPLACE FUNCTION public.edit_translation(
	p_translationcodeid integer,
	p_translationcode character varying,
	p_translations jsonb)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    translation_id INTEGER;
    translationcode_id INTEGER;
    locale_id INTEGER;
BEGIN
    -- Step 1: Search in translations table
    SELECT id INTO translation_id
    FROM translations
    WHERE id = p_translationcodeid;
    
    IF translation_id IS NULL THEN
	    RETURN jsonb_build_object('message', 'Translation with given id not found');
--         RETURN '{"message": "Translation with given id not found"}'::JSONB;
    END IF;

    -- Step 2: Search in translationcodes table
    SELECT id INTO translationcode_id
    FROM translationcodes
    WHERE translationcode = p_translationcode;

    IF translationcode_id IS NULL THEN
		RETURN jsonb_build_object('message', 'Invalid translationcode');
--         RETURN '{"message": "Invalid translationcode"}'::JSONB;
    END IF;
	
    -- Step 3: Extract localcode and languagetext from p_translations
    -- Search in locales table (p_translations->>'localcode')::VARCHAR
-- 	RAISE EXCEPTION 'Value: %', p_translations;
	
    SELECT id INTO locale_id
    FROM locales
    WHERE code = (select jsonb_array_elements(p_translations) ->> 'localcode');

    IF locale_id IS NULL THEN
		RETURN jsonb_build_object('message', 'Invalid locales id');
--         RETURN '{"message": "Invalid locales id"}'::JSONB;
    END IF;

    -- Step 4: Update translations table
    UPDATE translations
    SET translationcodeid = translationcode_id,
        languagetext = (select jsonb_array_elements(p_translations) ->> 'languagetext'),
        localeid = locale_id
    WHERE id = translation_id;

    -- Step 5: Return success message
    RETURN '{"message": "Translation update success..!"}'::JSONB;
END;
$BODY$;

ALTER FUNCTION public.edit_translation(integer, character varying, jsonb)
    OWNER TO postgres;



-- FUNCTION: public.getstudentbyid(integer)

-- DROP FUNCTION IF EXISTS public.getstudentbyid(integer);

CREATE OR REPLACE FUNCTION public.getstudentbyid(
	p_id integer)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    student_record jsonb;
	subject_record jsonb;
BEGIN
    -- Search for student by ID
    SELECT 
        jsonb_build_object(
            'id', id,
            'name', name,
            'email', email,
            'createdat', createdat,
            'updatedat', updatedat
        )
    INTO student_record
    FROM students
    WHERE id = p_id;
    
    -- If student not found, return an error message
    IF student_record IS NULL THEN
        RETURN jsonb_build_object('error', 'User not found');
    END IF;
    
    -- Fetch enrolled subjects and details
    SELECT 
        jsonb_agg(
            jsonb_build_object(
                'id', ss.id,
                'Subject Code', subj.code,
                'Subject Name', subj.name,
                'Marks', ss.marks
            )
        ) AS enrollSubject
    INTO subject_record
    FROM student_subjects ss
    JOIN subjects subj ON ss.subject_id = subj.id
    WHERE ss.student_id = p_id;
    
    -- Combine student details and enrolled subjects
    RETURN jsonb_build_object('students', student_record,'subjects',subject_record);
END;
$BODY$;

ALTER FUNCTION public.getstudentbyid(integer)
    OWNER TO postgres;


CREATE OR REPLACE FUNCTION public.getalltranaslation(
    p_page_number integer,
    p_page_size integer,
    p_search_term text,
    p_localecode integer
)
RETURNS TABLE(id integer, translationcodeid integer, languagetext text, localeid integer) 
LANGUAGE 'plpgsql'
COST 100
VOLATILE PARALLEL UNSAFE
ROWS 1000
AS $BODY$
DECLARE
    v_offset integer := (p_page_number - 1) * p_page_size;
    v_query text;
BEGIN    
    -- Build the dynamic query with pagination and search conditions
    v_query := '
        SELECT id, translationcodeid, languagetext, localeid
        FROM translations';

    -- Check if all parameters are null, return all data
    IF p_page_number IS NULL AND p_page_size IS NULL AND p_search_term IS NULL AND p_localecode IS NULL THEN
        v_query := 'SELECT * FROM translations';
    ELSE
        -- Add WHERE clause if any parameter is provided
        v_query := v_query || '
        WHERE 1=1'; -- Placeholder condition

        -- Add search condition if search term is provided
        IF p_search_term IS NOT NULL THEN
            v_query := v_query || '
            AND languagetext ILIKE ''%' || p_search_term || '%''';
        END IF;

        -- Add localecode condition if p_localecode is provided
        IF p_localecode IS NOT NULL THEN
            v_query := v_query || '
            AND localeid = ' || p_localecode;
        END IF;

        -- Add LIMIT and OFFSET to the query
        v_query := v_query || '
            LIMIT ' || p_page_size || '
            OFFSET ' || v_offset;
    END IF;

    -- Execute the dynamic query only if v_query is not null
    IF v_query IS NOT NULL THEN
        RETURN QUERY EXECUTE v_query;
    END IF;
END;
$BODY$;

ALTER FUNCTION public.getalltranaslation(integer, integer, text, integer)
    OWNER TO postgres;
