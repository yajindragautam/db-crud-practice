import {students,student_subjects,subjects}   from '../models';

exports.getAllStudents = async(req:any,res:any)=>{
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
exports.getStudentById = async(req:any,res:any)=>{
    try {
        const data = await students.findOne({id:req.params.id});
        return res.status(200).json({
            data:data
        });
    } catch (err) {
        console.log(err);
    }
}

// Create Student
exports.createStudent = async(req:any,res:any) =>{
    try {
        const data = {name:req.body.name,email:req.body.email};
        const {subject, studentsubData} = req.body;
        // Create student
        const studentData = await students.create(data);
        // Create subject
        const subjectData = await subjects.create(subject[0]);
        // Create Student SUbject
        const studentSubjectData = await student_subjects.create(
            {   
                student_id:studentData.id,
                subject_id:subjectData.id,
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

// Edit Student
exports.editStudent = async(req:any,res:any)=>{
    try {
        const data = await students.findOne({where:{id:req.params.studentid}});
        const {subject, studentsubData} = req.body;
        // Check Empty spaces
        if(!data){
            return res.status(404).json({
                message:"User Not Fount..!"
            })
        }
        // check if student with their id exit in studetn subjects table
        //if yes list all subject which student have enroller and update marks
        // Take a subject is from paramas
        // Update student subject student_id
        const checkStudentSubject = await student_subjects.findAll({where:{student_id:data.id}});
        if(checkStudentSubject.length < 0){
            return res.status(400).json({
                message:"Student is not associated withany subjects"
            })
        }
        const studentSubIdArray = [];
        for (let i = 0; i < checkStudentSubject.length; i++) {
            console.log('chekc data',studentsubData[0]['marks']);
             await student_subjects.update({marks:studentsubData[0]['marks']},{where:{id:checkStudentSubject[i].id}})
             studentSubIdArray.push(checkStudentSubject[i].subject_id);
        }
        studentSubIdArray.forEach(async(item)=>{
             await subjects.findAll({where:{id:item}});
             await subjects.update(subject[0],{where:{id:item}})
            // Check if the subject with id exit is s
            
        });
        await students.update({name:req.body.name},{where:{id:req.params.studentid}});
        return res.status(200).json({
            message:"Student and Subjects updated success..",
            data:{
                data
                // findAllSubjects
            }
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
exports.deleteStudent =async(req:any,res:any) =>{
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