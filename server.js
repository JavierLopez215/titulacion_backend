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



const port = process.env.PORT || 3000;
//const port=80;
// app.use('*/uploads',express.static('uploads'));

//const server = http.createServer(app);
//server.setTimeout(60000000,()=>{
    // console.log("Socket is destroyed due to timeout");
//})

app.listen(port, ()=> {
    console.log('server on port', port);
})
