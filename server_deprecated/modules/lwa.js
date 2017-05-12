//lwaModule contiene tutti i metodi richiamabili tramite il server che riguardano il login di amazon e gestione del token
var config=require('./config')
const request=require('request');

var token='';
var refresh_token='';//refresh token


function setTokens(_token, _refresh_token){
	token=_token.replace(/\"/g,'');
	console.log('aggiornato token');
	refresh_token=_refresh_token.replace(/\"/g,'');
	console.log('aggiornato refresh token');
}

exports.deleteTokens=function(){
	token='';
	refresh_token='';
	console.log('cancellati tokens');

}

exports.getToken=function(){
	return token;
}

exports.getRefreshToken=function(){
	return refresh_token;
}

exports.authRefresh=function(){

	var opt = {
		method:"POST",
		url:"https://api.amazon.com/auth/o2/token",
		headers:{
			"Content-Type":"application/x-www-form-urlencoded"
		},
		form:{
			"grant_type" : "refresh_token",
			"refresh_token" : refresh_token,
			"client_id": config.AWS.clientId,
			"client_secret": config.AWS.clientSecret
		}
	}

	request(opt,function(error,response,body){
		if(error){
			console.log("errore");
			console.log(error);
		}
		if (!error && response.statusCode == 200) {
				var jsonbody = JSON.parse(body);
   				setTokens(JSON.stringify(jsonbody.access_token), JSON.stringify(jsonbody.refresh_token));

		}
		else{
			console.log(response.statusCode);
			console.log(error);
		}
	})

}

exports.setTokens=setTokens;
