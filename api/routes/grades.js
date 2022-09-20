const express = require('express');
const router = express.Router();
const config = require('../../config/config');

const mySqlConnection = require('../connection/connection');
const middleware = require('../middleware/middleware')

//Seleccionar calificaciones de aportes
// router.get('/aporte/:idApo', middleware, (req, res) => {
//     const idApo = parseInt(req.params.idApo);
//     // console.log(id);
//     mySqlConnection.query("select id, \
//     id_aporte, \
//     id_usuario_cal, \
//     calificacion, \
//     motivo_cal \
//     from calificacion_aporte where id_aporte = ?", idApo, (err, rows, fields) => {
//         if (!err) {
//             res.json({
//                 ok: 1,
//                 mensaje: 'Calificaciones selecionados',
//                 data: rows
//             });
//         } else {
//             res.json({
//                 ok: 0,
//                 mensaje: 'Ha ocurrido un error',
//                 data: null
//             });
//             // console.log(err);
//         }
//     });
// });



//Seleccionar calificaciones de comentario
router.get('/comentario/:idCom', middleware, (req, res) => {
    const idCom = parseInt(req.params.idCom);
    console.log(id);

    mySqlConnection.query("Select activo FROM comentario WHERE id =?",
        [idCom],
        (err_aux, rows_aux, fields_aux) => {
            // console.log('get com', rows_aux)
            if (rows_aux[0].activo == 'S') {

                mySqlConnection.query("select id, \
                                id_comentario_cal, \
                                id_usuario_cal, \
                                calificacion, \
                                motivo_cal \
                                from calificacion_comentario where id_comentario_cal = ?", idCom, (err, rows, fields) => {
                    if (!err) {
                        res.json({
                            ok: 1,
                            mensaje: 'Calificaciones selecionados',
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
            } else {
                conn.rollback();
                res.json({
                    ok: 0,
                    mensaje: 'Comentario no disponible',
                    data: null
                });
            }
        });
});


//Registro de nuevas calificaciones de aportes
// router.post('/aporte/post', middleware, (req, res) => {
//     const data = req.body;

//     mySqlConnection.query("Insert into calificacion_aporte ( \
//         id_aporte, \
//         id_usuario_cal, \
//         calificacion, \
//         motivo_cal) VALUES (?,?,?,?)",
//         [data.id_aporte, data.id_usuario_cal,
//         data.calificacion, data.motivo_cal],
//         (err, result, fields) => {
//             if (!err) {
//                 res.json({
//                     ok: 1,
//                     mensaje: 'Ingreso Correcto',
//                     data: data
//                 });
//             } else {
//                 res.json({
//                     ok: 0,
//                     mensaje: 'Ha ocurrido un error',
//                     data: null
//                 });
//                 // console.log(err)
//             }
//         }

//     )
// });



//Registro de nuevas calificaciones de comentarios

router.post('/comentario/post', middleware, (req, res) => {
    const data = req.body;

    mySqlConnection.query("Select activo FROM comentario WHERE id =?",
        [idCom],
        (err_aux, rows_aux, fields_aux) => {
            console.log(rows_aux)
            if (rows_aux[0].activo == 'S') {

                mySqlConnection.query("Insert into calificacion_comentario ( \
                    id_comentario_cal, \
                    id_usuario_cal, \
                    calificacion, \
                    motivo_cal) VALUES (?,?,?,?)",
                    [data.id_comentario_cal, data.id_usuario_cal,
                    data.calificacion, data.motivo_cal],
                    (err, result, fields) => {
                        if (!err) {
                            res.json({
                                ok: 1,
                                mensaje: 'Ingreso Correcto',
                                data: aporte
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

            } else {
                conn.rollback();
                res.json({
                    ok: 0,
                    mensaje: 'Comentario no disponible',
                    data: null
                });
            }
        });

});

//actualizar calificacion de aportes
// router.put('/update/aporte/:idCal', middleware, (req, res) => {
//     const idCal = req.params.idCal;
//     const data = req.body; 

//     mySqlConnection.query("UPDATE calificacion_aporte SET calificacion = ?, motivo_cal=? where id = ?",
//     [data.calificacion,data.motivo_cal,idCal],(err, result,fields) => {
//             if (!err) {
//                 res.json({
//                     ok: 1,
//                     mensaje: 'Calificacion Actualizada',
//                     data: null,
//                 });
//             } else {
//                 res.json({
//                     ok: 0,
//                     mensaje: 'Ha ocurrido un error',
//                     data: null
//                 });
//             }
//         }
//     )
// });

//actualizar calificacion de comentarios.
// router.put('/update/comentario/:idCal', middleware, (req, res) => {
//     const idCal = req.params.idCal;
//     const data = req.body;

//     mySqlConnection.query("UPDATE calificacion_comentario SET calificacion = ?, motivo_cal=? where id = ?",
//         [data.calificacion, data.motivo_cal, idCal], (err, result, fields) => {
//             if (!err) {
//                 res.json({
//                     ok: 1,
//                     mensaje: 'Calificacion Actualizada',
//                     data: null,
//                 });
//             } else {
//                 res.json({
//                     ok: 0,
//                     mensaje: 'Ha ocurrido un error',
//                     data: null
//                 });
//             }
//         }
//     )
// });


/////////


//lista de reseñas por usuario de reunion
router.get('/reunionUsuario/:idUsu', middleware, (req, res) => {

    const id = parseInt(req.params.idUsu);
    // console.log(id);

    mySqlConnection.query("SELECT r.id, \
                        r.reseña, \
                        r.calificacion, \
                        r.id_usuario_cali, \
                        u.nombre as usu_cali, \
                        r.id_usuario_rec,\
                        r.id_reunion_cal, \
                        r.creado\
                        from calificacion_reunion as r, usuario as u \
                        where r.id_usuario_rec = u.id \
                        and r.id_usuario_rec = ?", id, (err, rows, fields) => {
        if (!err) {
            res.json({
                ok: 1,
                mensaje: 'Reseñas personales selecionadas',
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


//lista de calificaciones de una reunion
router.get('/reunionId/:idRe', middleware, (req, res) => {
    const id = parseInt(req.params.idRe);
    // console.log(id);
    mySqlConnection.query("Select activo FROM reunion WHERE id =?",
        [id],
        (err_aux, rows_aux, fields_aux) => {

            if (!err_aux && rows_aux.length > 0) {
                if (rows_aux[0].activo == 'S') {
                    mySqlConnection.query("SELECT r.id, \
                            r.motivo_cal, \
                            r.calificacion, \
                            r.id_usuario_cali, \
                            CONCAT(u.nombre,' ',u.apellido) as nombreC,  \
                            u.foto as fotoC, \
                            r.id_usuario_rec,\
                            CONCAT(ur.nombre,' ',ur.apellido) as nombreR,  \
                            ur.foto as fotoR, \
                            r.id_reunion_cal, \
                            r.creado\
                            from calificacion_reunion as r, usuario as u, usuario as ur \
                            where r.id_usuario_cali = u.id \
                            and r.id_usuario_rec = ur.id \
                            and r.id_reunion_cal = ?", id, (err, rows, fields) => {
                        if (!err) {
                            res.json({
                                ok: 1,
                                mensaje: 'Reseñas reuniones selecionadas',
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
                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'Reunión a calificar no disponible',
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

//guardar calificacion reunion
router.post('/post/reunion', middleware, (req, res) => {
    const data = req.body;

    mySqlConnection.query("Select activo, estado, id_usuario_sol, id_usuario_ace \
                FROM reunion WHERE id =?",
        [data.id_reunion_cal],
        (err_aux, rows_aux, fields_aux) => {

            if (!err_aux && rows_aux.length > 0) {
                if (rows_aux[0].activo == 'S') {

                    if (rows_aux[0].estado == 'A' && (rows_aux[0].id_usuario_sol == data.id_usuario_cali || rows_aux[0].id_usuario_ace == data.id_usuario_cali)) {

                        mySqlConnection.query("INSERT INTO calificacion_reunion( \
                        motivo_cal, \
                        calificacion, \
                        id_usuario_cali, \
                        id_usuario_rec, \
                        id_reunion_cal) VALUES (?,?,?,?,?)",
                            [data.motivo_cal, data.calificacion, data.id_usuario_cali, data.id_usuario_rec, data.id_reunion_cal],
                            (err, result, fields) => {
                                if (!err) {
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
                    } else {
                        res.json({
                            ok: 0,
                            mensaje: 'Reunión no puede ser calificada',
                            data: null
                        });
                    }
                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'Reunión a calificar no disponible',
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

// Actualizar calificacion de reunion
router.put('/update/reunion/:idCal', middleware, (req, res) => {

    const data = req.body;
    const idCal = req.params.idCal;

    mySqlConnection.query("Select r.activo, r.estado, r.id_usuario_sol, r.id_usuario_ace as activo \
    FROM reunion r, calificacion_reunion cr \
    WHERE r.id=cr.id_reunion_cal and cr.id =?",
        [idCal],
        (err_aux, rows_aux, fields_aux) => {
            if (!err_aux && rows_aux.length > 0) {

                if (rows_aux[0].activo == 'S') {

                    if (rows_aux[0].estado == 'A' && (rows_aux[0].id_usuario_sol == data.id_usuario_cali || rows_aux[0].id_usuario_ace == data.id_usuario_cali)) {

                        mySqlConnection.query("UPDATE calificacion_reunion SET \
                        motivo_cal=?, \
                        calificacion=? \
                        WHERE id = ?",
                            [data.motivo_cal, data.calificacion, idCal],
                            (err, result, fields) => {
                                if (!err) {
                                    res.json({
                                        ok: 1,
                                        mensaje: 'Calificación Actualizada',
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

                    } else {
                        res.json({
                            ok: 0,
                            mensaje: 'Reunión no puede ser calificada',
                            data: null
                        });
                    }

                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'Reunión a calificar no disponible',
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


//Calificaciones de publicaciones

router.get('/publicacionUsuIdPub/:idPub', middleware, (req, res) => {
    const id_usu = req.data.id;
    // console.log(id_usu)
    const id = parseInt(req.params.idPub);
    // console.log('id_comentario',id);

    mySqlConnection.query("Select activo FROM publicacion WHERE id =?",
        [id],
        (err_aux, rows_aux, fields_aux) => {

            if (!err_aux && rows_aux.length > 0) {
                if (rows_aux[0].activo == 'S') {

                    mySqlConnection.query("SELECT cp.id, \
                        cp.motivo_cal,  \
                        cp.calificacion,  \
                        cp.id_usuario_cal, \
                        CONCAT(u.nombre,' ',u.apellido) as nombre,  \
                        u.foto as foto,  \
                        cp.id_publicacion_cal,  \
                        cp.creacion  \
                        from calificacion_publicacion as cp, usuario as u  \
                        where cp.id_usuario_cal = u.id  \
                        and cp.id_publicacion_cal = ?  \
                        and cp.id_usuario_cal = ? \
                        ORDER BY cp.id DESC", [id, id_usu], (err, rows, fields) => {
                        if (!err) {
                            res.json({
                                ok: 1,
                                mensaje: 'Calificaciones selecionadas',
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
                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'Publicación a calificar no disponible',
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
        })
});

// lista de calificaciones de publicaciones
router.get('/publicacionId/:idPub', middleware, (req, res) => {
    const id = parseInt(req.params.idPub);
    // console.log(id);
    mySqlConnection.query("Select activo FROM publicacion WHERE id =?",
        [id],
        (err_aux, rows_aux, fields_aux) => {

            if (!err_aux && rows_aux.length > 0) {

                if (rows_aux[0].activo == 'S') {

                    mySqlConnection.query("SELECT p.id, \
                            p.motivo_cal, \
                            p.calificacion, \
                            p.id_usuario_cal, \
                            CONCAT(u.nombre,' ',u.apellido) as nombre, \
                            u.foto as foto, \
                            p.id_publicacion_cal, \
                            p.creacion \
                            from calificacion_publicacion as p, usuario as u \
                            where p.id_usuario_cal = u.id \
                            and p.id_publicacion_cal = ? \
                            ORDER BY p.id DESC", id, (err, rows, fields) => {
                        if (!err) {
                            res.json({
                                ok: 1,
                                mensaje: 'Calificaciones selecionadas',
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

                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'Publicación a calificar no disponible',
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
        })
});


//guardar calificacion publicacion
router.post('/post/publicacion', middleware, (req, res) => {
    const data = req.body;


    mySqlConnection.query("Select activo, id_usuario_pub FROM publicacion WHERE id =?",
        [data.id_publicacion_cal],
        (err_aux, rows_aux, fields_aux) => {

            if (!err_aux && rows_aux.length > 0) {

                if (rows_aux[0].activo == 'S' && rows_aux[0].id_usuario_pub != data.id_usuario_cal) {

                    mySqlConnection.query("Select id FROM calificacion_publicacion \
                    WHERE id_usuario_cal = ? and id_publicacion_cal = ?",
                        [data.id_usuario_cal, data.id_publicacion_cal],
                        (err_aux2, rows_aux2, fields_aux) => {

                            if (!err_aux2) {

                                if (rows_aux2.length == 0) {

                                    mySqlConnection.query("INSERT INTO calificacion_publicacion( \
                                    motivo_cal, \
                                    calificacion, \
                                    id_usuario_cal, \
                                    id_publicacion_cal) VALUES (?,?,?,?)",
                                        [data.motivo_cal, data.calificacion, data.id_usuario_cal, data.id_publicacion_cal],
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
                                        })
                                } else {
                                    res.json({
                                        ok: 0,
                                        mensaje: 'No se puede agregar otra calificación',
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

                        })
                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'Publicación a calificar no disponible',
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

        })
});

router.put('/update/publicacion/:idCal', middleware, (req, res) => {

    const data = req.body;
    const idCal = req.params.idCal;

    mySqlConnection.query("Select p.activo as activo FROM publicacion p, calificacion_publicacion cp \
    WHERE p.id=cp.id_publicacion_cal and cp.id =?",
        [idCal],
        (err_aux, rows_aux, fields_aux) => {
            if (!err_aux && rows_aux.length > 0) {

                if (rows_aux[0].activo == 'S') {

                    mySqlConnection.query("UPDATE calificacion_publicacion SET \
                motivo_cal=?, \
                calificacion=? \
                WHERE id = ?",
                        [data.motivo_cal, data.calificacion, idCal],
                        (err, result, fields) => {
                            if (!err) {
                                res.json({
                                    ok: 1,
                                    mensaje: 'Calificación Actualizada',
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

                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'Publicación a calificar no disponible',
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
        })
});


// Calificaciones comentarios
/////////////////////////////////////////////////////

router.get('/comentarioUsuIdCom/:idCom', middleware, (req, res) => {
    const id_usu = req.data.id;
    // console.log(id_usu)
    const id = parseInt(req.params.idCom);
    // console.log('id_comentario',id);
    mySqlConnection.query("Select activo FROM comentario WHERE id =?",
        [id],
        (err_aux, rows_aux, fields_aux) => {
            if (!err_aux && rows_aux.length > 0) {
                if (rows_aux[0].activo == 'S') {
                    mySqlConnection.query("SELECT cc.id, \
                        cc.motivo_cal,  \
                        cc.calificacion,  \
                        cc.id_usuario_cal, \
                        CONCAT(u.nombre,' ',u.apellido) as nombre,  \
                        u.foto as foto,  \
                        cc.id_comentario_cal,  \
                        cc.creacion  \
                        from calificacion_comentario as cc, usuario as u  \
                        where cc.id_usuario_cal = u.id  \
                        and cc.id_comentario_cal = ?  \
                        and cc.id_usuario_cal = ? \
                        ORDER BY cc.id DESC", [id, id_usu], (err, rows, fields) => {
                        if (!err) {
                            res.json({
                                ok: 1,
                                mensaje: 'Calificaciones selecionadas',
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
                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'Comentario a calificar no disponible',
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

router.get('/comentarioId/:id', middleware, (req, res) => {
    // console.log(req.data.id)
    const id = parseInt(req.params.id);
    // console.log(id);
    mySqlConnection.query("Select activo FROM comentario WHERE id =?",
        [id],
        (err_aux, rows_aux, fields_aux) => {
            if (!err_aux && rows_aux.length > 0) {
                if (rows_aux[0].activo == 'S') {

                    mySqlConnection.query("SELECT cc.id, \
                    cc.motivo_cal,  \
                    cc.calificacion,  \
                    cc.id_usuario_cal, \
                    CONCAT(u.nombre,' ',u.apellido) as nombre,  \
                    u.foto as foto,  \
                    cc.id_comentario_cal,  \
                    cc.creacion  \
                    from calificacion_comentario as cc, usuario as u  \
                    where cc.id_usuario_cal = u.id  \
                    and cc.id_comentario_cal = ?  \
                    ORDER BY cc.id DESC", id, (err, rows, fields) => {
                        if (!err) {
                            res.json({
                                ok: 1,
                                mensaje: 'Calificaciones selecionadas',
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
                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'Comentario a calificar no disponible',
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

router.post('/post/comentario', middleware, (req, res) => {
    const data = req.body;

    mySqlConnection.query("Select activo, id_usu_comenta FROM comentario WHERE id =?",
        [data.id_comentario_cal],
        (err_aux, rows_aux, fields_aux) => {
            if (!err_aux && rows_aux.length > 0) {
                if (rows_aux[0].activo == 'S' && rows_aux[0].id_usu_comenta != data.id_usuario_cal) {

                    mySqlConnection.query("Select id FROM calificacion_comentario \
                    WHERE id_usuario_cal = ? and id_comentario_cal = ?",
                        [data.id_usuario_cal, data.id_comentario_cal],
                        (err_aux2, rows_aux2, fields_aux) => {
                            if (!err_aux2) {

                                
                    console.log(data.id_usuario_cal,'id_UsuCa')
                    console.log(data.id_comentario_cal,'id_Com')

                                if (rows_aux2.length == 0) {
                                    console.log('existe', rows_aux2)

                                    mySqlConnection.query("INSERT INTO calificacion_comentario( \
                                        motivo_cal, \
                                        calificacion, \
                                        id_usuario_cal, \
                                        id_comentario_cal) VALUES (?,?,?,?)",
                                        [data.motivo_cal, data.calificacion, data.id_usuario_cal, data.id_comentario_cal],
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
                                } else {
                                    res.json({
                                        ok: 0,
                                        mensaje: 'No se puede agregar otra calificación',
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

                        })
                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'No se puede agregar calificación',
                        data: null
                    });
                }
            } else {
                res.json({
                    ok: 0,
                    mensaje: 'Ha ocurrido un error',
                    data: null
                });
                // console.log(err)
            }
        });
});

router.put('/update/comentario/:idCal', middleware, (req, res) => {

    const data = req.body;
    const idCal = req.params.idCal;

    mySqlConnection.query("Select c.activo as activo FROM comentario c, calificacion_comentario cc \
    WHERE c.id=cc.id_comentario_cal and cc.id =?",
        [idCal],
        (err_aux, rows_aux, fields_aux) => {

            if (!err_aux && rows_aux.length > 0) {

                if (rows_aux[0].activo == 'S') {

                    mySqlConnection.query("UPDATE calificacion_comentario SET \
                        motivo_cal=?, \
                        calificacion=? \
                        WHERE id = ?",
                        [data.motivo_cal, data.calificacion, idCal],
                        (err, result, fields) => {
                            if (!err) {
                                res.json({
                                    ok: 1,
                                    mensaje: 'Calificación Actualizada',
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
                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'Comentario a calificar no disponible',
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