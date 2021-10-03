const express = require('express');
const router = express.Router();
const config = require('../../config/config');

const mySqlConnection = require('../connection/connection');
const middleware = require('../middleware/middleware')

//Seleccionar calificaciones de aportes
router.get('/aporte/:idApo', middleware, (req, res) => {
    const idApo = parseInt(req.params.idApo);
    // console.log(id);
    mySqlConnection.query("select id, \
    id_aporte, \
    id_usuario_cal, \
    calificacion, \
    motivo_cal \
    from calificacion_aporte where id_aporte = ?", idApo, (err, rows, fields) => {
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
            console.log(err);
        }
    });
});

//Seleccionar calificaciones de aportes
router.get('/comentario/:idCom', middleware, (req, res) => {
    const idCom = parseInt(req.params.idCom);
    // console.log(id);
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
            console.log(err);
        }
    });
});


//Registro de nuevas calificaciones de aportes
router.post('/aporte/post', (req, res) => {
    const data = req.body;

    mySqlConnection.query("Insert into calificacion_aporte ( \
        id_aporte, \
        id_usuario_cal, \
        calificacion, \
        motivo_cal) VALUES (?,?,?,?)",
        [data.id_aporte, data.id_usuario_cal,
        data.calificacion, data.motivo_cal],
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

//Registro de nuevas calificaciones de comentarios
router.post('/comentario/post', (req, res) => {
    const data = req.body;

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
});

router.put('/update/aporte/:idCal', middleware, (req, res) => {
    const idCal = req.params.idCal;
    const data = req.body; 

    mySqlConnection.query("UPDATE calificacion_aporte SET calificacion = ?, motivo_cal=? where id = ?",
    [data.calificacion,data.motivo_cal,idCal],(err, result,fields) => {
            if (!err) {
                res.json({
                    ok: 1,
                    mensaje: 'Calificacion Actualizada',
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

router.put('/update/comentario/:idCal', middleware, (req, res) => {
    const idCal = req.params.idCal;
    const data = req.body; 

    mySqlConnection.query("UPDATE calificacion_comentario SET calificacion = ?, motivo_cal=? where id = ?",
    [data.calificacion,data.motivo_cal,idCal],(err, result,fields) => {
            if (!err) {
                res.json({
                    ok: 1,
                    mensaje: 'Calificacion Actualizada',
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


/////////


//lista de reseñas por usuario
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
            console.log(err);
        }
    });
});


//lista de calificaciones de una reunion
router.get('/reunionId/:idRe', middleware, (req, res) => {
    const id = parseInt(req.params.idRe);
    console.log(id);
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
            console.log(err);
        }
    });
});


router.post('/post/reunion', (req, res) => {
    const data = req.body;

    mySqlConnection.query("INSERT INTO calificacion_reunion( \
        reseña, \
        calificacion, \
        id_usuario_cali, \
        id_usuario_rec, \
        id_reunion_cal) VALUES (?,?,?,?,?)",
        [data.reseña, data.calificacion, data.id_usuario_cali, data.id_usuario_rec, data.id_reunion_cal],
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


// Actualizar calificacion de reunion
router.put('/update/reunion/:idCal', (req, res) => {

    const data = req.body;
    const idCal = req.params.idCal;

    mySqlConnection.query("UPDATE calificacion_reunion SET \
        reseña=?, \
        calificacion=? \
        WHERE id = ?",
        [data.reseña, data.calificacion, idCal],
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
                 console.log(err)
            }
        }

    )
});

module.exports=router;