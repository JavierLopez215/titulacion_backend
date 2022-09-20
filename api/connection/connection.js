const mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit:10000,
  host:'localhost',
  user:'root',
  password:'',
  database:'titulacion'
});

module.exports=pool;
//const mySqlConnection= mysql.createConnection({
    //host:'localhost',
    //user:'root',
    //password:'Javier02042015*',
  //  database:'titulacion'
//});

//mySqlConnection.connect(err=>{
    //if(err){
        // console.log('Error en db: ',err);
       // console.log('Error iniciando la base de datos');
        //return
    //}else{
      //  console.log('Db ok');
    //}
//});

//module.exports=mySqlConnection;
