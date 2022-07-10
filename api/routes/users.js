const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const multer = require('multer');
const fs = require('fs')
const bcrypt = require('bcryptjs')
const nodeMailer = require('nodemailer')
// const transporte = require('../email_transport/email')

const middleware = require('../middleware/middleware');

const mySqlConnection = require('../connection/connection');
const jwt = require('jsonwebtoken');



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../files/images/profile')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + "_" + file.originalname)
    }
})

var upload = multer({ storage: storage })

// Seleccionar datos por id de Usuario
router.get('/userId/:id', (req, res) => {
    const id = req.params.id;
    // console.log(id);
    mySqlConnection.query('select * from usuario where id = ?', id, (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            // console.log(err);
        }
    });
});

router.post('/register', (req, res) => {
    const data = req.body;
    const pass = bcrypt.hashSync(data.contrasena, 10)

    mySqlConnection.query("Insert into usuario (nombre, apellido, direccion, telefono, \
        perfil_prof, correo, contraseña, tipo, activo) \
        VALUES (?,?,?,?,?,?,?,?,?)",
        [data.nombre, data.apellido, data.direccion,
        data.telefono, data.perfil_prof, data.correo,
            pass, 2, 'S'],
        (err, result, fields) => {
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

    mySqlConnection.query("SELECT id, nombre, apellido, direccion, telefono, perfil_prof, correo,tipo, \
                            foto, contraseña, activo FROM usuario where correo=? and activo='S'",
        [correo],
        (err, data, fields) => {
            if (!err) {
                //console.log(rows);
                if (data.length > 0) {
                    if (bcrypt.compareSync(contrasena, data[0].contraseña)) {
                        let user = JSON.stringify(data[0]);
                        const token = jwt.sign(user, config.SECRET_PASS);
                        res.json({
                            ok: 1,
                            mensaje: 'Usuario Correcto',
                            data: user,
                            token: token
                        });
                    }
                    else {
                        res.json({
                            ok: 0,
                            mensaje: 'Usuario o contraseña incorrecta',
                            data: null,
                            token: null
                        });
                    }

                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'Usuario o contraseña incorrecta',
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


//Actualizar datos personales
router.post('/update', middleware, (req, res) => {
    const data = req.body;
    const id = req.params.id;
    const old_user = req.data;

    mySqlConnection.query("UPDATE usuario SET nombre = ?, apellido = ?, \
        direccion = ?, \
        telefono = ?, \
        correo = ?, \
        perfil_prof = ? where id = ?",
        [data.nombre, data.apellido, data.direccion,
        data.telefono, data.correo, data.perfil_prof, old_user.id],
        (err, result, fields) => {
            if (!err) {
                old_user.nombre = data.nombre;
                old_user.apellido = data.apellido;
                old_user.direccion = data.direccion;
                old_user.telefono = data.telefono;
                old_user.correo = data.correo
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
    // console.log(req.file);

    mySqlConnection.query("UPDATE usuario SET foto = ? where id = ?",
        [namePicture, old_user.id],
        (err, result, fields) => {
            // console.log('foto',old_user.foto)
            if (!err) {
                if (old_user.foto != 'profile.png') {
                    try {
                        fs.unlinkSync(`api/files/images/profile/${old_user.foto}`)
                        // console.log('File removed')
                    } catch (err) {
                        console.error('ha ocurrido un error')
                    }
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

// router.post('/updateContrasenia', middleware, (req, res) => {


//     const data = req.body;
//     const id = req.params.id;
//     const old_user = req.data;
//     const actual_cont = data.actual_cont;
//     const nueva_cont = data.nueva_cont;

//     mySqlConnection.query("SELECT id, \
//                                 nombre, \
//                                 apellido, \
//                                 direccion, \
//                                 telefono, \
//                                 perfil_prof, \
//                                 correo,tipo, foto, contraseña,\
//                                 activo FROM usuario \
//                                 where id=? \
//                                 and activo='S'",
//         [old_user.id],
//         (err, data, fields) => {
//             if (!err) {
//                 if (data.length > 0) {
//                     if (bcrypt.compareSync(actual_cont, data[0].contraseña)) {

//                         const pass = bcrypt.hashSync(nueva_cont, 10)

//                         mySqlConnection.query("UPDATE usuario SET contraseña = ? where id = ?",
//                             [pass, old_user.id],
//                             (err, result, fields) => {
//                                 if (!err) {

//                                     old_user.contraseña = pass;
//                                     let user_ = JSON.stringify(old_user);
//                                     const token = jwt.sign(user_, config.SECRET_PASS);

//                                     res.json({
//                                         ok: 1,
//                                         mensaje: 'Actualizado Correctamente',
//                                         data: old_user,
//                                         token: token
//                                     });
//                                 } else {
//                                     res.json({
//                                         ok: 0,
//                                         mensaje: 'Ha ocurrido un error',
//                                         data: null,
//                                         token: null
//                                     });
//                                 }
//                             }
//                         )
//                     }
//                     else {
//                         res.json({
//                             ok: 0,
//                             mensaje: 'La contraseña actual ingresada es incorrecta',
//                             data: null,
//                             token: null
//                         });
//                     }
//                 } else {
//                     res.json({
//                         ok: 0,
//                         mensaje: 'No se encontró un usuario',
//                         data: null,
//                         token: null
//                     });
//                 }
//             } else {
//                 res.json({
//                     ok: 0,
//                     mensaje: 'Ha ocurrido un error',
//                     data: null,
//                     token: null
//                 });
//             }
//         })
// });

//Registro de nuevos Usuarios


router.post('/updateContrasenia', middleware, (req, res) => {


    const data = req.body;
    const id = req.params.id;
    const old_user = req.data;

    const actual_cont = data.actual_cont;
    const nueva_cont = data.nueva_cont;

    mySqlConnection.query("SELECT id, \
                                nombre, \
                                apellido, \
                                direccion, \
                                telefono, \
                                perfil_prof, \
                                correo,tipo, foto, contraseña,\
                                activo FROM usuario \
                                where id=? \
                                and activo='S'",
        [old_user.id],
        (err, data, fields) => {
            if (!err) {
                if (data.length > 0) {
                    if (bcrypt.compareSync(actual_cont, data[0].contraseña)) {

                        const pass = bcrypt.hashSync(nueva_cont, 10)

                        mySqlConnection.query("UPDATE usuario SET contraseña = ? where id = ?",
                            [pass, old_user.id],
                            (err, result, fields) => {
                                if (!err) {
                                    old_user.contraseña = pass;
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
                    }
                    else {
                        res.json({
                            ok: 0,
                            mensaje: 'La contraseña actual ingresada es incorrecta',
                            data: null,
                            token: null
                        });
                    }
                } else {
                    res.json({
                        ok: 0,
                        mensaje: 'No se encontró un usuario',
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

router.post('/recover', (req, res) => {

    var abecedario = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
        "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
        "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d",
        "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
        "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
        "y", "z", "0", "1", "2", "3", "4", "5", "6", "7",
        "8", "9", ".", "*", "$", "&", "#", "@"];
    
        var contrasena_temp = '';
    const correo = req.body.correo;

    // mySqlConnection.beginTransaction();

    mySqlConnection.query("SELECT id, \
                                nombre, \
                                apellido, \
                                direccion, \
                                telefono, \
                                perfil_prof, \
                                correo,tipo, foto, contraseña,\
                                activo FROM usuario \
                                where correo=? \
                                and activo='S'",
        [correo],
        (err, data, fields) => {
            if (!err) {
                if (data.length > 0) {
                    
                    var old_user = data[0];

                    for (let numero = 0; numero < 16; numero++) {
                        numeroAleatorio = parseInt(Math.random() * abecedario.length);
                        contrasena_temp += abecedario[numeroAleatorio];
                    }

                    const pass = bcrypt.hashSync(contrasena_temp, 10)

                    mySqlConnection.beginTransaction();

                    mySqlConnection.query("UPDATE usuario SET contraseña = ? where id = ?",
                        [pass, old_user.id],
                        (err2, result2, fields2) => {
                            if (!err2) {

                                const transporter = nodeMailer.createTransport({
                                    host: 'smtp.gmail.com',
                                    port: 465,
                                    secure: true,
                                    auth: {
                                        user: config.email_support,
                                        pass: config.pass_email_support
                                    }
                                });

                                let mailOptions = {
                                    from: '"Refuerzo Academico App" <' + config.email_support + '>', // sender address
                                    to: correo, // list of receivers
                                    subject: 'Recuperar contraseña Refuerzo Academico App', // Subject line
                                    // text: 'req.body.body', // plain text body
                                    html: '<div style="margin-bottom: 5px;"> \
                                    <div style="border: 3px solid #2d76e2; width: 500px; margin: 0 auto; border-radius: 10px; padding: 20px;"> \
                                        <h4 style="text-align: center;">¡Hola '+ old_user.nombre +'!</h4> \
                                        <h5 style="text-align: center;">Recuperación de acceso</h5> \
                                        <div style="text-align: center;"> \
                                            <img src="https://e7.pngegg.com/pngimages/78/984/png-clipart-e-commerce-android-business-password-android-blue-logo.png" width="100px" alt="image"> \
                                        </div> \
                                        <p style="text-align: justify; padding: 10px;">Se ha generado una nueva contraseña con la que podra acceder a la cuenta</p> \
                                        <p style="text-align: justify;padding: 10px;">Para el ingreso a la plataforma se debe usar la dirección de correo electrónico de registro y la contraseña que \
                                            se adjunta en el mensaje</p> \
                                        <div style="background-color: #2d76e2; color: white; width: auto; margin: 0 auto; text-align: center; padding: 5px; margin: 10px;"> \
                                            <h5 font-size: 20px;>Nueva Contraseña</h5> \
                                            <h6 font-size: 15px;>'+contrasena_temp+'</h6> \
                                        </div> \
                                    </div> \
                                </div>' // html body
                                };

                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        // console.log('email error', error)
                                        mySqlConnection.rollback()
                                        res.json({
                                            ok: 0,
                                            mensaje: 'Ha ocurrido un error',
                                            data: null,
                                            token: null
                                        });
                                    } else {
                                        old_user.contraseña = contrasena_temp;
                                        let user_ = JSON.stringify(old_user);
                                        const token = jwt.sign(user_, config.SECRET_PASS);
                                        mySqlConnection.commit();

                                        res.json({
                                            ok: 1,
                                            mensaje: 'Actualizado Correctamente',
                                            data: old_user,
                                            token: token
                                        });
                                    }
                                    // console.log('Message %s sent: %s', info.messageId, info.response);
                                    // res.render('index');
                                });


                            } else {
                                // console.log(err2)
                                mySqlConnection.rollback()
                                res.json({
                                    ok: 0,
                                    mensaje: 'Ha ocurrido un error',
                                    data: null,
                                    token: null
                                });

                            }
                        }

                    )

                } else {
                    // console.log('ninguno registrado')
                    res.json({
                        ok: 0,
                        mensaje: 'No se encontró un usuario',
                        data: null,
                        token: null
                    });
                }
            } else {
                // console.log('error select', err)
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
    res.json({ mensaje: 'Informacion secreta' });
});

module.exports = router;