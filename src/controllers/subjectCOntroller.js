const {subjects}   = require('../models');

exports.getAllSubjects = async(req,res)=>{
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
exports.getSubjectById = async(req,res)=>{
    try {
        const data = await subjects.findOne({where:{id:req.params.id}});
        if(!data){
            return res.status(404).json({
                message:"SUbject  not found",
            });
        };
        return res.status(200).json({
            data:data
        });
    } catch (err) {
        console.log(err);
    }
}