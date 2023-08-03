-- Database: practiceDB

-- DROP DATABASE IF EXISTS "practiceDB";

CREATE DATABASE "practiceDB"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
	-- Create sTUDENTS Table
CREATE TABLE STUDENTS(
	id  SERIAL PRIMARY KEY,
	name VARCHAR ,
	email VARCHAR,
	createdAt Date,
	updatedAt Date,
	UNIQUE(email)
)

-- Insert Data in Students Table
INSERT INTO STUDENTS(name,email)
VALUES('Yajindra','yajindragtm@gmail.com')
--VALUES('Ukesh','ukesh@gmail.com');
-- Create Subjects Table

CREATE TABLE SUBJECTS(
	id  SERIAL PRIMARY KEY,
	code VARCHAR ,
	name VARCHAR,
	createdAt Date,
	updatedAt Date,
	UNIQUE(code)
)

-- Insert Data in SUBJECTS Table
INSERT INTO SUBJECTS(code,name)
VALUES('campp','Computer Science'),
('db','Database'),
('dba','Database Adminstrator'),
('java','Java OOP')


-- Create	student_subjects Table
CREATE TABLE student_subjects(
	id  SERIAL PRIMARY KEY,
	student_id INTEGER ,
	subject_id INTEGER,
	marks VARCHAR,
	createdAt Date,
	updatedAt Date,
	-- Foreign key relation
	FOREIGN KEY (student_id) REFERENCES STUDENTS (id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (subject_id) REFERENCES student_subjects (id) ON DELETE CASCADE ON UPDATE CASCADE
)

-- Update SUbjects Table and add marks column
ALTER TABLE SUBJECTS
DELETE COLUMN marks


-- Insert Data in students_subjects Table
INSERT INTO student_subjects(student_id,subject_id,marks)
VALUES(1,1,'85.9')