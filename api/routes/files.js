const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const middleware = require('../middleware/middleware');

const mySqlConnection = require('../connection/connection');
const jwt = require('jsonwebtoken');


//Seleccionar datos por id de Usuario
router.get('/aporteUsu/:idUsu', middleware, (req, res) => {
    const id = parseInt(req.params.idUsu);
    // console.log(id);
    mySqlConnection.query("select id, \
    id_usuario_apo, \
    titulo, \
    descripcion, \
    archivo, \
    tipo_archivo, \
    calificacion, \
    activo \
    from aporte where id_usuario_apo = ? and activo='S'", id, (err, rows, fields) => {
        if (!err) {
            res.json({
                ok: 1,
                mensaje: 'Aportes selecionados',
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


//Registro de nuevos Aportes
router.post('/post', (req, res) => {
    const data = req.body;

    mySqlConnection.query("Insert into aporte ( \
                            id_usuario_apo, \
                            titulo, \
                            descripcion, \
                            archivo, \
                            tipo_archivo, \
                            calificacion, \
                            activo) VALUES (?,?,?,?,?,?,?)",
        [data.id_usuario_apo, data.titulo, data.descripcion,
        data.archivo, data.tipo_archivo, data.calificacion, 'S'],
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
                console.log(err)
            }
        }

    )
});

// cambiar estado a inactivo

router.post('/delete/:idApo', middleware, (req, res) => {
    const idApo = req.params.idApo;

    mySqlConnection.query("UPDATE aporte SET activo = 'N' where id = ?",idApo,(err, result,fields) => {
            if (!err) {
                res.json({
                    ok: 1,
                    mensaje: 'Aporte Eliminado',
                    data: null,
                });
            } else {
                res.json({
                    ok: 0,
                    mensaje: 'Ha ocurrido un error',
                    data: null
                });
            }
        }
    )
});

router.post('/update/:idApo', middleware, (req, res) => {
    const idApo = req.params.idApo;
    const data = req.body; 

    mySqlConnection.query("UPDATE aporte SET titulo = ?, descripcion=? where id = ?",
    [data.titulo,data.descripcion,idApo],(err, result,fields) => {
            if (!err) {
                res.json({
                    ok: 1,
                    mensaje: 'Aporte Actualizado',
                    data: null,
                });
            } else {
                res.json({
                    ok: 0,
                    mensaje: 'Ha ocurrido un error',
                    data: null
                });
            }
        }
    )
});
module.exports = router;
