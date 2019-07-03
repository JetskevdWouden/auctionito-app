const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');


//MODELS
const User = require('./user/model');
const Advert = require('./advert/model');
const ContactInfo = require('./contact_info/model');

//ROUTERS
const authRouter = require('./auth/router');
const userRouter = require('./user/router');
const advertRouter = require('./advert/router');
// const contactInfoRouter = require('./contact_info/router');


const app = express();               //this is my server

//jsonParser
const jsonParser = bodyParser.json()

//APP.USE ROUTERS
app.use(cors());
app.use(jsonParser);
app.use(authRouter);
app.use(userRouter);
app.use(advertRouter);
//app.use(contactInfoRouter);


const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Listening on port ${port}`));