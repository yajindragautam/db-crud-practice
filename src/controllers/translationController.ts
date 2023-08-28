import { Request, Response } from "express";
import db from "../models";
import {Connect} from '../db/db';
import { createExcel } from "../helpers/createxcel";
import { createAndSendEmail } from "../helpers/mailsender";
import {TranslationService} from '../services/TranslationService';
import path from "path";
import { Op } from "sequelize";
import { check, validationResult } from "express-validator";
// import sequelize from "../db/db";

export class TranslationController{

  async createTranaslation(req:Request,res:Response){
    const context = await Connect();
    try {
      let translationService = new TranslationService(context);

      const { translationcode, translations } = req.body;
      const strTrans = JSON.stringify(translations);
      // Query to database [JSON.stringify(translationcode),JSON.stringify(translations)]
      // const query = "SELECT create_translation(:translationcode,:strTrans)";
      // const result: any = await sequelize.query(query, {
      //   replacements: { translationcode, strTrans },
      // });
      let result = await translationService.create(translationcode,strTrans);
  
      return res.json({
        data: result[0],
      });
    } catch (err: any) {
      console.log(err);
      return res.status(400).json({
        err: err.name,
        description: err.errors[0]?.message,
      });
    }
  }
}





// // Create Translations
// export const createTranaslation = async (req: Request, res: Response) => {
  
// };

// export const editTranaslation = async (req: Request, res: Response) => {
//   try {
//     const { translationcode, translations } = req.body;
//     const strTrans = JSON.stringify(translations);
//     const transId = req.params.id;
//     // query
//     const query =
//       "SELECT edit_translation(:transId,:translationcode,:strTrans)";
//     const result = await sequelize.query(query, {
//       replacements: { transId, translationcode, strTrans },
//     });

//     return res.status(201).json({
//       data: result[0],
//     });
//   } catch (err: any) {
//     console.log(err);
//     return res.status(400).json({
//       err: err.name,
//       description: err.errors[0]?.message,
//     });
//   }
// };

// // Get Translation BY ID
// export const getTranaslationById = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const query = "SELECT * FROM gettranslationbyid(:id)";
//     const result: any = await sequelize.query(query, {
//       replacements: { id },
//     });

//     return res.status(201).json({
//       TranslationById: result[0].map((item: any) => ({
//         languagetext: item.gettranslationbyid.text,
//         localcode: item.gettranslationbyid.localcode,
//         translationcode: item.gettranslationbyid.translationcode,
//       })),
//     });
//   } catch (err: any) {
//     console.log(err);
//     return res.status(400).json({
//       err: err.name,
//       description: err.errors[0]?.message,
//     });
//   }
// };

// export const getTranaslation = async (req: Request, res: Response) => {
//   try {
//     let { pageNo, page, search, localecode } = req.query;
//     localecode === undefined ? (localecode = null!) : localecode;
//     pageNo === undefined ? (pageNo = null!) : pageNo;
//     page === undefined ? (page = null!) : page;
//     search === undefined ? (search = null!) : search;
//     // console.log("page :", page, "pageNo", pageNo, "search :", search,"localecode :", localecode);
//     const query =
//       "SELECT * FROM getalltranaslation(:pageNo,:page,:search,:localecode)";
//     // [req.params.id]
//     const result: any = await sequelize.query(query, {
//       replacements: { pageNo, page, search, localecode },
//     });

//     // const outputData ={
//     //   Translations: result[0].map((row: any,i) => (
//     //     {
//     //     test: row.getalltranaslation,
//     //     translationcodeid: row.getalltranaslation[i].translationcodeid,
//     //     translations:[{
//     //       languagetext: row.getalltranaslation[i].languagetext,
//     //       localeid: row.getalltranaslation[i].localeid
//     //     }]
//     //   }))
//     // }

//     // result[0][0].getalltranaslation
//     return res.status(200).json(result[0]);
//   } catch (err: any) {
//     console.log(err);
//     return res.status(400).json({
//       err: err.name,
//       description: err.errors[0]?.message,
//     });
//   }
// };

// // GET: translations report in excel inside email
// export const getTranslationReport = async (req: Request, res: Response) => {
//   try {
//     // Get all translation data
//     // {
//     //   include: [
//     //     {
//     //       model: db.translationcodes,
//     //       as: "translationCodesDetails",
//     //       // attributes: ['translationcode']
//     //       // Specify the correct association and columns you want to include
//     //       // For example, if you want to include 'translationcode', do it like this:

//     //     },
//     //   ],
//     // }
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const tsData = await db.translations.findAll({
//       attributes: { exclude: ["createdat", "updatedat"] },
//     });

//     // Create a excel file set data
//     const buffer: any = await createExcel(tsData, res);
//     const email = req.query.email;
//     let cmsUrl = process.env.CMS_URL || `http://localhost:${process.env.PORT}`;

//     await createAndSendEmail(email, buffer[0],cmsUrl.concat('download/:',path.basename(buffer[1])));
//     // Send the buffer as the response
//     return res.status(200).json({
//       message: "Email Sent Success..!",
//       details: "Please check your email to down file.",
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

// // Download CSV file

// export const downloadCSVFile = (req: Request, res: Response) => {
//   try {
//     const fileUrl = path.join(
//       __dirname,
//       `../../public/downloads/${req.params.url.replace(":", "")}`
//     );
//     return res.download(fileUrl);
//   } catch (err) {
//     console.log(err);
//   }
// };
