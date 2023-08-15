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
    locale_code TEXT;
    translationcode_id INTEGER;
BEGIN
    -- Check if local codes are valid in the provided translations array
    SELECT DISTINCT elem->>'localcode' INTO locale_code
    FROM jsonb_array_elements(p_translations) AS elem
    LEFT JOIN locales l ON elem->>'localcode' = l.code
    WHERE l.id IS NULL;

	--RAISE NOTICE 'Checking data:', p_translations;
    -- If local code is not valid, throw an error
    IF locale_code IS NOT NULL THEN
        RAISE EXCEPTION 'Local Code Invalid: %', locale_code;
    END IF;

    -- Insert into translationcodes and return the ID
    INSERT INTO translationcodes (translationcode) VALUES (p_translationcode) RETURNING id INTO translationcode_id;

	 -- Insert into translations using a single query
    INSERT INTO translations (translationcodeid, languagetext, localeid)
    SELECT
        translationcode_id,
        elem->>'languagetext' AS languagetext,
        l.id AS localeid
    FROM jsonb_array_elements(p_translations) AS elem
    JOIN locales l ON elem->>'localcode' = l.code;
   

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




-- FUNCTION: public.getalltranaslation(integer, integer, text)

-- DROP FUNCTION IF EXISTS public.getalltranaslation(integer, integer, text);

CREATE OR REPLACE FUNCTION public.getalltranaslation(
	p_page_number integer,
	p_page_size integer,
	p_search_term text)
    RETURNS TABLE(id integer, translationcodeid integer, languagetext text, localeid integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
	  -- Calculate the offset based on the page number and page size
    DECLARE v_offset integer := (p_page_number - 1) * p_page_size;
    DECLARE v_query text;
    -- Fetch translation data using pagination
BEGIN    

    -- Build the dynamic query with pagination and search conditions
    v_query := '
        SELECT id, translationcodeid, languagetext, localeid
        FROM translations';

    -- Add search condition if search term is provided
    IF p_search_term IS NOT NULL THEN
        v_query := v_query || '
        WHERE languagetext ILIKE ''%' || p_search_term || '%''';
    END IF;

    -- Add LIMIT and OFFSET to the query
    v_query := v_query || '
        LIMIT ' || p_page_size || '
        OFFSET ' || v_offset;

    -- Execute the dynamic query
    RETURN QUERY EXECUTE v_query;
END;
$BODY$;

ALTER FUNCTION public.getalltranaslation(integer, integer, text)
    OWNER TO postgres;
