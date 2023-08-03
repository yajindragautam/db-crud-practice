"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
exports.getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield models_1.students.findAll();
        return res.status(200).json({
            data: data
        });
    }
    catch (err) {
        console.log(err);
    }
});
// Get: Student BY  ID
exports.getStudentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield models_1.students.findOne({ id: req.params.id });
        return res.status(200).json({
            data: data
        });
    }
    catch (err) {
        console.log(err);
    }
});
// Create Student
exports.createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = { name: req.body.name, email: req.body.email };
        const { subject, studentsubData } = req.body;
        // Create student
        const studentData = yield models_1.students.create(data);
        // Create subject
        const subjectData = yield models_1.subjects.create(subject[0]);
        // Create Student SUbject
        const studentSubjectData = yield models_1.student_subjects.create({
            student_id: studentData.id,
            subject_id: subjectData.id,
            marks: studentsubData[0]['marks'],
        });
        return res.status(201).json({
            message: 'Created Successfully',
            data: [studentData, subjectData, studentSubjectData]
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
            err: err.name,
            description: err.errors
        });
    }
});
// Edit Student
exports.editStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield models_1.students.findOne({ where: { id: req.params.studentid } });
        const { subject, studentsubData } = req.body;
        // Check Empty spaces
        if (!data) {
            return res.status(404).json({
                message: "User Not Fount..!"
            });
        }
        // check if student with their id exit in studetn subjects table
        //if yes list all subject which student have enroller and update marks
        // Take a subject is from paramas
        // Update student subject student_id
        const checkStudentSubject = yield models_1.student_subjects.findAll({ where: { student_id: data.id } });
        if (checkStudentSubject.length < 0) {
            return res.status(400).json({
                message: "Student is not associated withany subjects"
            });
        }
        const studentSubIdArray = [];
        for (let i = 0; i < checkStudentSubject.length; i++) {
            console.log('chekc data', studentsubData[0]['marks']);
            yield models_1.student_subjects.update({ marks: studentsubData[0]['marks'] }, { where: { id: checkStudentSubject[i].id } });
            studentSubIdArray.push(checkStudentSubject[i].subject_id);
        }
        studentSubIdArray.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield models_1.subjects.findAll({ where: { id: item } });
            yield models_1.subjects.update(subject[0], { where: { id: item } });
            // Check if the subject with id exit is s
        }));
        yield models_1.students.update({ name: req.body.name }, { where: { id: req.params.studentid } });
        return res.status(200).json({
            message: "Student and Subjects updated success..",
            data: {
                data
                // findAllSubjects
            }
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
            err: err.name,
            description: err.errors
        });
    }
});
// Delete  User
exports.deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield models_1.students.findOne({ where: { id: req.params.id } });
        // Check Empty spaces
        if (!data) {
            return res.status(404).json({
                message: "User Not Fount..!"
            });
        }
        yield models_1.students.destroy({ where: { id: req.params.id } });
        return res.status(202).json({
            message: "Student deleted success ..!",
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
            err: err.name,
            description: err.errors
        });
    }
});
