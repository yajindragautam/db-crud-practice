const {students,student_subjects,subjects}   = require('../models');

exports.getAllStudents = async(req,res)=>{
    try {
        const data = await students.findAll();
        return res.status(200).json({
            data:data
        });
    } catch (err) {
        console.log(err);
    }
}

// Get: Student BY  ID
exports.getStudentById = async(req,res)=>{
    try {
        const data = await students.findOne({where:{id:req.params.id}});
        if(!data){
            return res.status(404).json({
                message:"Student  not found",
            });
        };
        const associateSubjectId = await student_subjects.findAll({where:{student_id:data.id}})
        const suArray = []
        associateSubjectId.forEach((item)=>{
            suArray.push(item.subject_id);
        })
        const subEnrolls = [];
        for (let i = 0; i < suArray.length; i++) {
            const sub = await subjects.findAll({where:{id:suArray[i]}});
            subEnrolls.push(sub);
        }
        return res.status(200).json({
            student:data,
            enrollSUbject:subEnrolls
        })
        // const subjectEnrolls = 
    } catch (err) {
        console.log(err);
    }
}

// Create Student
exports.createStudent = async(req,res) =>{
    try {
        const data = {name:req.body.name,email:req.body.email};
        const {subject} = req.body;
        // Create student
        const studentData = await students.create(data);
        subject.forEach(async(item)=>{
            // Check if the subject code matched
            const checkSUbCode = await subjects.findOne({where:{code:item.code}});
            if(!checkSUbCode){
                return res.status(404).json({
                    message:"Subject code not found",
                });
            }
            await student_subjects.create({
                student_id:studentData.id,
                subject_id:checkSUbCode.id,
                marks: item.marks
            });
        })
      
        return res.status(201).json({
            message:'Student Created Successfully',
            data:studentData
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json(
            {
                err:err.name,            
                description: err.errors
            }
        );
    }
}

// Edit Student
exports.editStudent = async(req,res)=>{
    try {
        const data = await students.findOne({where:{id:req.params.id}});
        const {subject} = req.body;
        // Check Empty spaces
        if(!data){
            return res.status(404).json({
                message:"User Not Fount..!"
            })
        }
        subject.forEach(async(item)=>{
            // Check if the subject code matched
            const checkSUbCode = await subjects.findOne({where:{code:item.code}});
            if(!checkSUbCode){
                return res.status(404).json({
                    message:"Subject code not found",
                });
            }
            await student_subjects.create({
                student_id:data.id,
                subject_id:checkSUbCode.id,
                marks: item.marks
            });
        })
        
        await students.update({name:req.body.name,email:req.body.email},{where:{id:req.params.id}});
        return res.status(200).json({
            message:"Student and Subjects updated success..",
            
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json(
            {
                err:err.name,            
                description: err.errors
            }
        );
    }
}

// Delete  User
exports.deleteStudent =async(req,res) =>{
    try {
        const data = await students.findOne({where:{id:req.params.id}});
        // Check Empty spaces
        if(!data){
            return res.status(404).json({
                message:"User Not Fount..!"
            })
        }
        await students.destroy({where:{id:req.params.id}});
        return res.status(202).json(
            {
                message:"Student deleted success ..!",            
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(400).json(
            {
                err:err.name,            
                description: err.errors
            }
        );
    }
}