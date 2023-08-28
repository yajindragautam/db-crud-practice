require("dotenv").config();
import { Sequelize } from "sequelize";

// const connectUrl = process.env.DBCONFIG;
// // const sequelize = new Sequelize(connectUrl);
// const sequelize = new Sequelize(
//   "postgres://postgres:123@localhost:5432/practiceDB"
// ); // Example for postgres

export var sequelizeObj: any = "";

const dbName:string =  process.env.DB_NAME!;
const dbUsername:string =  process.env.DB_USERNAME! || 'postgres';
const dbPassword:string = process.env.DB_PASSWORD!;
const dbHost:string = process.env.DB_HOST! || 'localhost';
const dbPort:any = process.env.DB_PORT! || 5432;

export function connectTODatabase(){
  try {
    sequelizeObj = new Sequelize(
      dbName,
      dbUsername,
      dbPassword,
      {
        host: dbHost,
        port: dbPort,
        dialect: "postgres",
        omitNull: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        logging: true, // logging : debug, //server.ServerConfig.LogLevel,
        pool: {
          max: 25,
          min:  0,
          idle:  5000,
          acquire: 200000,
        },
      }
    );
    sequelizeObj
      .authenticate()
      .then(() => {
        console.log("Database connection has been established successfully.");
      })
      .catch((err) => {
        console.error("Unable to connect to the database:", err);
      });
  } catch (err) {
    console.log(err);
  }
};

// connectTODatabase();

export function Connect() {
  //connecting with server using sequelize
  var context = sequelizeObj;
  //testing the connection
  // context.authenticate().then(() => {
  //     log.trace('Sequelize','Connection has been established successfully.');
  // }).catch(err => {
  //     log.trace('Sequelize','Error connecting DB: ' + err);
  // });
  return context;
}

// export = sequelize;
