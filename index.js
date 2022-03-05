// npm install mysql
// go to mysqlinstaller
// authentication - click second option
// last tab excecute

const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");

require('dotenv').config();
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));

var net = require('net');
var errors = ['EADDRINUSE'];    
var isUsed = function(port) {
    var tester = net.createServer()
        .once('error', function (err) {
          if (!errors.includes(err.code)) {
           console.log("Port is in use, change the port.");
          }
        })
        .once('listening', function() {
            tester.once('close', function() { 
                console.log("You are good to go."); 
            })
            .close()
        })
        .listen(port);
}

var mysqlConn = mysql.createConnection({
    connectionLimit : 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port:process.env.DB_PORT,
    multipleStatements: true
});

mysqlConn.connect((err)=> {
    if(!err)
    {
        console.log("connected");
    }else{
        console.log("Connection failed!");
        console.log(err);
        
    }
});

app.get('/',(req,res)=>{
    res.sendFile('index.html',{root: _dirname})
});
/*
// Get all records 
app.get('/submitted',(req,res)=>{    // whenever the form route is chosen, the following steps are excecuted
    mysqlConn.query('SELECT * FROM users',(err,rows,fields)=>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    });
});
*/
app.post('/submit',(req,res)=>{  
    console.log(req.body);
    res.render('index',{title:'Data Saved',message:'Data saved successfully!'})
    var sql = "INSERT INTO users VALUES(req.body.username,req.body.emailID)"
    mysqlConn.query('SELECT * FROM users',(err,rows,fields)=>{
        if(!err){
        res.send(rows);
        res.redirect('/submitted.html')}
        else
        console.log(err);
    });
});
/*
app.post('/submitted',function(req,res){

  var pass=req.body.password;
  var email=req.body.email;
  var username=req.body.username;
  res.write('You sent the email "' + req.body.email+'".\n');
  res.write('You sent the username "' + req.body.username+'".\n');

  con.connect(function(err) {
  if (err) console.log(err);
  var sql = "INSERT INTO users  VALUES ('"+username+"',  '"+email+"', '"+pass+")";
  con.query(sql, function (err, result) {
    if (err) console.log(err);
    console.log("1 record inserted");
     res.end();
  });
  });
*/


// get one record basedon user id
//  /form/1 if not using id
/*
app.get('/form/:id',(req,res)=>{
    var uid = req.params.id;
    mysqlConn.query('SELECT * FROM users WHERE userID = ?',[uid],(err,rows,fields)=>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })
});
*/
app.listen(3000)
