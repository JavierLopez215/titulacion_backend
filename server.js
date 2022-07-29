// const https = require('https');
// const { path } = require('./app');
// const app = require('./app');



// const port = process.env.PORT || 3000;
// // app.use('*/uploads',express.static('uploads'));

// const server = https.createServer(app);
// server.setTimeout(60000000,()=>{
//     // console.log("Socket is destroyed due to timeout");
// })
// server.listen(port);


//Nueva Implementacion del servidor

//const http = require('http');
const { path } = require('./app');
const app = require('./app');

var https = require('https');

var fs = require('fs');

var https_options = {

key: fs.readFileSync("api/files/certificateSSL/private.key"),

cert: fs.readFileSync("api/files/certificateSSL/certificate.crt"),

ca: [

// fs.readFileSync('/ruta/de/CA_root.crt'),

fs.readFileSync('api/files/certificateSSL/ca_bundle.crt')

]
};



 const port = process.env.PORT || 3000; //sin ssl


//const port=80;
// app.use('*/uploads',express.static('uploads'));

//const server = http.createServer(app);
//server.setTimeout(60000000,()=>{
    // console.log("Socket is destroyed due to timeout");
//})

// app.listen(port, ()=> { //sin ssl ini
//     console.log('server on port', port);
// }) //sin ssl fin


https.createServer(https_options, app).listen(port, () => { console.log('listening on ', port) })
