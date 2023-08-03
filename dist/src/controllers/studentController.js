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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
const models_2 = __importDefault(require("../models"));
const models_3 = __importDefault(require("../models"));
exports.getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield models_2.default.findAll();
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
        const data = yield models_2.default.findOne({ id: req.params.id });
        const associateSubjectId = yield models_3.default.findAll({ where: { student_id: data.id } });
        const suArray = [];
        associateSubjectId.forEach((item) => {
            suArray.push(item.subject_id);
        });
        const subEnrolls = [];
        for (let i = 0; i < suArray.length; i++) {
            const sub = yield models_1.default.findAll({ where: { id: suArray[i] } });
            subEnrolls.push(sub);
        }
        return res.status(200).json({
            student: data,
            enrollSUbject: subEnrolls
        });
        // const subjectEnrolls = 
    }
    catch (err) {
        console.log(err);
    }
});
// Create Student
exports.createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = { name: req.body.name, email: req.body.email };
        const { subject } = req.body;
        // Create student
        const studentData = yield models_2.default.create(data);
        subject.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
            // Check if the subject code matched
            const checkSUbCode = yield models_1.default.findOne({ where: { code: item.code } });
            if (!checkSUbCode) {
                return res.status(404).json({
                    message: "Subject code not found",
                });
            }
            yield models_3.default.create({
                student_id: studentData.id,
                subject_id: checkSUbCode.id,
                marks: item.marks
            });
        }));
        return res.status(201).json({
            message: 'Student Created Successfully',
            data: studentData
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
        // err:err.name,            
        // description: err.errors
        });
    }
});
// Edit Student
exports.editStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield models_2.default.findOne({ where: { id: req.params.id } });
        const { subject } = req.body;
        // Check Empty spaces
        if (!data) {
            return res.status(404).json({
                message: "User Not Fount..!"
            });
        }
        subject.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
            // Check if the subject code matched
            const checkSUbCode = yield models_1.default.findOne({ where: { code: item.code } });
            if (!checkSUbCode) {
                return res.status(404).json({
                    message: "Subject code not found",
                });
            }
            yield models_3.default.create({
                student_id: data.id,
                subject_id: checkSUbCode.id,
                marks: item.marks
            });
        }));
        yield models_2.default.update({ name: req.body.name, email: req.body.email }, { where: { id: req.params.id } });
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
        // err:err.name,            
        // description: err.errors
        });
    }
});
// Delete  User
exports.deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield models_2.default.findOne({ where: { id: req.params.id } });
        // Check Empty spaces
        if (!data) {
            return res.status(404).json({
                message: "User Not Fount..!"
            });
        }
        yield models_2.default.destroy({ where: { id: req.params.id } });
        return res.status(202).json({
            message: "Student deleted success ..!",
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
        // err:err.name,            
        // description: err.errors
        });
    }
});
