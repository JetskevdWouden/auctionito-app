const express = require('express');
const db = require('./db');

const app = express();               //this is my server

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Listening on port ${port}`));