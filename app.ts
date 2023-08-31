require('dotenv').config();
import {connectTODatabase} from './src/db/db';
import bodyParser from 'body-parser';
import * as logger from "./logger";
// iport express 
import express from 'express';

// CReating express app
const app = express();  

app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Import ROUTES
app.use(require('./src/routes/translation'));
app.use('*',(req,res)=>{
  res.status(404).json({message:"Not Found"});
});
 
const PORT =  process.env.PORT || 7000 ;
//Creating Server

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  let statusCode = 500;

  // Check the type of error and set the status code accordingly
  if (err instanceof SyntaxError && err[0].status === 400 && 'body' in err) {
    statusCode = 400;
  } else if (err.status) {
    statusCode = err.status;
  }
  
  res.status(statusCode).json({ error: err.errors[0]?.message });
});

app.listen(PORT, () => {
    console.log(`App is runnign on port ${PORT}`);
    console.log(`Click here http://localhost:${PORT}`);
})


connectTODatabase();