require("dotenv").config();

const connectUrl = process.env.DBCONFIG;

export const connectTODatabase = ():void =>{
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
            timezone:process.env.UTC_OFFSET_DB||'+05:45'  // for writing to database
          });
          postgres.authenticate().then(() => {
            console.log('Database connection has been established successfully.');
          }).catch(err => {
            console.error('Unable to connect to the database:', err);
          });
    } catch (err) {
        console.log(err);
    }
}


// Exporting
// export = {connectTODatabase}