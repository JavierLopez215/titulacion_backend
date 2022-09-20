const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const middleware = require('../middleware/middleware');
const multer = require('multer')

const mySqlConnection = require('../connection/connection');
const mySqlConnection2 = require('../connection/connection');

const jwt = require('jsonwebtoken');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../files/filesAp')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + "_" + file.originalname)
    }
})

var upload = multer({ storage: storage })


//Seleccionar datos por id de Usuario
router.get('/aporteUsu/:idUsu', middleware, (req, res) => {
    const id = parseInt(req.params.idUsu);

    mySqlConnection.query("select a.id, \
    a.id_usuario_apo, \
    CONCAT(u.nombre,' ', u.apellido) as nombre, \
    u.foto, \
    a.titulo, \
    a.descripcion, \
    a.archivo, \
    a.tipo, \
    a.activo, \
    a.creado \
    from aporte a, usuario u where a.id_usuario_apo = u.id and\
    a.id_usuario_apo = ? and a.activo='S' \
    ORDER BY a.creado ASC", id, (err, rows, fields) => {
        if (!err) {

            mySqlConnection.query("select e.id, \
            ea.id_aporte, \
            e.etiqueta, \
            e.activo, \
            e.creado \
            from etiqueta_aporte ea, etiqueta e \
            where ea.id_etiqueta = e.id and \
            ea.id_aporte IN (Select id from aporte where id_usuario_apo = ?)", id, (err2, rows2, fields) => {
                if (!err2) {
                    res.json({
                        ok: 1,
                        mensaje: 'Etiquetas selecionadas',
                        data: { 'aportes': rows, 'etiquetas': rows2 }
                    });
                } else {
                    // console.log(err2);
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


//Seleccionar datos comunidad
router.get('/aporteCom/:idUsu', middleware, (req, res) => {
    const id = parseInt(req.params.idUsu);
    // console.log(id);
    mySqlConnection.query("select a.id, \
    a.id_usuario_apo, \
    CONCAT(u.nombre,' ', u.apellido) as nombre, \
    u.foto, \
    a.titulo, \
    a.descripcion, \
    a.archivo, \
    a.tipo, \
    a.activo, \
    a.creado \
    from aporte a, usuario u where a.id_usuario_apo = u.id and\
    a.id_usuario_apo <> ? and a.activo='S' \
    ORDER BY a.creado DESC", id, (err, rows, fields) => {
        if (!err) {
            // res.json({
            //     ok: 1,
            //     mensaje: 'Aportes comunidad selecionados',
            //     data: rows
            // });
            mySqlConnection.query("select e.id, \
            ea.id_aporte, \
            e.etiqueta, \
            e.activo, \
            e.creado \
            from etiqueta_aporte ea, etiqueta e \
            where ea.id_etiqueta = e.id and \
            ea.id_aporte IN (Select id from aporte where id_usuario_apo <> ?)"
            , id, (err2, rows2, fields) => {
                if (!err2) {
                    
                    res.json({
                        
                        ok: 1,
                        mensaje: 'Etiquetas selecionadas',
                        data: { 'aportes': rows, 'etiquetas': rows2 }
                    });
                } else {
                    // console.log(err2);
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

router.get('/etiquetasApoUsu/:idUsu', middleware, (req, res) => {
    const id = parseInt(req.params.idUsu);
    // console.log(id);
    mySqlConnection.query("select e.id, \
            e.etiqueta, \
            e.activo, \
            e.creado \
            from etiqueta_aporte ea, etiqueta e \
            where ea.id_etiqueta = e.id and \
            ea.id_aporte IN (Select id from aporte where id_usuario_apo = ?)"
            , id, (err2, rows2, fields) => {
        if (!err2) {
            res.json({
                ok: 1,
                mensaje: 'Etiquetas selecionadas',
                data: rows2
            });
        } else {
            // console.log(err2);
            res.json({
                ok: 0,
                mensaje: 'Ha ocurrido un error',
                data: null
            });
            // console.log(err);
        }
    });

});

router.get('/etiquetasApoCom/:idUsu', middleware, (req, res) => {
    const id = parseInt(req.params.idUsu);
    // console.log(id);
    mySqlConnection.query("select e.id, \
            e.etiqueta, \
            e.activo, \
            e.creado \
            from etiqueta_aporte ea, etiqueta e \
            where ea.id_etiqueta = e.id and \
            ea.id_aporte IN (Select id from aporte where id_usuario_apo <> ?)", id, (err2, rows2, fields) => {
        if (!err2) {
            res.json({
                ok: 1,
                mensaje: 'Etiquetas selecionadas',
                data: rows2
            });
        } else {
            // console.log(err2);
            res.json({
                ok: 0,
                mensaje: 'Ha ocurrido un error',
                data: null
            });
            // console.log(err);
        }
    });

});

//Registro de nuevos Aportes
router.post('/post', middleware, (req, res) => {
    const data = req.body;
    const etiquetas = data.listaEtiquetas;
	
//	console.log('registro')
  mySqlConnection.getConnection(function(er, conn) {
	  if(!er){
	conn.beginTransaction();

    conn.query("Insert into aporte ( \
                            id_usuario_apo, \
                            titulo, \
	    			descripcion, \
                            archivo, \
                            tipo, \
                            activo) VALUES (?,?,?,?,?,?)",
        [data.id_usuario_apo, data.titulo, data.descripcion,
        data.archivo, data.tipo, 'S'],
        (err, result, fields) => {
            if (!err) {
                id_Apo = result.insertId;

                if (etiquetas.length > 0) {

                    conn.query("Insert into etiqueta_aporte ( \
                        id_aporte, \
                        id_etiqueta) VALUES ?",

                        // [detalles.map(item => 
                        //     [id_C, item.descripcion, item.archivo , item.tipo_archivo])],
                        [etiquetas.map(element =>
                            [id_Apo, element.id]
                        )],
                        (err2, result2, fields) => {
                            if (err2) {
                                conn.rollback();
                                res.json({
                                    ok: 0,
                                    mensaje: 'Ha ocurrido un error',
                                    data: null
                                });
                                // throw err;
                            }
                            else {
                            //    console.log(err2)
				   conn.commit();
                                res.json({
                                    ok: 1,
                                    mensaje: 'Ingreso Correcto',
                                    data: data
                                });
                            }
                        }
                    );

                } else {
		console.log('No se ingresaron etiquetas');
                    conn.rollback();
                    res.json({
                        ok: 0,
                        mensaje: 'No se ingresaron etiquetas',
                        data: null
                    });
                }
                // res.json({
                //     ok: 1,
                //     mensaje: 'Ingreso Correcto',
                //     data: data
                // });
            } else {
                conn.rollback();
                res.json({
                    ok: 0,
                    mensaje: 'Ha ocurrido un error',
                    data: null
                });
                 console.log(err)
            }
	});
        }
	  else{
	  	conn.rollback();
		  res.json({
			ok: 0,
			  mensaje: 'Ha ocurrido un error',
			  data: null
		  })
	  }

    

	  })
});

// cambiar estado a inactivo
router.put('/delete/:idApo', middleware, (req, res) => {
    const idApo = req.params.idApo;

    mySqlConnection.query("UPDATE aporte SET activo = 'N' where id = ?", idApo, (err, result, fields) => {
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

router.post('/saveFiles', [upload.array('files'), middleware], (req, res,) => {
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
});

module.exports = router;
