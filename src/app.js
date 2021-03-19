'use strict';

// Importing libraries
const express = require('express');
const ip = require('ip');
const path = require('path');

// Clearing the console
console.clear();

// Instanciating our express app
const app = express();

try {

    // Configurating our envariables
    const dotenv = require('dotenv');
    dotenv.config();

    // Serving public folder
    var __dirpublic = 'public';
    app.use(express.static(path.join(__dirname, '../' + __dirpublic)));

    app.get('/', async (req, res) => {
        res.redirect('/index.html');
    });

    app.get('*', async (req, res) => {
        res.status(404).send('<h1>Error 404: Page not Found</h1>');
    });

    //Exposing data
    app.listen(process.env.WEB_PORT || 3000, process.env.HOST || 'localhost', () => {
        // Releasing the data
        let port = process.env.WEB_PORT || 3000;
        let host = process.env.HOST || 'localhost';
        let ipAddress = ip.address();
        console.log(`\nApp accessible @\n- http://${host}:${port}\n- http://${ipAddress}:${port}`);
    });
} catch (error) {
    console.error("Error @ APP.JS: " + error);
}