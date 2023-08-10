require('dotenv').config();
import bodyParser from 'body-parser';
import {connectTODatabase} from './src/db/db';
// iport express 
import express from 'express';

// CReating express app
const app = express();  

app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// Import ROUTES
app.use(require('./src/routes/index'));
app.use(require('./src/routes/translation'));
 
const PORT = 7000 || process.env.PORT;
//Creating Server

app.listen(PORT, () => {
    console.log(`App is runnign on port ${PORT}`);
    console.log(`Click here http://localhost:${PORT}`);
})
// Import DB Connections
connectTODatabase()