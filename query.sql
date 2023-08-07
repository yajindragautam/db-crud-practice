-- Select all students
SELECT * FROM students

-- Select all subjects
SELECT * FROM SUBJECTS

-- Select all students subject
SELECT * FROM student_subjects

-- Using the 'create_student' function

--SELECT create_student('John Doe', 'john.doe@example.com','[{"code":"db","marks":60}]'::JSONB)

SELECT create_student('John Doe'::TEXT, 'john.doe@example.com'::TEXT, '[{"code": "db", "marks": 60}]'::JSONB);

-- Update Students
SELECT edit_student('john.doe@example.com'::TEXT,'John v2 Doe'::TEXT, '[{"code": "db", "marks": 99}]'::JSONB);

-- Get student by ID
SELECT getStudentById(15);

-- Get all students
SELECT getAllStudents();

-- Delete Student BY id
SELECT deleteStudent(1);

 --SELECT create_student('[{"code":"db","marks":60}]'::jsonb)

-- SELECT create_student('John Doe', 'john.doe@example.com','[{"code":"db","marks":60}]'::jsonb)

-- Execute this to test trigger function
INSERT INTO students(name,email)VALUES('Yajindra','email@gmail.com');