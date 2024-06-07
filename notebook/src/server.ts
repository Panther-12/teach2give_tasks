import express, { Response, Request, json } from 'express';
import { config } from './config/db.config';
import mssql from 'mssql';
import bodyParser from 'body-parser';

import noteRouter from './routers/noteRoutes';

const app = express();
const cors = require("cors");

require('dotenv').config()

  
app.use(cors());

// Configure body-parser
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Bind the router
app.use('/notes',noteRouter)

// test connection
async function testConnection(){
    let pool = await mssql.connect(config)

    if(pool.connected){
        console.log("Connection established ...");
        
    }else{
        console.log("Error establishing connection");
    }
}

// test connection
testConnection()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});