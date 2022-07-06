const express = require('express');
const router = express.Router();
const config = require('../../config/config');

const mySqlConnection = require('../connection/connection');
const middleware = require('../middleware/middleware')

//Seleccionar especialidades de Usuario
router.get('/get/:idUsu', middleware, (req, res) => {
    const id = parseInt(req.params.idUsu);
    // console.log(id);
    mySqlConnection.query("Select eu.id, \
    eu.id_especialidad, \
    e.nombre,e.descripcion, eu.id_usuario \
    from especialidad as e, `especialidad_usuario` as eu \
    where eu.id_especialidad=e.id and eu.id_usuario = ? ", id, (err, rows, fields) => {
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

    mySqlConnection.query("Insert into `especialidad_usuario` ( \
        id_usuario,\
        id_especialidad) VALUES (?,?)",
        [data.id_usuario, data.id_especialidad],
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

router.delete('/delete/:idEU', (req, res) => {
    const idEU = req.params.idEU;

    mySqlConnection.query("Delete from `especialidad_usuario` WHERE id = ?",
        idEU, (err, result, fields) => {
            if (!err) {
                res.json({
                    ok: 1,
                    mensaje: 'Eliminado Correctamente',
                    data: null
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


module.exports = router;