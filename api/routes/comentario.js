const express = require('express');
const router = express.Router();
const config = require('../../config/config');

const mySqlConnection = require('../connection/connection');
const middleware = require('../middleware/middleware')


router.get('/getComentario/:idPub', middleware, (req, res) => {

    const idPub = parseInt(req.params.idPub);
    // console.log(id);
    mySqlConnection.query("select id, \
            id_publicacion_com, \
            comentario, \
            calificacion, \
            activo \
            from comentario where id_publicacion_com = ? and activo ='S'", idPub, (err, rows, fields) => {

        if (!err) {
            res.json({
                ok: 1,
                mensaje: 'Comentarios selecionados',
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

router.get('/getDetalles/:idCom', middleware, (req, res) => {

    const idCom = parseInt(req.params.idCom);
    // console.log(id);
    mySqlConnection.query("select id, \
            id_comentario, \
            descripcion, \
            archivo,\
            tipo_archivo \
            from detalle_comentario where id_comentario = ?", idCom, (err, rows, fields) => {

        if (!err) {
            res.json({
                ok: 1,
                mensaje: 'Detalles selecionados',
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


router.post('/post',middleware, (req, res) => {
    const data = req.body;
    const detalles = data.detalles;
    let error_ = false;

    mySqlConnection.beginTransaction();

    mySqlConnection.query("Insert into comentario ( \
            id_publicacion_com, \
            comentario, \
            calificacion, \
            activo) VALUES (?,?,?,?)",
        [data.id_publicacion_com, data.comentario, data.calificacion, 'S'],
        (err, result, fields) => {
            if (!err) {
                id_C = result.insertId;

                if (detalles.length > 0) {
                    
                    mySqlConnection.query("Insert into detalle_comentario ( \
                                    id_comentario, \
                                    descripcion, \
                                    archivo, \
                                    tipo_archivo) VALUES ?",

                        // [detalles.map(item => 
                        //     [id_C, item.descripcion, item.archivo , item.tipo_archivo])],
                        [detalles.map(element =>
                            [id_C, element.descripcion, element.archivo, element.tipo_archivo]
                        )],
                        (err, result, fields) => {
                            if (err) {
                                mySqlConnection.rollback();
                                res.json({
                                    ok: 0,
                                    mensaje: 'Ha ocurrido un error',
                                    data: null
                                });
                                throw err;
                            }
                            else {
                                mySqlConnection.commit();
                                res.json({
                                    ok: 1,
                                    mensaje: 'Ingreso Correcto',
                                    data: data
                                });
                            }
                        }
                    );
                }

                else {
                    mySqlConnection.commit();
                    res.json({
                        ok: 1,
                        mensaje: 'Ingreso Correcto',
                        data: data
                    });
                }

            } else {
                mySqlConnection.rollback();
                res.json({
                    ok: 0,
                    mensaje: 'Ha ocurrido un error',
                    data: null
                });
            }
        });
    // console.log('end transaction');

});

router.put('/delete/:idCom', middleware, (req, res) => {
    const idCom = req.params.idCom;

    mySqlConnection.query("UPDATE comentario SET activo = 'N' where id = ?",idCom,(err, result,fields) => {
            if (!err) {
                res.json({
                    ok: 1,
                    mensaje: 'Comentario Eliminado',
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

router.put('/update/:idCom', middleware, (req, res) => {
    const data = req.body;
    const idCom = req.params.idCom;

    mySqlConnection.query("UPDATE comentario SET comentario = ? where id = ?",[data.comentario,idCom],(err, result,fields) => {
            if (!err) {
                res.json({
                    ok: 1,
                    mensaje: 'Comentario Editado',
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