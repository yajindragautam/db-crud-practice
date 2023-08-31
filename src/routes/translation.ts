import express from "express";
import {TranslationController} from "../controllers/translationController";
// import {validate} from '../middlewares'
import { check, validationResult ,checkSchema} from 'express-validator';
import {emailValidator} from '../validators/mailValidator';

// Create a route
const routes = express.Router();

// Get Translation Reports
routes.get("/translations/report", emailValidator,(req,res,next)=>{
  new TranslationController().getTranslationReport(req,res,next);
});

// Get
routes.get("/translations", (req,res,next)=>{
  new TranslationController().getTranaslation(req,res,next);
});

// Create Translation
routes.post("/translations", (req,res,next) =>{
  new TranslationController().createTranaslation(req,res,next)
});

// // Edit Translation

routes.put("/translations/:id", (req,res,next)=>{
  new TranslationController().editTranaslation(req,res,next);
});

// Get Translation by id
routes.get("/translations/:id", (req,res,next)=>{
  new TranslationController().getTranaslationById(req,res,next);
});

// // Download CSV FILE
routes.get('/download/:url',(req,res)=>{
  new TranslationController().downloadCSVFile(req,res);
});



// Export
export = routes;
