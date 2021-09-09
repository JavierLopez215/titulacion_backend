const express = require('express');
const routes = require('../../app');
const router = express.Router();
const config = require('../../config/config');

const mySqlConnection = require('../connection/connection');
const jwt = require('jsonwebtoken');

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
router.post('/update', verificarToken, (req, res) => {
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
router.post('/updatePicture', verificarToken, (req, res) => {
    const namePicture = req.body.foto;
    const old_user = req.data;

    mySqlConnection.query("UPDATE usuario SET foto = ? where id = ?",
        [namePicture, old_user.id],
        (err, result,fields) => {
            if (!err) {
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
                                correo,tipo, \
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

router.post('/test', verificarToken, (req, res) => {
    res.json({mensaje:'Informacion secreta'});
});


//Middleware para validar tokens de usuarios.
function verificarToken(req, res, next) {
    // if (!req.headers.authorization) return res.status(401).json('No autorizado'); 
    if (!req.headers.authorization) return res.status(401).send('Error token');

    // const token = req.headers.authorization.substr(7);
    const token = req.headers.authorization.split(' ')[1];
    // const token = req.headers.authorization;
    if (token !== '') {
        try {
            const content = jwt.verify(token, config.SECRET_PASS);
            console.log('Content:  ',content);
            req.data = content;
            
            next();
        } catch (error) {
            res.status(401).json({
                error: 'Token invalido'
            });
        }

    } else {
        res.status(401).json({
            error: 'Token vacio'
        });
    }
}

module.exports = router;