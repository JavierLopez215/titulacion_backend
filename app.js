const express = require('express');
const app = express();
// const bodyParser = require('body-parser');
const cors = require('cors');

//  app.use(bodyParser.urlencoded({extended:false}));
//  app.use(bodyParser.json());

app.use(express.urlencoded({extended: true}));
app.use(express.json())

// app.use(express.json);
app.use(cors());

//ROUTES

const userRoute = require ('./api/routes/users');
app.use('/user', userRoute);

module.exports=app;