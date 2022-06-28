const express = require('express');
const router = express.Router();
const config = require('../../config/config');

const mySqlConnection = require('../connection/connection');
const middleware = require('../middleware/middleware');

router.get('/getLabels', middleware, (req, res) => {
    const id = parseInt(req.params.idUsu);
    // console.log(id);
    mySqlConnection.query("SELECT id, \
    etiqueta,\
    creado From etiqueta WHERE activo='S'", (err, rows, fields) => {
        if (!err) {
            res.json({
                ok: 1,
                mensaje: 'Etiquetas selecionadas',
                data: rows
            });
        } else {
            res.json({
                ok: 0,
                mensaje: 'Ha ocurrido un error',
                data: null
            });
            console.log(err);
        }
    });
});

module.exports=router;