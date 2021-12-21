const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const multer = require('multer');
const fs = require('fs')

const middleware = require('../middleware/middleware');

const mySqlConnection = require('../connection/connection');
const jwt = require('jsonwebtoken');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/../files/images/profile')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '_' + Date.now()+"_"+file.originalname)
    }
  })
   
  var upload = multer({ storage: storage })

//Seleccionar datos por id de Usuario
router.get('/userId/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    mySqlConnection.query('select * from usuario where id = ?',id, (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

//Actualizar datos personales
router.post('/update', middleware, (req, res) => {
    const data = req.body;
    const id = req.params.id;
    const old_user = req.data;

    const user = {
        nombre: data.nombre,
        apellido: data.apellido,
        direccion: data.direccion,
        telefono: data.telefono,
        perfil_prof: data.perfil_prof
    }
    mySqlConnection.query("UPDATE usuario SET nombre = ?, apellido = ?, \
        direccion = ?, \
        telefono = ?, \
        perfil_prof = ? where id = ?",
        [data.nombre, data.apellido, data.direccion,
        data.telefono, data.perfil_prof, old_user.id],
        (err, result,fields) => {
            if (!err) {
                old_user.nombre = data.nombre;
                old_user.apellido = data.apellido;
                old_user.direccion = data.direccion;
                old_user.telefono = data.telefono;
                old_user.perfil_prof = data.perfil_prof; 
                let user_ = JSON.stringify(old_user);
                const token = jwt.sign(user_, config.SECRET_PASS);
                res.json({
                    ok: 1,
                    mensaje: 'Actualizado Correctamente',
                    data: old_user,
                    token: token
                });
            } else {
                res.json({
                    ok: 0,
                    mensaje: 'Ha ocurrido un error',
                    data: null,
                    token: null
                });
            }
        }

    )
});


//Actualizar foto de perfil
router.post('/updatePicture', [upload.single('file'), middleware], (req, res) => {
    const namePicture = req.file.filename;
    const old_user = req.data;
    console.log(req.file);

    mySqlConnection.query("UPDATE usuario SET foto = ? where id = ?",
        [namePicture, old_user.id],
        (err, result,fields) => {
            if (!err) {

                try {
                    fs.unlinkSync(`api/files/images/profile/${old_user.foto}`)
                    // console.log('File removed')
                  } catch(err) {
                    console.error('ha ocurrido un error')
                  }

                old_user.foto = namePicture; 
                let user_ = JSON.stringify(old_user);
                const token = jwt.sign(user_, config.SECRET_PASS);
                
                res.json({
                    ok: 1,
                    mensaje: 'Actualizado Correctamente',
                    data: old_user,
                    token: token
                });
            } else {
                res.json({
                    ok: 0,
                    mensaje: 'Ha ocurrido un error',
                    data: null,
                    token: null
                });
            }
        }

    )
});

//Registro de nuevos Usuarios
router.post('/register', (req, res) => {
    const data = req.body;

    const user = {
        id:0,
        nombre: data.nombre,
        apellido: data.apellido,
        direccion: data.direccion,
        telefono: data.telefono,
        perfil_prof: data.perfil_prof,
        correo: data.correo,
        foto: 'profile.png',
        tipo: 2,
        activo: 'S'
    }


    mySqlConnection.query("Insert into usuario (nombre, apellido, \
        direccion, \
        telefono, \
        perfil_prof, \
        correo,\
        contraseña, \
        tipo, \
        activo) VALUES (?,?,?,?,?,?,?,?,?)",
        [data.nombre, data.apellido, data.direccion,
        data.telefono, data.perfil_prof, data.correo,
        data.contrasena, 2, 'S'],
        (err, result,fields) => {
            if (!err) {
                user.id = result.insertId;
                let user_ = JSON.stringify(user);
                const token = jwt.sign(user_, config.SECRET_PASS);
                res.json({
                    ok: 1,
                    mensaje: 'Registro Correcto',
                    data: user,
                    token: token
                });
            } else {
                res.json({
                    ok: 0,
                    mensaje: 'Ha ocurrido un error',
                    data: null,
                    token: null
                });
            }
        }

    )
});

//Inicio de sesion de usuarios
router.post('/login', (req, res) => {
    const { correo, contrasena } = req.body;
    mySqlConnection.query("SELECT id, \
                                nombre, \
                                apellido, \
                                direccion, \
                                telefono, \
                                perfil_prof, \
                                correo,tipo, foto, \
                                activo FROM usuario \
                                where correo=? \
                                and contraseña=?",
        [correo, contrasena],
        (err, data, fields) => {
            if (!err) {
                //console.log(rows);
                if (data.length > 0) {
                    let user = JSON.stringify(data[0]);
                    const token = jwt.sign(user, config.SECRET_PASS);
                    res.json({
                        ok: 1,
                        mensaje: 'Usuario Correcto',
                        data: data,
                        token: token
                    });
                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'Usuario o clave incorrecta',
                        data: null,
                        token: null
                    });
                }
            } else {
                res.json({
                    ok: 0,
                    mensaje: 'Ha ocurrido un error',
                    data: null,
                    token: null
                });
            }
        })
});

router.post('/test2', middleware, (req, res) => {
    res.json({mensaje:'Informacion secreta'});
});

module.exports = router;