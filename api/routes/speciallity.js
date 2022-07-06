const express = require('express');
const router = express.Router();
const config = require('../../config/config');

const mySqlConnection = require('../connection/connection');
const middleware = require('../middleware/middleware');

//Seleccionar especialidades
router.get('/get', middleware, (req, res) => {
    const id = parseInt(req.params.idUsu);
    // console.log(id);
    mySqlConnection.query("SELECT id, \
    nombre, \
    descripcion, \
    activo From especialidad WHERE activo='S'", (err, rows, fields) => {
        if (!err) {
            res.json({
                ok: 1,
                mensaje: 'Especialidades selecionadas',
                data: rows
            });
        } else {
            res.json({
                ok: 0,
                mensaje: 'Ha ocurrido un error',
                data: null
            });
            // console.log(err);
        }
    });
});

router.post('/post', (req, res) => {
    const data = req.body;

    mySqlConnection.query("Insert into especialidad ( \
        nombre,\
        descripcion, \
        activo) VALUES (?,?,?)",
        [data.nombre, data.descripcion, 'S'],
        (err, result, fields) => {
            if (!err) {
                res.json({
                    ok: 1,
                    mensaje: 'Ingreso Correcto',
                    data: data
                });
            } else {
                res.json({
                    ok: 0,
                    mensaje: 'Ha ocurrido un error',
                    data: null
                });
                // console.log(err)
            }
        }

    )
});

router.put('/update/:idEsp', (req, res) => {

    const data = req.body;
    const idEsp = req.params.idEsp;

    mySqlConnection.query("UPDATE especialidad SET \
        nombre=?, \
        descripcion=? \
        WHERE id = ?",
        [data.nombre, data.descripcion, idEsp],
        (err, result, fields) => {
            if (!err) {
                res.json({
                    ok: 1,
                    mensaje: 'Especialidad Actualizada',
                    data: data
                });
            } else {
                res.json({
                    ok: 0,
                    mensaje: 'Ha ocurrido un error',
                    data: null
                });
                //  console.log(err)
            }
        }

    )
});


router.put('/delete/:idEsp', (req, res) => {

    const idEsp = req.params.idEsp;

    mySqlConnection.query("UPDATE especialidad SET \
        activo='N' \
        WHERE id = ?",
        idEsp,
        (err, result, fields) => {
            if (!err) {
                res.json({
                    ok: 1,
                    mensaje: 'Especialidad Eliminada',
                    data: null
                });
            } else {
                res.json({
                    ok: 0,
                    mensaje: 'Ha ocurrido un error',
                    data: null
                });
                //  console.log(err)
            }
        }

    )
});


module.exports=router;
