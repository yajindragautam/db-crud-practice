import db from '../models';


export const getAllSubjects = async(req:any,res:any)=>{
    try {
        const data = await db.subjects.findAll();
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
        const data = await db.subjects.findOne({id:req.params.id});
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