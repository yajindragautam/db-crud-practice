
-- CREATE TRANSLATION POSTGRES FUNCTION

-- FUNCTION: public.create_translation(character varying, jsonb)

-- DROP FUNCTION IF EXISTS public.create_translation(character varying, jsonb);

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
    locale_id INTEGER;
BEGIN
    -- Insert into translationcodes and return the ID
    INSERT INTO translationcodes (translationcode) VALUES (p_translationcode) RETURNING id INTO translationcode_id;

    -- Insert into locales using a common table expression (CTE)
    WITH distinct_locals AS (
        SELECT DISTINCT (elem->>'localcode') AS localcode
        FROM jsonb_array_elements(p_translations) AS elem
    )
    INSERT INTO locales (code)
    SELECT localcode FROM distinct_locals;

    -- Insert into translations using a single query
    INSERT INTO translations (translationcodeid, localeid, languagetext)
    SELECT
        translationcode_id,
        l.id AS localeid,
        elem->>'languagetext' AS languagetext
    FROM jsonb_array_elements(p_translations) AS elem
    JOIN locales l ON elem->>'localcode' = l.code;
	
	 -- Return response
    RETURN jsonb_build_object('message', 'Translation created and locals added');

END;
$BODY$;

ALTER FUNCTION public.create_translation(character varying, jsonb)
    OWNER TO postgres;
