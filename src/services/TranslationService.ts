import { Repository } from "../repository/Repository";
import db from "../models";
var Sequelize = require("sequelize");
import { Op } from "sequelize";

export class TranslationService<T> {
  protected dbContext: any;
  protected context: any;

  constructor(con) {
    var context = require("../models/translations").Translations(con);

    // super(new Repository(context));

    this.dbContext = context;
    this.context = con;
  }

  // Create service
  async create(translationcode, strTrans) {
    let results: any = await this.context.query(
      "SELECT create_translation(:translationcode,:strTrans)",
      {
        replacements: { translationcode, strTrans },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    return results;
  }

  // Get by id
  // Create service
  async getById(id: number) {
    let results: any = await this.context.query(
      "SELECT * FROM gettranslationbyid(:id)",
      {
        replacements: { id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    return results;
  }

  async getTranslations(pageNo,page,search,localecode) {
    let results: any = await this.context.query(
      "SELECT * FROM getalltranaslation(:pageNo,:page,:search,:localecode)",
      {
        replacements: {pageNo,page,search,localecode},
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    return results;
  }

  // Edit
  async editTranslations(transId,translationcode,strTrans){
    return this.context.query('SELECT edit_translation(:transId,:translationcode,:strTrans)',{
        replacements: {transId,translationcode,strTrans},
        type: Sequelize.QueryTypes.SELECT,
    });
  }

  // Find all
  async findAllTranslations(){
    return this.dbContext.findAll({
          attributes: { exclude: ["createdat", "updatedat"] },
        }); 
    }
    // return result;
}
