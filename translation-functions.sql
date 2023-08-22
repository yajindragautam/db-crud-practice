-- FUNCTION: public.create_translation(character varying, jsonb)

-- DROP FUNCTION IF EXISTS public.create_translation(character varying, jsonb);

CREATE OR REPLACE FUNCTION public.create_translation(
	p_translationcode character varying,
	p_translations jsonb)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    translationcode_id INTEGER;
    locale_ids INTEGER[];
    locale_id INTEGER;
    elem_record JSONB;
BEGIN
    -- Validate local codes in the provided translations array
    SELECT DISTINCT elem->>'localcode' INTO locale_id
    FROM jsonb_array_elements(p_translations) AS elem
    LEFT JOIN locales l ON elem->>'localcode' = l.code
    WHERE l.id IS NULL;

    -- If local code is not valid, raise an exception
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
            RETURN jsonb_build_object('message', 'The localecode is already in use');
        ELSE
            -- Use a parameterized query to prevent SQL injection
            INSERT INTO translations (translationcodeid, localeid, languagetext)
            SELECT translationcode_id, locale_id, elem_record->>'languagetext'
            WHERE NOT EXISTS (
                SELECT 1
                FROM translations
                WHERE translationcodeid = translationcode_id
                  AND localeid = locale_id
            );
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
    -- Step 1: Search in translations table with parameterized query
    SELECT id INTO translation_id
    FROM translations
    WHERE id = p_translationcodeid;

    IF translation_id IS NULL THEN
        RETURN '{"message": "Translation with given id not found"}'::JSONB;
    END IF;

    -- Step 2: Search in translationcodes table with parameterized query
    SELECT id INTO translationcode_id
    FROM translationcodes
    WHERE translationcode = p_translationcode;

    IF translationcode_id IS NULL THEN
        RETURN '{"message": "Invalid translationcode"}'::JSONB;
    END IF;

    -- Step 3: Extract localcode from p_translations using JSON functions
    SELECT id INTO locale_id
    FROM locales
    WHERE code = (SELECT (elem->>'localcode')::VARCHAR
                  FROM jsonb_array_elements(p_translations) AS elem LIMIT 1);

    IF locale_id IS NULL THEN
        RETURN '{"message": "Invalid locales id"}'::JSONB;
    END IF;

    -- Step 4: Update translations table using parameterized query
    UPDATE translations
    SET translationcodeid = translationcode_id,
        languagetext = (SELECT (elem->>'languagetext')::VARCHAR
                       FROM jsonb_array_elements(p_translations) AS elem LIMIT 1),
        localeid = locale_id
    WHERE id = translation_id;

    -- Step 5: Return success message
    RETURN '{"message": "Translation update success..!"}'::JSONB;
END;
$BODY$;

ALTER FUNCTION public.edit_translation(integer, character varying, jsonb)
    OWNER TO postgres;



-- FUNCTION: public.gettranslationbyid(integer)

-- DROP FUNCTION IF EXISTS public.gettranslationbyid(integer);

CREATE OR REPLACE FUNCTION public.gettranslationbyid(
	p_translationid integer)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    translation_id INTEGER;
    translationcode_id INTEGER;
    locale_id INTEGER;
    translationcode VARCHAR;
    localcode VARCHAR;
    languagetext VARCHAR;
BEGIN
    -- Step 1: Search in translations table
    SELECT id, translationcodeid, localeid
    INTO translation_id, translationcode_id, locale_id
    FROM translations
    WHERE id = p_translationid;

    IF translation_id IS NULL THEN
        RETURN '{"message": "Invalid transaction id .."}'::JSONB;
    END IF;

    -- Step 2: Search in translationcodes table
    SELECT tc.translationcode
    INTO translationcode
    FROM translationcodes tc
    WHERE tc.id = translationcode_id;

    IF translationcode IS NULL THEN
        RETURN '{"message": "Not Found translationcodeid"}'::JSONB;
    END IF;

    -- Step 3: Search in locales table
    SELECT l.code
    INTO localcode
    FROM locales l
    WHERE l.id = locale_id;

    IF localcode IS NULL THEN
        RETURN '{"message": "Invalid locals id .."}'::JSONB;
    END IF;

    -- Get languagetext from translations table
    SELECT t.languagetext
    INTO languagetext
    FROM translations t
    WHERE t.id = translation_id;

    -- Step 4: Construct the JSON response
    RETURN jsonb_build_object('translationcode', translationcode, 'localcode', localcode, 'text', languagetext);

END;
$BODY$;

ALTER FUNCTION public.gettranslationbyid(integer)
    OWNER TO postgres;



-- FUNCTION: public.getalltranaslation(integer, integer, text, integer)

-- DROP FUNCTION IF EXISTS public.getalltranaslation(integer, integer, text, integer);

CREATE OR REPLACE FUNCTION public.getalltranaslation(
	p_page_number integer,
	p_page_size integer,
	p_search_term text,
	p_localecode integer)
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
            AND languagetext ILIKE $1';
        END IF;

        -- Add localecode condition if p_localecode is provided
        IF p_localecode IS NOT NULL THEN
            v_query := v_query || '
            AND localeid = $2';
        END IF;

        -- Add LIMIT and OFFSET to the query
        v_query := v_query || '
            LIMIT $3
            OFFSET $4';
    END IF;
-- 	RAISE NOTICE 'value of a : %', a;
    -- Execute the dynamic query only if v_query is not null
    IF v_query IS NOT NULL THEN
        RETURN QUERY EXECUTE v_query USING p_search_term, p_localecode, p_page_size, v_offset;
    END IF;
END;
$BODY$;

ALTER FUNCTION public.getalltranaslation(integer, integer, text, integer)
    OWNER TO postgres;
