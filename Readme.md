# Database and CRUP Assignment

## How TO Configure Project
- **Clone the project and open in Code editor.**
- **There are two branch `main` and `tsbranch`.Where `main` constin JS code and `tsbranch` contains Typescript code.**
- **Run `yarn` or `npm init`it will download all the packages used in project.**
- **Start project: `yarn dev`.**

## Create Database
`
CREATE DATABASE "practiceDB"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
`

## Create Students Table
`
CREATE TABLE STUDENTS(
	id  SERIAL PRIMARY KEY,
	name VARCHAR ,
	email VARCHAR,
	createdAt Date,
	updatedAt Date,
	UNIQUE(email)
)
`
## Create Subjects Table
`
CREATE TABLE SUBJECTS(
	id  SERIAL PRIMARY KEY,
	code VARCHAR ,
	name VARCHAR,
	createdAt Date,
	updatedAt Date,
	UNIQUE(name)
)
`
## Create Student_Subject Table
`
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
`

## Dishable Foreign Key Constant
`
ALTER TABLE student_subjects
DROP CONSTRAINT student_subjects_subject_id_fkey
`

# SQL Command To Query
## Select All Students
`
SELECT * FROM students
` 
## Select All Subjects
`
SELECT * FROM subjects
` 
## Select All student_subjects
`
SELECT * FROM student_subjects
` 

# JSON Body For Postman


# Routes
## Students
- Get All Students: `{{url}}/students`
- Get All Students By Id : `{{url}}/students/:id`
- Create Student : `{{url}}/students`

`
{
    "name":"Ukesh", 
    "email":"ueks@gmail.com",
    "subject":[{"name":"Conputer Science",
    "code":"Dc"}],
    "studentsubData":[{"marks":80}]
}
`


- Edit Student: `{{url}}/students/6/subjects/4` : send student id and subject id

- Delete Student: `{{url}}/students/8`

## Subjects
- Get All SUbjects: `{{url}}/subjects`
- Get Subject BY id: `{{url}}/subjects`

## ENV CONFIGURATION
`DBCONFIG= enter sequalize db url here..`