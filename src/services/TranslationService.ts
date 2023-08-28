import { Repository } from "../repository/Repository";
import db from '../models';
var Sequelize = require("sequelize");
import {Op} from 'sequelize';

export class TranslationService<T>{

    protected dbContext : any;
    protected context : any;

    constructor(con) {
        var context = require("../models/translations").Translations(con);
        console.log('context :',context);
        
        // super(new Repository(context));
        
        this.dbContext = con;
        this.context = con;

    }

    // Create service
    async create(translationcode,strTrans) 
    {
        var results: any = await this.context.query('SELECT create_translation(:translationcode,:strTrans)', {
            replacements: {  translationcode, strTrans}, type: Sequelize.QueryTypes.SELECT
        });   
        
        return results;
    }
}