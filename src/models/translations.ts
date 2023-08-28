'use strict';
const Sequelize = require('sequelize');
// const moment = require( "moment");


module.exports  = {

  Translations : function(context){

    const model = context.define('Translations', {
      id:{
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      translationcodeid: {type: Sequelize.DataTypes.INTEGER,unique: true, index: true},
      languagetext: {type: Sequelize.DataTypes.STRING},
      localeid: {type: Sequelize.DataTypes.INTEGER}
      
    },
    {
      createdAt: 'createdat',
      tableName: 'translations',
      updatedAt: 'updatedat'
    });

    return  model;
  }
 
  
  // const translationCodeModule =  sequelize.define('translations', modelDefinition,modelOptions);
  // translationCodeModule.associate = (models:any) => {
  //   translationCodeModule.belongsToMany(models.locals, {foreignKey: 'id', 'as': 'localDetails',through:'id'});
  //   translationCodeModule.belongsToMany(models.translationcodes, {foreignKey: 'id', 'as': 'translationCodesDetails',through:'id'});

  // };

};