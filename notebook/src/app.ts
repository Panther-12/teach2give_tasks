import express, { Response, Request, json } from 'express';
import bodyParser from 'body-parser';
import noteRouter from './routes/noteRoutes';

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

module.exports = app;