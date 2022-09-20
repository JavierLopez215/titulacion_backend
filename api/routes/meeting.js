const express = require('express');
const router = express.Router();
const config = require('../../config/config');

const mySqlConnection = require('../connection/connection');
const middleware = require('../middleware/middleware')


//Seleccionar reuniones aceptadas del usuario
router.get('/aceptadas/getIdUsuSol/:idUsu', middleware, (req, res) => {
    const id = parseInt(req.params.idUsu);
    // console.log(id);
    mySqlConnection.query("SELECT reu.id, \
            reu.titulo, \
            reu.descripcion, \
            reu.id_usuario_sol,\
            reu.id_usuario_ace, \
            CONCAT(usu_ace.nombre,' ', usu_ace.apellido) as nombreA, \
            usu_ace.foto,\
            reu.fecha_sol, \
            reu.fecha_ace, \
            reu.hora, \
            reu.estado, \
            reu.activo From reunion reu, usuario usu_ace \
            WHERE reu.id_usuario_ace=usu_ace.id\
            and reu.fecha_sol >= CURDATE() \
            and id_usuario_sol = ? and reu.activo='S'and reu.estado='A'", id, (err, rows, fields) => {
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
            // console.log(err);
        }
    });
});

//Seleccionar historial de reuniones usuario
router.get('/historial/getIdUsuSol/:idUsu', middleware, (req, res) => {
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
        activo From reunion WHERE id_usuario_sol = ? \
        and activo='S' order by id desc", id, (err, rows, fields) => {
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
            // console.log(err);
        }
    });
});

//Seleccionar reuniones de la comunidad aceptadas del usuario
router.get('/aceptadasComunidad/getIdUsuSol/:idUsu', middleware, (req, res) => {
    const id = parseInt(req.params.idUsu);
    // console.log(id);
    mySqlConnection.query("SELECT reu.id, \
            reu.titulo, \
            reu.descripcion, \
            reu.id_usuario_sol,\
            reu.id_usuario_ace, \
            CONCAT(usu_ace.nombre,' ', usu_ace.apellido) as nombreA, \
            usu_ace.foto,\
            reu.fecha_sol, \
            reu.fecha_ace, \
            reu.hora, \
            reu.estado, \
            reu.activo From reunion reu, usuario usu_ace \
            WHERE reu.id_usuario_ace=usu_ace.id\
            and reu.fecha_sol >= CURDATE() \
            and reu.id_usuario_ace = ? and reu.activo='S'and reu.estado='A'", id, (err, rows, fields) => {
        if (!err) {
            res.json({
                ok: 1,
                mensaje: 'Reuniones selecionadas',
                data: rows
            });
        } else {
            // console.log(err);
            res.json({
                ok: 0,
                mensaje: 'Ha ocurrido un error',
                data: null
            });

        }
    });
});

//Seleccionar historial de reuniones comunidad
router.get('/historialComunidad/getIdUsuSol/:idUsu', middleware, (req, res) => {
    const id = parseInt(req.params.idUsu);
    // console.log(id);
    mySqlConnection.query("SELECT id, \
    titulo,  \
    descripcion,  \
    id_usuario_sol,  \
    id_usuario_ace,  \
    fecha_sol,  \
    fecha_ace,  \
    hora,  \
    estado,  \
    activo From reunion WHERE id_usuario_sol <> ?  \
    and fecha_sol >= CURDATE() \
    and activo='S' and estado='P' \
    UNION \
    SELECT id,  \
    titulo,  \
    descripcion,  \
    id_usuario_sol,  \
    id_usuario_ace,  \
    fecha_sol,  \
    fecha_ace,  \
    hora,  \
    estado,  \
    activo From reunion WHERE id_usuario_ace = ?  \
    and fecha_sol < CURDATE() and activo='S' and estado='A'", [id, id], (err, rows, fields) => {
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
            // console.log(err);
        }
    });
});

