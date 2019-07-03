const express = require('express');
const db = require('./db');
//bodyparser

//MODELS
const User = require('./user/model');

//ROUTERS

const app = express();               //this is my server


//jsonParser

//APP.USE ROUTERS





const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Listening on port ${port}`));