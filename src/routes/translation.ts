import  express from "express";
import {Request,Response} from 'express'
import {createTranaslation} from '../controllers/translationController';

// Create a route
const routes = express.Router();

// test
routes.get('/translations',(req:Request,res:Response)=>{
    return res.status(200).json({message:"Transaltion route is working good."});
});

// Create Translation
routes.post("/translations",createTranaslation);

// Export
export = routes;