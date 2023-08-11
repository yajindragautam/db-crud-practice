import {Request,Response} from 'express';
import client from '../db/db1';


// Create Student
export const createTranaslation = async(req:Request,res:Response) =>{
    try {
        const {translationcode,translations} = req.body;
        // Query to database
        const query = "SELECT create_translation($1,$2)"
        client.query(query,[JSON.stringify(translationcode),JSON.stringify(translations)], (err, result) => {
            if (err) {
              console.error('Error executing query:', err);
            } else {
              console.log('Function result:', result.rows);
            }
          
            // Disconnect from the PostgreSQL database
            client.end();
        });    
        // console.log('check translation data :',data);
        
        return res.status(201).json({
            message:'Student Created Successfully',
            // data:studentData
        })
    } catch (err:any) {
        console.log(err);
        return res.status(400).json(
            {
                err:err.name,            
                description: err.errors
            }
        );
    }
}
