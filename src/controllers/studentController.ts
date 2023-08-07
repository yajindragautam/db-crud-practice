import db from '../models';
import {Request,Response} from 'express'

export const getAllStudents = async(req:Request,res:Response)=>{
    try {
        const data:object = await db.students.findAll();
        return res.status(200).json({
            data:data
        });
    } catch (err) {
        console.log(err);
    }
}

// Get: Student BY  ID
export const getStudentById = async(req:Request,res:Response)=>{
    try {
        // subjects: [{code: sub.code, marks: uArray.filter()}]
        const data = await db.students.findOne({where:{id:req.params.id}});
        if(!data){
            return res.status(404).json({
                message:"Student  not found",
            });
        };
        const associateSubjectId = await db.student_subjects.findAll({where:{student_id:data.id}})
        const suArray:Array<any> = [];
        associateSubjectId.forEach((item)=>{
            suArray.push(item);
            // marksArray.push(item.marks);
        })
        let results:Array<object> = [];
        for (let i = 0; i < suArray.length; i++) {
            // students have: subject-name sub-code
            const sub = await db.subjects.findAll({where:{id:suArray[i].subject_id}});
            sub.forEach(async(item)=>{   
                const {id,code,name} = item;
                results.push({'id ':id,'Subject Code':code,'Subject Name': name,'Marks ': suArray[i].marks});
            })
        }
        
        return res.status(200).json({
            students:data,
            enrollSubject:results
        })
        // const subjectEnrolls = 
    } catch (err) {
        console.log(err);
    }
}

// Create Student
export const createStudent = async(req:Request,res:Response) =>{
    try {
        const data:object = {name:req.body.name,email:req.body.email};
        const {subject} = req.body;
        // Create student
        const studentData = await db.students.create(data);
        subject.forEach(async(item)=>{
            // Check if the subject code matched
            const checkSUbCode = await db.subjects.findOne({where:{code:item.code}});
            
            if(!checkSUbCode){
                return res.status(404).json({
                    message:"Subject code not found",
                });
            }
            await db.student_subjects.create({
                student_id:studentData.id,
                subject_id:checkSUbCode.id,
                marks: item.marks
            });
        })
      
        return res.status(201).json({
            message:'Student Created Successfully',
            data:studentData
        })
    } catch (err:any) {
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
export const editStudent = async(req:Request,res:Response)=>{
    try {
        const data = await db.students.findOne({where:{id:req.params.id}});
        const {subject} = req.body;
        // Check Empty spaces
        // If not found
        if(!data){
            return res.status(404).json({
                message:'Student Not Found..!'
            });
        }
        subject.forEach(async(item)=>{
            // Check if the subject code matched
            const checkSUbCode = await db.subjects.findOne({where:{code:item.code}});
            if(!checkSUbCode){
                return res.status(404).json({
                    message:"Subject code not found",
                });
            }
            await db.student_subjects.create({
                student_id:data.id,
                subject_id:checkSUbCode.id,
                marks: item.marks
            });
        })
        
        await db.students.update({name:req.body.name,email:req.body.email},{where:{id:req.params.id}});
        return res.status(200).json({
            message:"Student and Subjects updated success..",
            data:{
                data
                // findAllSubjects
            }
        })
    } catch (err:any) {
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
export const deleteStudent =async(req,res) =>{
    try {
        const data = await db.students.findOne({where:{id:req.params.id}});
        // Check Empty spaces
        if(!data){
            return res.status(404).json({
                message:"User Not Fount..!"
            })
        }
        await db.students.destroy({where:{id:req.params.id}});
        return res.status(202).json(
            {
                message:"Student deleted success ..!",            
            }
        );
    } catch (err:any) {
        console.log(err);
        return res.status(400).json(
            {
                err:err.name,            
                description: err.errors
            }
        );
    }
}