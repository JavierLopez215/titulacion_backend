const express = require('express');
const router = express.Router();
const config = require('../../config/config');

const mySqlConnection = require('../connection/connection');
const middleware = require('../middleware/middleware');

//obtener publicacion por su id
router.get('/getPubId/:idPub', middleware, (req, res) => {

    const idPub = parseInt(req.params.idPub);
    // console.log(id);
    mySqlConnection.query("select id, \
    id_usuario_pub, \
    titulo, \
    descripcion, \
    estado, \
    id_especialidad, \
    activo \
    from publicacion where id = ? and activo ='S'", idPub, (err, rows, fields) => {

        if (!err) {
            res.json({
                ok: 1,
                mensaje: 'Publicaciones selecionados',
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

//lista de publicaciones de un usuario
router.get('/getPubUser/:idPub', middleware, (req, res) => {

    const idPub = parseInt(req.params.idPub);
    // console.log(id);
    mySqlConnection.query("select id, \
    id_usuario_pub, \
    titulo, \
    descripcion, \
    estado, \
    id_especialidad, \
    activo \
    from publicacion where id_usuario_pub = ? and activo ='S'", idPub, (err, rows, fields) => {

        if (!err) {
            res.json({
                ok: 1,
                mensaje: 'Publicaciones selecionadas',
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

//lista detalles
router.get('/getDetalles/:idPub', middleware, (req, res) => {

    const idPub = parseInt(req.params.idPub);
    // console.log(id);
    mySqlConnection.query("select id, \
            id_publicacion, \
            descripcion, \
            archivo, \
            tipo_archivo \
            from detalle_publicacion where id_publicacion = ?", idPub, (err, rows, fields) => {

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

//ingreso de publicaciones
router.post('/post', middleware, (req, res) => {
    const data = req.body;
    const detalles = data.detalles;
    let error_ = false;

    mySqlConnection.beginTransaction();

    mySqlConnection.query("Insert into publicacion ( \
            id_usuario_pub, \
            titulo, \
            descripcion, \
            estado, \
            id_especialidad, \
            activo) VALUES (?,?,?,?,?,?)",
        [data.id_usuario_pub, data.titulo, data.descripcion, data.estado, data.id_especialidad, 'S'],
        (err, result, fields) => {
            if (!err) {
                id_P = result.insertId;

                if (detalles.length > 0) {

                    mySqlConnection.query("Insert into detalle_publicacion ( \
                        id_publicacion, \
                        descripcion, \
                        archivo, \
                        tipo_archivo) VALUES ?",

                        // [detalles.map(item => 
                        //     [id_C, item.descripcion, item.archivo , item.tipo_archivo])],
                        [detalles.map(element =>
                            [id_P, element.descripcion, element.archivo, element.tipo_archivo]
                        )],
                        (err, result, fields) => {
                            if (err) {
                                mySqlConnection.rollback();
                                res.json({
                                    ok: 0,
                                    mensaje: 'Ha ocurrido un error',
                                    data: null
                                });
                                // throw err;
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
                console.log(err)
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

//eliminar la publicación
router.put('/delete/:idPub', middleware, (req, res) => {
    const idPub = req.params.idPub;

    mySqlConnection.query("UPDATE publicacion SET activo = 'N' where id = ?",idPub,(err, result,fields) => {
            if (!err) {
                res.json({
                    ok: 1,
                    mensaje: 'Publicación Eliminada',
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

//Editar publicacion
router.put('/update/:idPub', middleware, (req, res) => {
    const data = req.body;
    const idPub = req.params.idPub;

    mySqlConnection.query("UPDATE publicacion SET titulo = ?, descripcion=?, id_especialidad = ? where id = ?",
    [data.titulo,data.descripcion,data.id_especialidad,idPub],(err, result,fields) => {
            if (!err) {
                res.json({
                    ok: 1,
                    mensaje: 'Publicacion Editada',
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