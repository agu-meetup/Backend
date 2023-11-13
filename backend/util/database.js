const mysql=require("mysql2");
const Sequelize=require('sequelize');


const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "123456"
});

connection.query(`CREATE DATABASE IF NOT EXISTs agu_meetUp`,function(err,result){
    console.log(err);
    console.log(result);
})
connection.end();

const sequelize=new Sequelize('agu_meetUp','root','',
{dialect:'mysql',
host:'localhost',
password:'123456',
timezone : '+03:00',
});

module.exports=sequelize;