-- Select all stuents
SELECT * FROM students

-- Select all subjects
SELECT * FROM subjects

-- Select all  student stuents
SELECT * FROM student_subjects


-- Execute it only if you get foreign key constant erro
ALTER TABLE student_subjects
DROP CONSTRAINT student_subjects_subject_id_fkey