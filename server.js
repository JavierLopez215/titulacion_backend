
// const app = require('./app');
// var https = require('https');
// var fs = require('fs');

// var https_options = {
//     key: fs.readFileSync("api/files/certificateSSL/private.key"),
//     cert: fs.readFileSync("api/files/certificateSSL/certificate.crt"),
//     ca: [
//         // fs.readFileSync('/ruta/de/CA_root.crt'),
//         fs.readFileSync('api/files/certificateSSL/ca_bundle.crt')
//     ]
// };
// const port = process.env.PORT || 3000;

// https.createServer(https_options, app).listen(port, () => { console.log('listening on ', port) })


const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, ()=> { //sin ssl ini
        console.log('server on port', port);
    }) //sin ssl fin