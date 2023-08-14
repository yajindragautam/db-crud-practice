require("dotenv").config();
import { Sequelize } from "sequelize";

const connectUrl = process.env.DBCONFIG;
// const sequelize = new Sequelize(connectUrl);
const sequelize = new Sequelize('postgres://postgres:123@localhost:5432/practiceDB') // Example for postgres


const connectTODatabase = (): void => {
  try {
    sequelize
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

connectTODatabase();

export = sequelize;