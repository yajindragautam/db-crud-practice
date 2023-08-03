"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { getAllStudents, getStudentById, createStudent, editStudent, deleteStudent } = require('../controllers/studentController');
const { getAllSubjects, getSubjectById } = require('../controllers/subjectCOntroller');
const express_1 = __importDefault(require("express"));
const routes = express_1.default.Router();
// Get all user
routes.get('/students', getAllStudents);
// Get Student BY ID
routes.get('/students/:id', getStudentById);
// Create Student
routes.post('/students', createStudent);
// Edit Students
routes.put('/students/:studentid/subjects/:id', editStudent);
// Delete Students
routes.delete('/students/:id', deleteStudent);
// SUBJECTS
// Get all user
routes.get('/subjects', getAllSubjects);
// Get Student BY ID
routes.get('/subjects/:id/', getSubjectById);
// Export routess
module.exports = routes;