//Seleccionar reunion por id Aceptada
router.get('/getIdReu/:idReu', middleware, (req, res) => {
    const idUsu = req.data.id;
    const id = parseInt(req.params.idReu);
    // console.log(id)
    // console.log(id);
    mySqlConnection.query("SELECT reu.id, \
    reu.titulo, \
    reu.descripcion, \
    reu.id_usuario_sol, \
    reu.id_usuario_ace, \
    CONCAT(usu_sol.nombre,' ', usu_sol.apellido) as nombreS, \
    CONCAT(usu_ace.nombre,' ', usu_ace.apellido) as nombreA, \
    usu_sol.foto as fotoS, \
    usu_ace.foto as fotoA, \
    usu_sol.telefono as telefonoS, \
    usu_ace.telefono as telefonoA, \
    usu_sol.correo as correoS, \
    usu_ace.correo as correoA, \
    reu.fecha_sol, \
    reu.fecha_ace, \
    reu.hora, \
    reu.estado, \
    reu.activo From reunion reu, usuario usu_sol, usuario usu_ace \
    WHERE reu.id_usuario_sol=usu_sol.id \
    and reu.id_usuario_ace=usu_ace.id \
    and reu.id = ? and reu.activo='S'and reu.estado='A'", id, (err, rows, fields) => {
        if (!err) {

            if (rows.length > 0) {

                if (rows[0].id_usuario_sol == idUsu) {

                    res.json({
                        ok: 1,
                        mensaje: 'Reunion selecionada',
                        data: rows
                    });

                } else {
                    if (rows[0].id_usuario_ace == idUsu) {
                        res.json({
                            ok: 1,
                            mensaje: 'Reunion selecionada',
                            data: rows
                        });
                    } else {
                        res.json({
                            ok: 0,
                            mensaje: 'No se puede mostrar ningón dato',
                            data: null
                        });
                    }
                }
            } else {
                res.json({
                    ok: 1,
                    mensaje: 'Reunion selecionada',
                    data: rows
                });
            }

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

//Seleccionar reunion por id Pendiente
router.get('/getIdReuP/:idReu', middleware, (req, res) => {
    idUsu = req.data.id;
    const id = parseInt(req.params.idReu);
    mySqlConnection.query("SELECT reu.id, \
        reu.titulo, \
        reu.descripcion, \
        reu.id_usuario_sol, \
        reu.id_usuario_ace, \
        CONCAT(usu_sol.nombre,' ', usu_sol.apellido) as nombreS, \
        usu_sol.foto as fotoS, \
        usu_sol.telefono as telefonoS, \
        usu_sol.correo as correoS, \
        reu.fecha_sol, \
        reu.fecha_ace, \
        reu.hora, \
        reu.estado, \
        reu.activo From reunion reu, usuario usu_sol \
        WHERE reu.id_usuario_sol=usu_sol.id \
        and reu.id = ? and reu.activo='S'", id, (err, rows, fields) => {
        if (!err) {

            if (rows.length > 0) {
                if (rows[0].estado == 'A') {
                    if (rows[0].id_usuario_sol == idUsu) {
                        res.json({
                            ok: 1,
                            mensaje: 'Reunion selecionada',
                            data: rows
                        });
                    } else {
                        if (rows[0].id_usuario_ace == idUsu) {
                            res.json({
                                ok: 1,
                                mensaje: 'Reunion selecionada',
                                data: rows
                            });
                        } else {
                            res.json({
                                ok: 1,
                                mensaje: 'Reunion selecionada',
                                data: []
                            });
                        }
                    }
                } else {
                    res.json({
                        ok: 1,
                        mensaje: 'Reunion selecionada',
                        data: rows
                    });
                }
            } else {
                res.json({
                    ok: 1,
                    mensaje: 'Reunion selecionada',
                    data: []
                });
            }


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

//Ingresar una nueva reunion
router.post('/post', (req, res) => {
    const data = req.body;
    // console.log(data);
    const fecha_sol_aux = ((data.fecha_sol).split('T')[0]);

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
        [data.titulo, data.descripcion, data.id_usuario_sol, null, fecha_sol_aux, null, data.hora, data.estado, 'S'],
        (err, result, fields) => {
            if (!err) {
                // console.log(result)
                res.json({
                    ok: 1,
                    mensaje: 'Ingreso Correcto',
                    data: data
                });
            } else {
                // console.log(err)
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

    // Select activo, estado, IF( NOW() <= TIMESTAMP(fecha_sol,hora), 'S', 'N') as tiempo FROM reunion WHERE id =26

    mySqlConnection.query("Select activo, estado, IF( NOW() <= TIMESTAMP(fecha_sol,hora), 'S', 'N') as atiempo  FROM reunion WHERE id =?",
        [idReu],
        (err_aux, rows_aux, fields_aux) => {

            if (!err_aux && rows_aux.length > 0) {
                if (rows_aux[0].activo == 'S' && rows_aux[0].estado == 'P') {

                    if (rows_aux[0].atiempo == 'S') {


                        mySqlConnection.query("UPDATE reunion SET \
                        id_usuario_ace=?, \
                        fecha_ace=CURDATE(), \
                        estado='A' \
                        WHERE id = ?",
                            [data.id_usuario_ace, idReu],
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
                                    // console.log(err)
                                }
                            }

                        )
                    }
                    else {
                        res.json({
                            ok: 0,
                            mensaje: 'Se supero la fecha y hora de la reunión',
                            data: null
                        });
                    }
                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'Reunion no disponible',
                        data: null
                    });
                }
            } else {
                res.json({
                    ok: 0,
                    mensaje: 'Ha ocurrido un error',
                    data: null
                });
            }
        });
});

router.put('/cancelar/:idReu', (req, res) => {

    const data = req.body;
    const idReu = req.params.idReu;

    mySqlConnection.query("Select activo, estado FROM reunion WHERE id =?",
        [idReu],
        (err_aux, rows_aux, fields_aux) => {

            if (!err_aux && rows_aux.length > 0) {
                if (rows_aux[0].activo == 'S' && rows_aux[0].estado == 'P') {

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
                                // console.log(err)
                            }
                        }
                    )
                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'Reunion no disponible',
                        data: null
                    });
                }
            } else {
                res.json({
                    ok: 0,
                    mensaje: 'Ha ocurrido un error',
                    data: null
                });
            }
        });
});


router.put('/delete/:idReu', (req, res) => {

    const data = req.body;
    const idReu = req.params.idReu;
    // console.log(idReu)

    mySqlConnection.query("Select activo, estado FROM reunion WHERE id =?",
        [idReu],
        (err_aux, rows_aux, fields_aux) => {

            if (!err_aux && rows_aux.length > 0) {
                if (rows_aux[0].activo == 'S' && rows_aux[0].estado == 'P') {
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
                                // console.log(err)
                                res.json({
                                    ok: 0,
                                    mensaje: 'Ha ocurrido un error',
                                    data: null
                                });
                                // console.log(err)
                            }
                        });

                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'Reunion no disponible',
                        data: null
                    });
                }
            } else {
                res.json({
                    ok: 0,
                    mensaje: 'Ha ocurrido un error',
                    data: null
                });
            }
        });
});


module.exports = router;
