-- FUNCTION: public.create_student(character varying, character varying, JSONB)

-- DROP FUNCTION IF EXISTS public.create_student(character varying, character varying, JSONB);

CREATE OR REPLACE FUNCTION public.create_student(
    p_name character varying,
    p_email character varying,
    p_subjects JSONB
)
RETURNS jsonb 
LANGUAGE 'plpgsql'
COST 100
VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    new_id INTEGER;
    subject_record JSONB;
    subject_code TEXT;
    subject_id INTEGER;
BEGIN
    -- Insert into students and return the ID
    INSERT INTO students (name, email) VALUES (p_name, p_email) RETURNING id INTO new_id;
    
    -- Iterate through subjects in the JSONB array
    FOR subject_record IN SELECT * FROM jsonb_array_elements(p_subjects)
    LOOP
        -- Extract subject code and marks
        subject_code := subject_record->>'code';
        subject_id := (SELECT id FROM subjects WHERE code = subject_code);
        
        -- Insert into student_subject table
        INSERT INTO student_subjects (student_id, subject_id, marks) VALUES (new_id, subject_id, (subject_record->>'marks')::INTEGER);
    END LOOP;
    
    -- Return response
    RETURN jsonb_build_object('message', 'Student created and subjects added');
END;
$BODY$;

ALTER FUNCTION public.create_student(character varying, character varying, JSONB)
    OWNER TO postgres;


-- Update students details 
-- FUNCTION: public.edit_student(character varying, character varying, JSONB)

-- DROP FUNCTION IF EXISTS public.edit_student(character varying, character varying, JSONB);

CREATE OR REPLACE FUNCTION public.edit_student(
    p_email character varying,
    p_name character varying,
    p_subjects JSONB
)
RETURNS jsonb 
LANGUAGE 'plpgsql'
COST 100
VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    studentId INTEGER;
    subject_record JSONB;
    subject_code TEXT;
    subjectId INTEGER;
BEGIN
    -- Search for student by email
    SELECT id INTO studentId FROM students WHERE email = p_email;
    
    -- If student not found, return an error message
    IF studentId IS NULL THEN
        RETURN jsonb_build_object('error', 'User not found');
    END IF;
    
    -- Update student's name if provided
    IF p_name IS NOT NULL THEN
        UPDATE students SET name = p_name WHERE id = studentId;
    END IF;
    
    -- Iterate through subjects in the JSONB array
    FOR subject_record IN SELECT * FROM jsonb_array_elements(p_subjects)
    LOOP
        -- Extract subject code and marks
        subject_code := subject_record->>'code';
        
        -- Search for subject by code
        SELECT id INTO subjectId FROM subjects WHERE code = subject_code;
        
        -- If subject not found, return an error message
        IF subjectId IS NULL THEN
            RETURN jsonb_build_object('error', 'Subject with given code not found');
        END IF;
        
        -- Update subject details
        UPDATE student_subjects SET marks = (subject_record->>'marks')::INTEGER
        WHERE student_id = studentId AND subject_id = subjectId;
    END LOOP;
    
    -- Return response
    RETURN jsonb_build_object('message', 'Student details and subjects updated');
END;
$BODY$;

ALTER FUNCTION public.edit_student(character varying, character varying, JSONB)
    OWNER TO postgres;
	
	
-- Get Student By Id show associated subjects as well
-- FUNCTION: public.getStudentById(integer)

-- DROP FUNCTION IF EXISTS public.getStudentById(integer);

CREATE OR REPLACE FUNCTION public.getStudentById(
    p_id integer
)
RETURNS jsonb 
LANGUAGE 'plpgsql'
COST 100
VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    student_record jsonb;
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
    INTO student_record
    FROM student_subjects ss
    JOIN subjects subj ON ss.subject_id = subj.id
    WHERE ss.student_id = p_id;
    
    -- Combine student details and enrolled subjects
    RETURN jsonb_build_object('students', student_record);
END;
$BODY$;

ALTER FUNCTION public.getStudentById(integer)
    OWNER TO postgres;

-- Get All Students

-- FUNCTION: public.getAllStudents()

-- DROP FUNCTION IF EXISTS public.getAllStudents();

CREATE OR REPLACE FUNCTION public.getAllStudents()
RETURNS jsonb 
LANGUAGE 'plpgsql'
COST 100
VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    students_data jsonb;
BEGIN
    -- Fetch all students' data
    SELECT 
        jsonb_agg(
            jsonb_build_object(
                'id', id,
                'name', name,
                'email', email,
                'createdat', createdat,
                'updatedat', updatedat
            )
        )
    INTO students_data
    FROM students;
    
    -- Return all students' data in JSON format
    RETURN students_data;
END;
$BODY$;

ALTER FUNCTION public.getAllStudents()
    OWNER TO postgres;
	
-- DELETE STUDENT BY ID
-- FUNCTION: public.deleteStudent(integer)

-- DROP FUNCTION IF EXISTS public.deleteStudent(integer);

CREATE OR REPLACE FUNCTION public.deleteStudent(
    p_id integer
)
RETURNS jsonb 
LANGUAGE 'plpgsql'
COST 100
VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    student_data jsonb;
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
    INTO student_data
    FROM students
    WHERE id = p_id;
    
    -- If student not found, return an error message
    IF student_data IS NULL THEN
        RETURN jsonb_build_object('error', 'User not found');
    END IF;
    
    -- Delete associations in subject_students table
    DELETE FROM student_subjects WHERE student_id = p_id;
    
    -- Delete student's details
    DELETE FROM students WHERE id = p_id;
    
    -- Return the deleted student's data
    RETURN jsonb_build_object('message', 'User deleted successfully..');
END;
$BODY$;

ALTER FUNCTION public.deleteStudent(integer)
    OWNER TO postgres;
