//var server = require("http");
const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
var path = require('path');

const options = {
	key: fs.readFileSync('./ssl/server.key'),
	cert: fs.readFileSync('./ssl/server.crt'),
	rejectUnauthorized: false
};

app.use("/css",  express.static(__dirname + '/site/assets/css'));
app.use("/js", express.static(__dirname + '/site/assets/js'));
app.use("/images",  express.static(__dirname + '/site/assets/images'));
app.use("/controllers",  express.static(__dirname + '/site/controllers'));
app.use("/modules",  express.static(__dirname + '/site/modules'));
app.use("/scripts",  express.static(__dirname + '/site/scripts'));
app.use("/views",  express.static(__dirname + '/site/views'));
app.use("/fonts",  express.static(__dirname + '/site/assets/fonts'));


const server = https.createServer(options, app).listen(8080) ;


app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/site/views/AdminLoginView.html'));
});

app.get('/rules',function(req,res){
  res.sendFile(path.join(__dirname+'/site/views/AdminView.html'));
});

app.get('/reset',function(req,res){
  res.sendFile(path.join(__dirname+'/site/views/ChangePasswordView.html'));
});
