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
        console.log('checkig parama ',req.params.id);
        const data = await students.findOne({id:req.params.id});
        return res.status(200).json({
            data:data
        });
    } catch (err) {
        console.log(err);
    }
}

// Create Student
exports.createStudent = async(req,res) =>{
    try {
        const data = {name:req.body.name,email:req.body.email};
        const {subject,studentsubData} = req.body;   
        console.log('Check here --',studentsubData[0]);  
     
        // Create student
        const studentData = await students.create(data);
        // Create subject
        const subjectData = await subjects.create(subject[0]);
        // Create Student SUbject
        const studentSubjectData = await student_subjects.create(
            {   
                student_id:studentData.id,
                subject_id:studentData.id,
                marks:studentsubData[0]['marks'],
            }
            );
      
        return res.status(201).json({
            message:'Created Successfully',
            data:[studentData,subjectData,studentSubjectData]
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