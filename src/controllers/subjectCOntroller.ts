import {subjects} from '../models' 

exports.getAllSubjects = async(req:any,res:any)=>{
    try {
        const data = await subjects.findAll();
        return res.status(200).json({
            data:data
        });
    } catch (err) {
        console.log(err);
    }
}

// Get: Student BY  ID
exports.getSubjectById = async(req:any,res:any)=>{
    try {
        const data = await subjects.findOne({id:req.params.id});
        return res.status(200).json({
            data:data
        });
    } catch (err) {
        console.log(err);
    }
}