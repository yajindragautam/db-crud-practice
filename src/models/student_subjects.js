'use strict';

const students = require('./students');
const subjects = require('./students');

module.exports = (sequelize, DataTypes) => {
  let modelDefinition = {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    student_id: {type: DataTypes.INTEGER},
    subject_id: {type: DataTypes.INTEGER},
    marks: {type: DataTypes.STRING,defaultValue:""},
    
  };
  let modelOptions = {
    createdAt: 'createdat',
    updatedAt: 'updatedat'
  };
 

  const studentSubjectModule =  sequelize.define('student_subjects', modelDefinition,modelOptions);
  studentSubjectModule.associate = (models) => {
    studentSubjectModule.belongsToMany(models.students, {foreignKey: 'id', 'as': 'studentsDetails',through:'id'});
    studentSubjectModule.belongsToMany(models.subjects, {foreignKey: 'id', 'as': 'subjectsDetails',through:'id'});

};
  return studentSubjectModule;
};