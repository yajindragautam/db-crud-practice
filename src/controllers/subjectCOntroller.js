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
        console.log('checkig parama ',req.params.id);
        const data = await subjects.findOne({id:req.params.id});
        return res.status(200).json({
            data:data
        });
    } catch (err) {
        console.log(err);
    }
}