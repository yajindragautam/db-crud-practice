'use strict';


module.exports = (sequelize:any, DataTypes:any) => {
  let modelDefinition = {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    translationcode: {type: DataTypes.STRING,unique: true, index: true},
    
  };
  let modelOptions = {
    createdAt: 'createdat',
    updatedAt: 'updatedat'
  };
 

  return  sequelize.define('translationcodes', modelDefinition,modelOptions);
};