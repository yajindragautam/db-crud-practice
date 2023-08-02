const {getAllStudents,getStudentById,createStudent} = require('../controllers/studentController');
const {getAllSubjects,getSubjectById} = require('../controllers/subjectCOntroller');

const express = require('express');
const routes =  express.Router();
console.log(getAllStudents);


// Get all user
routes.get('/students',getAllStudents);

// Get Student BY ID
routes.get('/students/:id',getStudentById);

// Create Student
routes.post('/students',createStudent);

// SUBJECTS

// Get all user
routes.get('/subjects',getAllSubjects);

// Get Student BY ID
routes.get('/subjects/:id',getSubjectById);



// Export routess
module.exports = routes;