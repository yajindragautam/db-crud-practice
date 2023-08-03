"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = require("./src/db/db");
// iport express 
const express_1 = __importDefault(require("express"));
// CReating express app
const app = (0, express_1.default)();
app.use(express_1.default.json());
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: true }));
// parse application/json
app.use(body_parser_1.default.json());
// Import ROUTES
app.use(require('./src/routes/index'));
const PORT = 7000 || process.env.PORT;
//Creating Server
app.listen(PORT, () => {
    console.log(`App is runnign on port ${PORT}`);
    console.log(`Click here http://localhost:${PORT}`);
});
// Import DB Connections
(0, db_1.connectTODatabase)();
