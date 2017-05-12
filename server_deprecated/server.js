//var server = require("http");
var lm = require('./modules/lwa');
var config = require('./modules/config');
var im = require('./modules/interaction');
const https = require('https');
var http2 = require('http2');
var path    = require("path");
const fs = require('fs');
const request = require('request');
const express = require('express');
const app = express();

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


const server = https.createServer(options, app).listen(config.port) ;

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/site/views/UserView.html'));
});

app.get('/login',function(req,res){
  res.sendFile(path.join(__dirname+'/site/views/AdminLoginView.html'));
});

app.get('/rules',function(req,res){
  res.sendFile(path.join(__dirname+'/site/views/AdminView.html'));
});

app.get('/reset',function(req,res){
  res.sendFile(path.join(__dirname+'/site/views/ChangePasswordView.html'));
});

app.get('/lwa', function(req, res) {//redirect a lpagina lwa
	res.redirect('https://www.amazon.com/ap/oa?client_id='+config.AWS.clientId+'&scope='+ config.AWS.scope+ '&scope_data='+encodeURI(JSON.stringify(config.AWS.scopeData))+ '&response_type=' + config.AWS.responseType + '&redirect_uri=' + config.AWS.redirectUri );
})

app.get('/authresponse', function(req, res) {
  var code=req.query.code;
	var options={
		method:"POST",
		url:"https://api.amazon.com/auth/o2/token",
		headers:{
			"Content-Type":"application/x-www-form-urlencoded"
		},
		form:{
			"grant_type" : "authorization_code",
			"code" : code,
			"client_id": config.AWS.clientId,
		  "client_secret": config.AWS.clientSecret,
			"redirect_uri": config.AWS.redirectUri
		}
	}
	request(options, function (error, response, body) {
		if(error){
			console.log(error);
		}

     	if (!error && response.statusCode == 200) {
     		var jsonbody = JSON.parse(body);
 			  lm.setTokens(JSON.stringify(jsonbody.access_token), JSON.stringify(jsonbody.refresh_token))
     	}
      res.redirect(301,'/connection');
    })
});

app.get('/connection', function(req, res){
  var token = lm.getToken();
  im.establishDownChannel(token);
  im.synchronizeState(token);
  //res.redirect(301,'/');
});


app.get('/kek', function(req, res){
	var token = lm.getToken();
    im.sendAudio(token);
});


app.get('/lwa/logout', function(req, res){
	lm.deleteTokens();
	res.redirect('/');
})
