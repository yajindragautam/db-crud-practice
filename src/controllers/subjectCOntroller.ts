import db from '../models';
import {Request,Response} from 'express'


export const getAllSubjects = async(req:Request,res:Response)=>{
    try {
        const data:object = await db.subjects.findAll();
        return res.status(200).json({
            data:data
        });
    } catch (err) {
        console.log(err);
    }
}

// Get: Student BY  ID
export const getSubjectById = async(req:Request,res:Response)=>{
    try {
        const data:object = await db.subjects.findOne({where:{id:req.params.id}});
        // If not found
        if(!data){
            return res.status(404).json({
                message:'Subject Not Found..!'
            });
        }
        return res.status(200).json({
            data:data
        });
    } catch (err) {
        console.log(err);
    }
}