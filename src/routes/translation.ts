import express from "express";
import {TranslationController} from "../controllers/translationController";
// import {validate} from '../middlewares'
import { check, validationResult ,checkSchema} from 'express-validator';
import {emailValidator} from '../validators/mailValidator';

// Create a route
const routes = express.Router();

// Get Translation Reports
routes.get("/translations/report", emailValidator,(req,res)=>{
  new TranslationController().getTranslationReport(req,res);
});

// Get
routes.get("/translations", (req,res)=>{
  new TranslationController().getTranaslation(req,res);
});

// Create Translation
routes.post("/translations", (req,res) =>{
  new TranslationController().createTranaslation(req,res)
});

// // Edit Translation

routes.put("/translations/:id", (req,res)=>{
  new TranslationController().editTranaslation(req,res);
});

// Get Translation by id
routes.get("/translations/:id", (req,res)=>{
  new TranslationController().getTranaslationById(req,res);
});

// // Download CSV FILE
routes.get('/download/:url',(req,res)=>{
  new TranslationController().downloadCSVFile(req,res);
});



// Export
export = routes;
