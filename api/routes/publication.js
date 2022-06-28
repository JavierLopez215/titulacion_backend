const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const multer = require('multer')

const mySqlConnection = require('../connection/connection');
const middleware = require('../middleware/middleware');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/../files/archivos')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '_' + Date.now()+"_"+file.originalname)
    }
  })
   
  var upload = multer({ storage: storage })

//obtener publicacion por su id
router.get('/getPubId/:idPub', middleware, (req, res) => {

    const idPub = parseInt(req.params.idPub);
    // console.log(id);
    mySqlConnection.query("select pub.id, \
    pub.id_usuario_pub, \
    CONCAT(usu.nombre,' ',usu.apellido) as nombre,\
    usu.foto, \
    pub.titulo, \
    pub.descripcion, \
    pub.estado, \
    pub.id_especialidad, \
    es.nombre as especialidad, \
    pub.activo, \
    pub.creado \
    from publicacion pub, usuario usu, especialidad es where \
    pub.id_usuario_pub=usu.id and \
    es.id=pub.id_especialidad and\
    pub.id = ? and pub.activo ='S' ORDER BY id DESC", idPub, (err, rows, fields) => {

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
router.get('/getPubUser/:idUsu', middleware, (req, res) => {

    const idUsu = parseInt(req.params.idUsu);
    // console.log(id);
    mySqlConnection.query("select id, \
    id_usuario_pub, \
    titulo, \
    descripcion, \
    estado, \
    id_especialidad, \
    activo, \
    creado \
    from publicacion where id_usuario_pub = ? and activo ='S' ORDER BY id DESC", idUsu, (err, rows, fields) => {

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

//lista de publicaciones de un usuario
router.get('/getTopPubUser/:idUsu', middleware, (req, res) => {

    const idUsu = parseInt(req.params.idUsu);
    // console.log(id);
    mySqlConnection.query("select id, \
    id_usuario_pub, \
    titulo, \
    descripcion, \
    estado, \
    id_especialidad, \
    activo, \
    creado \
    from publicacion where id_usuario_pub = ? and activo ='S' ORDER BY id DESC LIMIT 0,5", idUsu, (err, rows, fields) => {

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


router.get('/getColPubUser/:idUsu', middleware, (req, res) => {

    const idUsu = parseInt(req.params.idUsu);
    //  console.log(idUsu);
    mySqlConnection.query("select DISTINCT p.id, \
    p.id_usuario_pub, \
    p.titulo, \
    p.descripcion, \
    p.estado, \
    p.id_especialidad, \
    p.activo, \
    p.creado \
    from publicacion p, comentario c \
    where p.id_usuario_pub <> ? \
    and c.id_usu_comenta = ? \
    and c.id_publicacion_com = p.id \
    and p.activo ='S' ORDER BY id DESC", [idUsu, idUsu], (err, rows, fields) => {

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


//lista de publicaciones de un usuario
router.get('/getPubCom/:idUsu', middleware, (req, res) => {

    const idUsu = parseInt(req.params.idUsu);
    // console.log(id);
    mySqlConnection.query("select id, \
    id_usuario_pub, \
    titulo, \
    descripcion, \
    estado, \
    id_especialidad, \
    activo, \
    creado \
    from publicacion where id_usuario_pub <> ? and estado='P' and activo ='S' ORDER BY id DESC", idUsu, (err, rows, fields) => {

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
            contenido, \
            tipo \
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

// guardar Archivos
router.post('/saveFiles', [upload.array('files'),middleware], (req, res,) => {
    if (!req.files) {
        // const error = new Error('Please choose files')
        // error.httpStatusCode = 400
        // return next(error)
        res.json({
            ok: 0,
            mensaje: 'No se encontraron archivos',
            data: null
        });
      }
      else{
        res.json({
            ok: 1,
            mensaje: 'Ingreso Correcto',
            data: req.files
        });
      }
    
});


//ingreso de publicaciones
router.post('/post', middleware, (req, res,) => {
    const data = req.body;
    // console.log(data)
    const detalles = data.listaDetalles;
    // console.log(req.files)
    // let error_ = false;

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
                        contenido, \
                        tipo) VALUES ?",

                        // [detalles.map(item => 
                        //     [id_C, item.descripcion, item.archivo , item.tipo_archivo])],
                        [detalles.map(element =>
                            [id_P, element.descripcion, element.contenido, element.tipo]
                        )],
                        (err, result, fields) => {
                            if (err) {
                                mySqlConnection.rollback();
                                res.json({
                                    ok: 0,
                                    mensaje: err,
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

router.put('/comPublicacion/:idPub', middleware, (req, res) => {
    const idPub = req.params.idPub;

    mySqlConnection.query("UPDATE publicacion SET estado = 'C' where id = ?",idPub,(err, result,fields) => {
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