require('dotenv').config();
require('./src/db/db');
import bodyParser from 'body-parser';
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
app.use(require('./src/routes/index'));
app.use(require('./src/routes/translation'));
 
const PORT =  process.env.PORT || 7000 ;
//Creating Server

app.listen(PORT, () => {
    console.log(`App is runnign on port ${PORT}`);
    console.log(`Click here http://localhost:${PORT}`);
})
