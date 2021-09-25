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

const aporteRoute = require ('./api/routes/aporte');
app.use('/aporte', aporteRoute);

const calificacionRoute = require ('./api/routes/calificacion');
app.use('/calificacion', calificacionRoute);

const comentarioRoute = require ('./api/routes/comentario');
app.use('/comentario', comentarioRoute);

const espec_usuRoute = require ('./api/routes/especialidad-usuario');
app.use('/espec-usu', espec_usuRoute);

const especialidadRoute = require ('./api/routes/especialidad');
app.use('/especialidad', especialidadRoute);

const publicacionRoute = require ('./api/routes/publicacion');
app.use('/publicacion', publicacionRoute);

const reunionRoute = require ('./api/routes/reunion');
app.use('/reunion', reunionRoute);
module.exports=app;