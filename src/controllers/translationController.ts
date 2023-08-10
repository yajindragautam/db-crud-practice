import db from '../models';
import {Request,Response} from 'express';
import client from '../db/db1';


// Create Student
export const createTranaslation = async(req:Request,res:Response) =>{
    try {
        console.log('Translation COntroller Hits......');
        const params1:string = "Sijan";
        const params2:string = "sijan@gmail.com";
        const params3 = [{"code":"java","marks":80}];
        const query = `SELECT create_student($1,$2)`;   
        console.log('Checking query :',query);
        
        client.query(query,[params1,params2], (err, result) => {
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
