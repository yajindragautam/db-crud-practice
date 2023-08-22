import express from "express";
import {
  createTranaslation,
  editTranaslation,
  getTranaslationById,
  getTranaslation,
  getTranslationReport,
  downloadCSVFile
} from "../controllers/translationController";
// import {validate} from '../middlewares'
import {emailValidator} from '../validators/mailValidator';

// Create a route
const routes = express.Router();

// Get Translation Reports
routes.get("/translations/report", getTranslationReport);

// Get
routes.get("/translations", getTranaslation);

// Create Translation
routes.post("/translations", createTranaslation);

// Edit Translation

routes.put("/translations/:id", editTranaslation);

// Get Translation by id
routes.get("/translations/:id", getTranaslationById);

// Download CSV FILE
routes.get('/download/:url',downloadCSVFile)



// Export
export = routes;
