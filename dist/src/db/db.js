"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectTODatabase = void 0;
require("dotenv").config();
const connectUrl = process.env.DBCONFIG;
const connectTODatabase = () => {
    try {
        const Sequelize = require('sequelize'), postgres = new Sequelize(connectUrl, {
            logging: false,
            dialect: 'postgres',
            connectionTimeout: 0,
            pool: {
                max: 50,
                min: 0,
                acquire: 1200000,
                idle: 1000000
            },
            timezone: process.env.UTC_OFFSET_DB || '+05:45' // for writing to database
        });
        postgres.authenticate().then(() => {
            console.log('Database connection has been established successfully.');
        }).catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.connectTODatabase = connectTODatabase;
// Exporting
// export = {connectTODatabase}
