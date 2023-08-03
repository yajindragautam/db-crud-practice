'use strict';
module.exports = (sequelize, DataTypes) => {
    let modelDefinition = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        code: { type: DataTypes.STRING, unique: true, index: true },
        name: { type: DataTypes.STRING, unique: true, index: true },
    };
    let modelOptions = {
        createdAt: 'createdat',
        updatedAt: 'updatedat'
    };
    return sequelize.define('subjects', modelDefinition, modelOptions);
};
