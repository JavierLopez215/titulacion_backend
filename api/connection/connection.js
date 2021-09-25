const mysql = require('mysql');

const mySqlConnection= mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'titulacion'
});

mySqlConnection.connect(err=>{
    if(err){
        // console.log('Error en db: ',err);
        console.log('Error iniciando la base de datos');
        return
    }else{
        console.log('Db ok');
    }
});

module.exports=mySqlConnection;