import { Request, Response } from "express";
import db from "../models";
import sequelize from "../db/db";

// Create Translations
export const createTranaslation = async (req: Request, res: Response) => {
  try {
    const { translationcode, translations } = req.body;
    const strTrans = JSON.stringify(translations);
    // Query to database [JSON.stringify(translationcode),JSON.stringify(translations)]
    const query = "SELECT create_translation(:translationcode,:strTrans)";
    const result = await sequelize.query(query, {
      replacements: { translationcode, strTrans },
    });

    return res.status(201).json({
      message: "Created Successfully",
      //   data: result.message,
    });
  } catch (err: any) {
    // console.log(err);
    return res.status(400).json({
      err: err.name,
      description: err.errors[0]?.message,
    });
  }
};

export const editTranaslation = async (req: Request, res: Response) => {
  try {
    const { translationcode, translations } = req.body;
    const strTrans = JSON.stringify(translations);
    const transId = req.params.id;
    // query
    const query =
      "SELECT edit_translation(:transId,:translationcode,:strTrans)";
    const result = await sequelize.query(query, {
      replacements: { transId, translationcode, strTrans },
    });
    // Disconnect from the PostgreSQL database
    console.log("Function result:", result);

    // client.end();
    // console.log('check translation data :',data);

    return res.status(201).json({
      message: "Updated Successfully",
      // data: result?.data
    });
  } catch (err: any) {
    console.log(err);
    return res.status(400).json({
      err: err.name,
      description: err.errors[0]?.message,
    });
  }
};

// Get Translation BY ID
export const getTranaslationById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const query = "SELECT gettranslationbyid(:id)";
    // [req.params.id]
    const result: any = await sequelize.query(query, {
      replacements: { id },
    });
    // Disconnect from the PostgreSQL database
    // console.log("Function result:",result);
    let opt;
    result[0].map((item: any) => {
      const { text, localcode, translationcode } = item;
      // console.log(item);
      opt = item;
    });

    return res.status(201).json({
      data: opt,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(400).json({
      err: err.name,
      description: err.errors[0]?.message,
    });
  }
};

export const getTranaslation = async (req: Request, res: Response) => {
  try {
    const query = "SELECT getalltranaslation()";
    // [req.params.id]
    const result: any = await sequelize.query(query);
    // console.log(result);
    const outputData ={
      Translations: result[0].map((row: any) => ({
        translationcodeid: row.getalltranaslation[0].translationcodeid,
        translations:[{
          languagetext: row.getalltranaslation[0].languagetext,
          localeid: row.getalltranaslation[0].localeid
        }]
      })),
    } 
    return res.status(200).json(outputData)
  } catch (err: any) {
    console.log(err);
    return res.status(400).json({
      err: err.name,
      description: err.errors[0]?.message,
    });
  }
};
