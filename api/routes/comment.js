const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const multer = require('multer')


const mySqlConnection = require('../connection/connection');
const middleware = require('../middleware/middleware')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../files/archivosComentarios')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + "_com_" + file.originalname)
    }
})

var upload = multer({ storage: storage })


router.get('/getComentario/:idPub', middleware, (req, res) => {

    const idPub = parseInt(req.params.idPub);
    // console.log(id);
    mySqlConnection.query("select co.id, \
    co.id_publicacion_com, \
    co.id_usu_comenta, \
    CONCAT(usu.nombre,' ', usu.apellido) as nombre, \
    usu.foto, \
    co.comentario, \
    if ((select AVG(cc.calificacion) \
     from calificacion_comentario cc \
    where cc.id_comentario_cal = co.id) is null, 0, (select AVG(cc.calificacion) \
    from calificacion_comentario cc \
    where cc.id_comentario_cal = co.id)) as calificacion, \
    co.activo, \
    co.creado, \
    p.id_especialidad,\
    case p.id_especialidad \
    when (SELECT eua.id_especialidad \
          from especialidad_usuario eua \
          where eua.id_usuario = co.id_usu_comenta\
          and eua.id_especialidad = p.id_especialidad \
         ) \
    	THEN 'Especialista'\
     ELSE 'Colaborador' \
    END as tipo, \
    (SELECT COUNT(dc.id_comentario) \
     FROM detalle_comentario dc \
     WHERE dc.id_comentario = co.id) as adjuntos \
    from comentario co, usuario usu, publicacion p where co.id_publicacion_com = ? \
    and co.id_usu_comenta=usu.id \
    and p.id = co.id_publicacion_com \
    and co.activo ='S' ORDER BY id DESC", idPub, (err, rows, fields) => {

        if (!err) {

            // res.json({
            //     ok: 1,
            //     mensaje: 'Comentarios selecionados',
            //     data: rows
            // });
            mySqlConnection.query("select dc.id, \
                dc.id_comentario, \
                dc.descripcion, \
                dc.contenido,\
                dc.tipo \
                from detalle_comentario dc, comentario c \
                where c.id = dc.id_comentario and\
                c.id_publicacion_com = ?", idPub, (err2, rows2, fields2) => {

                if (!err2) {
                    res.json({
                        ok: 1,
                        mensaje: 'Detalles selecionados',
                        data: {'comentarios':rows, 'detalles':rows2}
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
                mensaje: 'Ha ocurrido un error',
                data: null
            });
            // console.log(err);
        }
    });
});



// select co.id, 
// 	if ((select AVG(cc.calificacion)
//     from calificacion_comentario cc
//     where cc.id_comentario_cal = co.id) is null, 0, (select AVG(cc.calificacion)
//     from calificacion_comentario cc
//     where cc.id_comentario_cal = co.id)) as calificacion,
//     co.id_publicacion_com, 
//     co.id_usu_comenta, 
//     CONCAT(usu.nombre,' ', usu.apellido) as nombre, 
//     usu.foto, 
//     co.comentario, 
//     co.activo, 
//     co.creado, 
//     p.id_especialidad,
//     case p.id_especialidad 
//     when (SELECT eua.id_especialidad 
//           from especialidad_usuario eua 
//           where eua.id_usuario = co.id_usu_comenta
//           and eua.id_especialidad = p.id_especialidad 
//          ) 
//     	THEN 'Especialista'
//      ELSE 'Colaborador' 
//     END as tipo 
//     from comentario co, usuario usu, publicacion p where co.id_publicacion_com = 2 
//     and co.id_usu_comenta=usu.id 
//     and p.id = co.id_publicacion_com 
//     and co.activo ='S' ORDER BY id DESC



router.get('/getDetalles/:idCom', middleware, (req, res) => {

    const idCom = parseInt(req.params.idCom);
    // console.log(id);
    mySqlConnection.query("select id, \
            id_comentario, \
            descripcion, \
            contenido,\
            tipo \
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
            // console.log(err);
        }
    });
});

router.get('/getDetallesCom/:idPub', middleware, (req, res) => {

    const idPub = parseInt(req.params.idPub);
    // console.log('id', idPub);
    mySqlConnection.query("select dc.id, \
    dc.id_comentario, \
    dc.descripcion, \
    dc.contenido,\
    dc.tipo \
    from detalle_comentario dc, comentario c \
    where c.id = dc.id_comentario and\
    c.id_publicacion_com = ?", idPub, (err, rows, fields) => {

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
            // console.log(err);
        }
    });
});


router.post('/saveFiles', [upload.array('files'), middleware], (req, res, err) => {
  
    if (!req.files) {
        res.json({
            ok: 0,
            mensaje: 'No se encontraron archivos',
            data: null
        });
    }
    else {
        res.json({
            ok: 1,
            mensaje: 'Ingreso Correcto',
            data: req.files
        });
    }
    // }

});

router.post('/post', middleware, (req, res) => {
    const data = req.body;
    const detalles = data.listaDetalles;
    let error_ = false;

	mySqlConnection.getConnection(function(err, conn) {
		if(!err){
    conn.beginTransaction();

    conn.query("Insert into comentario ( \
            id_publicacion_com, \
            id_usu_comenta, \
            comentario, \
            activo) VALUES (?,?,?,?)",
        [data.id_publicacion_com, data.id_usu_comenta, data.comentario, 'S'],
        (err, result, fields) => {
            if (!err) {
                id_C = result.insertId;

                if (detalles.length > 0) {

                   conn.query("Insert into detalle_comentario ( \
                                    id_comentario, \
                                    descripcion, \
                                    contenido, \
                                    tipo) VALUES ?",

                        // [detalles.map(item => 
                        //     [id_C, item.descripcion, item.archivo , item.tipo_archivo])],
                        [detalles.map(element =>
                            [id_C, element.descripcion, element.contenido, element.tipo]
                        )],
                        (err, result, fields) => {
                            if (err) {
                               conn.rollback();
                                res.json({
                                    ok: 0,
                                    // mensaje: 'Ha ocurrido un error',
                                    mensje: err,
                                    data: null
                                });
                                throw err;
                            }
                            else {
                                conn.commit();
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
                    conn.commit();
                    res.json({
                        ok: 1,
                        mensaje: 'Ingreso Correcto',
                        data: data
                    });
                }

            } else {
                conn.rollback();
                res.json({
                    ok: 0,
                    // mensaje: 'Ha ocurrido un error',
                    mensaje: err,
                    data: null
                });
            }

	})
		}
			else{
			conn.rollback();
			res.json({
				ok: 0,
				mensaje: 'Ha ocurrido un error',
				data:null
				})
			}
        });
    // console.log('end transaction');

});

router.put('/delete/:idCom', middleware, (req, res) => {
    const idCom = req.params.idCom;

    mySqlConnection.query("UPDATE comentario SET activo = 'N' where id = ?", idCom, (err, result, fields) => {
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

    mySqlConnection.query("UPDATE comentario SET comentario = ? where id = ?", [data.comentario, idCom], (err, result, fields) => {
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
