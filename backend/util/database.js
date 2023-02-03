const mysql=require("mysql2");
const Sequelize=require('sequelize');


const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "muhammed12q"
});

connection.query(`CREATE DATABASE IF NOT EXISTs agu_meetUp`,function(err,result){
    console.log(err);
    console.log(result);
})
connection.end();

const sequelize=new Sequelize('agu_meetUp','root','',
{dialect:'mysql',
host:'localhost',
password:'muhammed12q'
});

module.exports=sequelize;