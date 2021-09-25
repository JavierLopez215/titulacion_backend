const express = require('express');
const router = express.Router();
const config = require('../../config/config');

const mySqlConnection = require('../connection/connection');
const middleware = require('../middleware/middleware')

//Seleccionar reuniones usuario
router.get('/getIdUsu/:idUsu', middleware, (req, res) => {
    const id = parseInt(req.params.idUsu);
    // console.log(id);
    mySqlConnection.query("SELECT id, \
        titulo, \
        descripcion, \
        id_usuario_sol, \
        id_usuario_ace, \
        fecha_sol, \
        fecha_ace, \
        hora, \
        estado, \
        activo From reunion WHERE id_usuario_sol = ? and activo='S'", id, (err, rows, fields) => {
        if (!err) {
            res.json({
                ok: 1,
                mensaje: 'Reuniones selecionadas',
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

//Seleccionar reunion por id
router.get('/getIdReu/:idReu', middleware, (req, res) => {
    const id = parseInt(req.params.idReu);
    // console.log(id);
    mySqlConnection.query("SELECT id, \
        titulo, \
        descripcion, \
        id_usuario_sol, \
        id_usuario_ace, \
        fecha_sol, \
        fecha_ace, \
        hora, \
        estado, \
        activo From reunion WHERE id = ? and activo='S'", id, (err, rows, fields) => {
        if (!err) {
            res.json({
                ok: 1,
                mensaje: 'Reunion selecionada',
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

//Ingresar una nueva runion

router.post('/post', (req, res) => {
    const data = req.body;

    mySqlConnection.query("Insert into reunion ( \
        titulo, \
        descripcion, \
        id_usuario_sol, \
        id_usuario_ace, \
        fecha_sol, \
        fecha_ace, \
        hora, \
        estado, \
        activo) VALUES (?,?,?,?,?,?,?,?,?)",
        [data.titulo, data.descripcion,data.id_usuario_sol, null, data.fecha_sol, null, data.hora, data.estado, 'S'],
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

// Aceptar reunion
router.put('/aceptar/:idReu', (req, res) => {

    const data = req.body;
    const idReu = req.params.idReu;

    mySqlConnection.query("UPDATE reunion SET \
        id_usuario_ace=?, \
        fecha_ace=?, \
        estado='A' \
        WHERE id = ?",
        [data.id_usuario_ace, data.fecha_ace, idReu],
        (err, result, fields) => {
            if (!err) {
                res.json({
                    ok: 1,
                    mensaje: 'Reunion Aceptada',
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

router.put('/cancelar/:idReu', (req, res) => {

    const data = req.body;
    const idReu = req.params.idReu;

    mySqlConnection.query("UPDATE reunion SET \
        estado='C' \
        WHERE id = ?",
        idReu,
        (err, result, fields) => {
            if (!err) {
                res.json({
                    ok: 1,
                    mensaje: 'Reunion Cancelada',
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

router.put('/delete/:idReu', (req, res) => {

    const data = req.body;
    const idReu = req.params.idReu;

    mySqlConnection.query("UPDATE reunion SET \
        activo='N' \
        WHERE id = ?",
        idReu,
        (err, result, fields) => {
            if (!err) {
                res.json({
                    ok: 1,
                    mensaje: 'Reunion Eliminada',
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
        });
});


module.exports=router;