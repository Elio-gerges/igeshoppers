'use strict';

// Clearing console
console.clear();

// Importing libraries
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ip = require('ip');
const dotenv = require('dotenv');

// Instanciating our express app
// const router = express.Router();
const app = express();
try {

    // Configurating our envariables
    dotenv.config();

    //Importing Error Message
    const { generalError } = require('./Messages/Errors');

    //Getting connection string from the environment variables.
    const conString = process.env.DB_CONNECTION_STRING;

    if(conString) {
        // Connect to Database
        mongoose.connect(conString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }).then(() => {
            console.log('Database Connected Successfully');
        }).catch(err => {
            console.log('Error @ Connect: Failed connection to database:\n' + err);
            process.exit();
        });
    } else {
        throw new Error("Connection String is undefined");
    }

    // Setting body type
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(express.json())

    // Setting CORS
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });

    // Middlewares
    // Importing modules
    const user = require('./user/UserAPI');
    const product = require('./product/ProductAPI');
    const brand = require('./brand/BrandAPI');
    const category = require('./category/CategoryAPI');
    const attribute = require('./attribute/AttributeAPI');
    const subcategories = require('./subcategory/SubcategoryAPI');

    // Setting routes
    app.use('/api/user', user);
    app.use('/api/product', product);
    app.use('/api/product', brand);
    app.use('/api/product', category);
    app.use('/api/product', attribute);
    app.use('/api/product', subcategories);

    //Exposing data
    app.listen(process.env.API_PORT || 3000, process.env.HOST || 'localhost', () => {
        // Releasing the data
        let port = process.env.API_PORT || 3000;
        let host = process.env.HOST || 'localhost';
        let ipAddress = ip.address();
        console.log(`\nApp accessible @\n- http://${host}:${port}\n- http://${ipAddress}:${port}`);
    });

} catch (error) {
    console.error("Error @ API.JS: " + error);
}