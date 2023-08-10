'use strict';


module.exports = (sequelize:any, DataTypes:any) => {
  let modelDefinition = {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    translationcodeid: {type: DataTypes.INTEGER,unique: true, index: true},
    text: {type: DataTypes.STRING},
    localeid: {type: DataTypes.INTEGER},
    
  };
  let modelOptions = {
    createdAt: 'createdat',
    updatedAt: 'updatedat'
  };
  
  const translationCodeModule =  sequelize.define('translations', modelDefinition,modelOptions);
  translationCodeModule.associate = (models:any) => {
    translationCodeModule.belongsToMany(models.locals, {foreignKey: 'id', 'as': 'localDetails',through:'id'});
    translationCodeModule.belongsToMany(models.translationcodes, {foreignKey: 'id', 'as': 'translationCodesDetails',through:'id'});

  };

  return  translationCodeModule;
};