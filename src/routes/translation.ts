import express from "express";
import {
  createTranaslation,
  editTranaslation,
  getTranaslationById,
  getTranaslation,
} from "../controllers/translationController";

// Create a route
const routes = express.Router();

// Get
routes.get("/translations", getTranaslation);

// Create Translation
routes.post("/translations", createTranaslation);

// Edit Translation

routes.put("/translations/:id", editTranaslation);

// Get Translation by id
routes.get("/translations/:id", getTranaslationById);

// Export
export = routes;
