//Modificare il valore di snsSlack con l'ARN del topic SNS
var snsSlack = '[YOUR_SNS_ARN]';

//Modificare il valore di generalCh con il canale di default dove arrivano i messaggi che non si riescono a gestire
var generalCh = '#general'; //[YOUR_GENERAL_CHANNEL]

var Alexa = require('alexa-sdk');
var AWS = require('aws-sdk');
var lambda = new AWS.Lambda();

exports.handle = function(event, context, callback){
	var alexa = Alexa.handler(event, context);
	alexa.registerHandlers(newSession, personalInfo, confirmInfo, dest_found_ask, ask_dest, ask_info_dest, coffee, document, interaction);
	alexa.execute();
};

//Variabile contenente gli stati che verranno assunti durante l'interazione per specificare gli intent ammessi
var states={
	PERSONAL_INFO: '_PERSONAL_INFO',
	CONFIRM_INFO: '_CONFIRM_INFO',
	DEST_FOUND_ASK: '_DEST_FOUND_ASK',
	ASK_DEST: '_ASK_DEST',
	ASK_INFO_DEST: '_ASK_INFO_DEST',
	COFFEE: '_COFFEE',
	DOCUMENT: '_DOCUMENT',
	INTERACTION:'_INTERACTION'
};
var fname;
var lname;
var company;
var channel;
var dest = "null";

//Handler degli intent disponibili all'attivazione della skill
var newSession = {

	"LaunchRequest": function () {
		this.handler.state = states.PERSONAL_INFO;
		this.emit(':ask','Welcome in Zero 12 . Could you please tell me your first name, last name and the company you work for?', 'What is your first name, last name and the company you work for.');
	},
	"AMAZON.StopIntent": function() {
	  this.emit(':tell', "Goodbye!");  
	},
	"AMAZON.CancelIntent": function() {
	  this.emit(':tell', "Goodbye!");  
	},
	'SessionEndedRequest': function () {
		console.log('session ended!');
		this.emit(":tell", "Goodbye!");
	}
};

//Handler che riceve i dati personali del cliente
var personalInfo=Alexa.CreateStateHandler(states.PERSONAL_INFO,{

	"LaunchRequest": function () {
		this.handler.state = states.STARTMODE;
		this.emit(':ask','Welcome in Zero 12 . Could you please tell me your first name, last name and the company you work for?', 'What is your first name, last name and the company you work for.');
	},
	'pers_data': function() {
		fname = this.event.request.intent.slots.fname.value;
		lname = this.event.request.intent.slots.lname.value;
		company = this.event.request.intent.slots.company.value;
		fname = fname.replace(/\b\w/g, function(l){ return l.toUpperCase() });
		lname = lname.replace(/\b\w/g, function(l){ return l.toUpperCase() });
		company = company.replace(/\b\w/g, function(l){ return l.toUpperCase() });
		this.handler.state=states.CONFIRM_INFO;
		this.emit(':ask', 'Hello '+fname+' '+lname+'. You work in '+company+'. Is this information correct? Please say yes or no','Hello '+fname+' '+lname+'. You work in '+company+'. Id this information correct? Please say yes or no');
	},
	"AMAZON.StopIntent": function() {
	  console.log("STOPINTENT");
	  this.emit(':tell', "Goodbye!");  
	},
	"AMAZON.CancelIntent": function() {
	  console.log("CANCELINTENT");
	  this.emit(':tell', "Goodbye!");  
	},
	'SessionEndedRequest': function () {
		console.log("SESSIONENDEDREQUEST");
		this.emit(':tell', "Goodbye!");
	},
	'Unhandled': function() {
		console.log("UNHANDLED");
		var message = 'I did not understand what you said. Please retry.';
		this.emit(':ask', message, message);
	}
});

//Handler che riceve la risposta alla conferma dei dati personali
var confirmInfo=Alexa.CreateStateHandler(states.CONFIRM_INFO,{

	"LaunchRequest": function () {
		this.handler.state = states.STARTMODE;
		this.emit(':ask','Welcome in Zero 12 . Could you please tell me your first name, last name and the company you work for?', 'What is your first name, last name and the company you work for.');
	},
	
	"AMAZON.StopIntent": function() {
	  console.log("STOPINTENT");
	  this.emit(':tell', "Goodbye!");  
	},
	"AMAZON.CancelIntent": function() {
	  console.log("CANCELINTENT");
	  this.emit(':tell', "Goodbye!");  
	},
	'SessionEndedRequest': function () {
		console.log("SESSIONENDEDREQUEST");
		this.emit(':tell', "Goodbye!");
	},
	'Unhandled': function() {
		console.log("UNHANDLED");
		var message = 'I did not understand what you said. Please retry.';
		this.emit(':ask', message, message);
	},
	"AMAZON.NoIntent":function(){
		this.handler.state = states.PERSONAL_INFO;
		this.emit(':ask','Please tell me your first name, last name and the company you work for.', 'What is your first name, last name and the company you work for.');
	},
	"AMAZON.YesIntent":function(){
			var audio = this;
			var parameters = {
				FunctionName: 'util_getCustomer',
				InvocationType: 'RequestResponse',
				LogType: 'Tail',
				Payload: '{"first_name":"'+fname+'", "last_name":"'+lname+'", "company":"'+company+'"}'
			};
			lambda.invoke(parameters, function(err,data){
							if(err){
								console.log(err);
								return;
							} else {
								if(data.Payload !== "null"){
									var response = JSON.parse(data.Payload);
									var last_visit = response.last_visit;
									var last_employee = response.last_employee;
									var dateNow = Date.now();
									if((dateNow-last_visit) < 900000){
										var sns = new AWS.SNS();
										sns.publish({
											Message: '{"channel":"'+generalCh+'", "text":"'+fname+' '+lname+' di '+company+' sta attendendo."}',
											TopicArn: snsSlack
										}, function(err, data) {
											if (err) {
												console.log('errore publish sns');
												console.log(error);
												console.log(err.stack);
												return;
											}
											else{
												audio.handler.state = states.STARTMODE;
												audio.emit(':tell',"I have just solicited for someone to help you. Please wait.");
											}
										});
									
									}
									else{
									var params = {
									FunctionName: 'util_checkConstraints',
									InvocationType: 'RequestResponse',
									LogType: 'Tail',
									Payload: '{ "fname" : "'+fname+'", "lname":"'+lname+'", "company":"'+company+'","dest":"'+dest+'","channel":"'+channel+'" }'
								};
								lambda.invoke(params, function(err,data){
									if(err){
										console.log(err);
									} else{
										var result = JSON.parse(data.Payload);
							
										dest = result.dest;
										channel = result.slack;
										caseEmit = result.caseL;

										switch(caseEmit){
											case "1":
												audio.handler.state = states.DEST_FOUND_ASK;
												audio.emit(':ask','Ok '+fname+' '+lname+'. Are you looking for '+dest+'? Please say yes or no','Are you looking for '+dest+'? Please say yes or no');
											break;
											case "2":
												audio.handler.state = states.DEST_FOUND_ASK;
												audio.emit(':ask','Ok '+fname+' '+lname+'. Are you looking for '+dest+'? Please say yes or no','Are you looking for '+dest+'? Please say yes or no');
											break;
											case "3":
												audio.handler.state = states.ASK_DEST;
												audio.emit(':ask','Do you know who are you looking for?','Do you know who are you looking for?');
											break;
										}
									}
								});
								}
								}
							  else{   
								var params = {
									FunctionName: 'util_checkConstraints',
									InvocationType: 'RequestResponse',
									LogType: 'Tail',
									Payload: '{ "fname" : "'+fname+'", "lname":"'+lname+'", "company":"'+company+'","dest":"'+dest+'","channel":"'+channel+'" }'
								};
								lambda.invoke(params, function(err,data){
									if(err){
										console.log("errore lambda constraints");
										console.log(err);
									} else{
										var result = JSON.parse(data.Payload);
                        
										dest = result.dest;
										channel = result.channel;
										caseEmit = result.caseL;
                    
										switch(caseEmit){
											case "1":
												audio.handler.state = states.DEST_FOUND_ASK;
												audio.emit(':ask','Ok '+fname+' '+lname+'. Are you looking for '+dest+'? Please say yes or no','Are you looking for '+dest+'? Please say yes or no');
											break;
											case "2":
												audio.handler.state = states.DEST_FOUND_ASK;
												audio.emit(':ask','Ok '+fname+' '+lname+'. Are you looking for '+dest+'? Please say yes or no','Are you looking for '+dest+'? Please say yes or no');
											break;
											case "3":
												audio.handler.state = states.ASK_DEST;
												audio.emit(':ask','Do you know who are you looking for?','Do you know who are you looking for?');
											break;
										}
									}
								});
							  }     
							}		  
			});  
		}
});

//Handler che riceve la risposta alla conferma del destinatario
var dest_found_ask=Alexa.CreateStateHandler(states.DEST_FOUND_ASK,{
	
	"LaunchRequest": function () {
		this.handler.state = states.STARTMODE;
		this.emit(':ask','Welcome in Zero 12 . Could you please tell me your first name, last name and the company you work for?', 'What is your first name, last name and the company you work for.');
	},
	
	"AMAZON.StopIntent": function() {
	  console.log("STOPINTENT");
	  this.emit(':tell', "Goodbye!");  
	},
	"AMAZON.CancelIntent": function() {
	  console.log("CANCELINTENT");
	  this.emit(':tell', "Goodbye!");  
	},
	'SessionEndedRequest': function () {
		console.log("SESSIONENDEDREQUEST");
		this.emit(':tell', "Goodbye!");
	},
	'Unhandled': function() {
		console.log("UNHANDLED");
		var message = 'I did not understand what you said. Please retry.';
		this.emit(':ask', message, message);
	},
	"AMAZON.YesIntent": function(){
		var audio = this;
		console.log(dest);
		var params = {
			FunctionName: 'util_getSlackChannel',
			InvocationType: 'RequestResponse',
			LogType: 'Tail',
			Payload: '{ "fullname" : "'+dest+'" }'
		};
		console.log("prima di invoke ma dentro yes");
		lambda.invoke(params, function(err,data){
			if (err) {
				console.log('errore invoke lambda');
				console.log(err);
			} else {
				if(data.Payload !== "null"){
					var payload = data.Payload.replace(/\"/g,'');
					var payload = JSON.parse(data.Payload);
					var last_employee = payload.id;
					channel = payload.slack;
					if(data.Payload.slack === "null")
						channel = "general";
					var sns = new AWS.SNS();
					sns.publish({
						Message: '{"channel":"'+channel+'", "text":"'+fname+' '+lname+' di '+company+' è arrivato."}',
						TopicArn: snsSlack
					}, function(err, data) {
					if (err) {
						console.log('errore publish sns');
						console.log(error);
						console.log(err.stack);
					  return;
					}
					var params = {
						FunctionName: 'util_getCustomer',
						InvocationType: 'RequestResponse',
						LogType: 'Tail',
						Payload: '{"first_name":"'+fname+'", "last_name":"'+lname+'", "company":"'+company+'" }'
					}
					lambda.invoke(params, function(err,data){
						if(err){
							console.log('errore invoke lambda getCust');
							console.log(err);
							return;
						} else {
							console.log('lambda getCust invocata');
							console.log(data);
							if(data.Payload === "null"){
								console.log("null lambda get Cust invocata");
								console.log(last_employee);
								var params = {
									FunctionName: 'util_addCustomer',
									InvocationType: 'RequestResponse',
									LogType: 'Tail',
									Payload: '{"first_name":"'+fname+'", "last_name":"'+lname+'", "company":"'+company+'", "last_employee": "'+last_employee+'"}'
									
								}
								lambda.invoke(params, function(err,data){
									if(err){
										console.log('errore invoke lambda add');
										console.log(fname+" "+lname+" "+company+" "+last_employee);
										console.log(data);
										console.log(err);
									} else {
										console.log('lambda add invocata');
										console.log(data);
										if(data){
											audio.handler.state = states.COFFEE;
											audio.emit(':ask','Ok, I have already told '+dest+' about your arrival. Would you like a coffee?','Would you like a coffee?');
										}
										else{
											audio.emit(':ask','Sorry. There was an error. Could you please tell me again your first name, last name and the company you work for?','Could you please tell me again your first name, last name and the company you work for?');
										}
									}
								});				
							}
							else{
								var pay = JSON.parse(data.Payload);
								console.log(pay);
								var id = pay.id;
								console.log(id);
								var params = {
								FunctionName: 'util_updateCustomer',
								InvocationType: 'RequestResponse',
								LogType: 'Tail',
								Payload: '{"id":"'+id+'","last_employee":"'+last_employee+'"}'	
								}
								lambda.invoke(params, function(err,data){
									if(err){
										console.log('errore invoke lambda add');
										console.log(err);
									} 
									else {
										console.log('lambda update invocata');
										console.log(data);
										if(data){
											audio.handler.state = states.COFFEE;
											audio.emit(':ask','Ok, I have already told '+dest+' about your arrival. Would you like a coffee?','Would you like a coffee?');
										}
										else{
											audio.emit(':ask','Sorry. There was an error. Could you please tell me again your first name, last name and the company you work for?','Could you please tell me again your first name, last name and the company you work for?');
										}
									}						
								}); 
							}
						}
					});
					});
				}
				else{
					var params = {
						FunctionName: 'util_getCustomer',
						InvocationType: 'RequestResponse',
						LogType: 'Tail',
						Payload: '{"first_name":"'+fname+'", "last_name":"'+lname+'", "company":"'+company+'" }'
					}
					lambda.invoke(params, function(err,data){
						if(err){
							console.log('errore invoke lambda getCust');
							console.log(err);
							return;
						} else {
							console.log('lambda getCust invocata');
							console.log(data);
							if(data.Payload === "null"){
								console.log("null lambda get Cust invocata");
								console.log(last_employee);
								var params = {
									FunctionName: 'util_addCustomer',
									InvocationType: 'RequestResponse',
									LogType: 'Tail',
									Payload: '{"first_name":"'+fname+'", "last_name":"'+lname+'", "company":"'+company+'", "last_employee": "null"}'
								}
								lambda.invoke(params,function(err,data){
									if(err){
										console.log('errore invoke add cust');
										console.log(err);
										return;
									}else{
										var sns = new AWS.SNS();
										channel=generalCh;
									sns.publish({
										Message: '{"channel":"'+generalCh+'", "text":"'+fname+' '+lname+' di '+company+' è arrivato e attende qualcuno."}',
										TopicArn: snsSlack
									}, function(err, data) {
										if (err) {
											console.log('errore publish sns');
											console.log(error);
											console.log(err.stack);
										  	return;
										}
										audio.handler.state = states.COFFEE;
										dest="someone";
										audio.emit(':ask','Sorry, I did not find the employee you are looking for, but someone is going to help you. Would you like a coffee?','Sorry, I did not find the employee you are looking for, but I someone is going to help you. Would you like a coffee?');
									});
									}
								})

							}
							else{
								var pay = JSON.parse(data.Payload);
								console.log(pay);
								var id = pay.id;
								console.log(id);
								var params = {
								FunctionName: 'util_updateCustomer',
								InvocationType: 'RequestResponse',
								LogType: 'Tail',
								Payload: '{"id":"'+id+'","last_employee":"null"}'	
								}
								lambda.invoke(params, function(err,data){
									if(err){
										console.log('errore invoke lambda add');
										console.log(err);
									} 
									else {
										console.log('lambda update invocata');
										var sns = new AWS.SNS();
										channel=generalCh;
										sns.publish({
											Message: '{"channel":"'+generalCh+'", "text":"'+fname+' '+lname+' di '+company+' è arrivato e attende qualcuno."}',
											TopicArn: snsSlack
										}, function(err, data) {
											if (err) {
												console.log('errore publish sns');
												console.log(error);
												console.log(err.stack);
												return;
											}
											audio.handler.state = states.COFFEE;
											dest="someone";
											audio.emit(':ask','Sorry, I did not find the employee you are looking for, but someone is going to help you. Would you like a coffee?','Sorry, I did not find the employee you are looking for, but I someone is going to help you. Would you like a coffee?');
					});
				}
			});
			}
		}});
	}
}
})
},
	"AMAZON.NoIntent": function(){
		dest="null";
		this.handler.state = states.ASK_DEST;
		this.emit(':ask','Do you know who are you looking for?','Do you know who are you looking for?');
											
	}
	
});

//Handler che riceve la risposta se il cliente conosce o meno l'impiegato che deve incontrare
var ask_dest=Alexa.CreateStateHandler(states.ASK_DEST,{

	"LaunchRequest": function () {
		this.handler.state = states.STARTMODE;
		this.emit(':ask','Welcome in Zero 12 . Could you please tell me your first name, last name and the company you work for?', 'What is your first name, last name and the company you work for.');
	},
	
	"AMAZON.StopIntent": function() {
	  console.log("STOPINTENT");
	  this.emit(':tell', "Goodbye!");  
	},
	"AMAZON.CancelIntent": function() {
	  console.log("CANCELINTENT");
	  this.emit(':tell', "Goodbye!");  
	},
	'SessionEndedRequest': function () {
		console.log("SESSIONENDEDREQUEST");
		this.emit(':tell', "Goodbye!");
	},
	'Unhandled': function() {
		console.log("UNHANDLED");
		var message = 'I did not understand what you said. Please retry.';
		this.emit(':ask', message, message);
	},
	"AMAZON.YesIntent": function(){
		this.handler.state = states.ASK_INFO_DEST;
		this.emit(':ask','"What is the first name and last name of the employee you are looking for?','What is the first name and last name of the employee you are looking for?');
	},
	"AMAZON.NoIntent": function(){
		this.handler.state = states.COFFEE;
		var audio = this;
		var sns = new AWS.SNS();
			sns.publish({
				Message: '{"channel":"'+generalCh+'", "fname":"'+fname+'", "lname":"'+lname+'", "text":"'+fname+' '+lname+' di '+company+' è arrivato e attende qualcuno."}',
				TopicArn: snsSlack
			}, function(err, data) {
			if (err) {
				console.log('errore publish sns');
				console.log(err);
				console.log(err.stack);
				var speechOut="An error has occurred. Check Cloudwatch";
				audio.emit(':ask',speechOut,speechOut);
				return;
			}
			else{
				console.log("publish giusta");
				console.log(err);
				console.log(data);
				channel = generalCh;
				dest = "someone";
				var params = {
					FunctionName: 'util_addCustomer',
					InvocationType: 'RequestResponse',
					LogType: 'Tail',
					Payload: '{"first_name":"'+fname+'", "last_name":"'+lname+'", "company":"'+company+'", "last_employee": "null"}'			
				}
				lambda.invoke(params, function(err,data){
					if(err){
						console.log('errore invoke lambda add');
						console.log(fname+" "+lname+" "+company+" "+last_employee);
						console.log(data);
						console.log(err);
					} else {
						console.log('lambda add invocata');
						console.log(data);
				var speechOut="Ok. Someone is going to help you. Would you like a coffee?";
				audio.emit(':ask',speechOut,speechOut);
			}
			});
			}
		});
	}
});

//Handler che riceve il nome e il cognome dell'impiegato che il cliente vuole incontrare
var ask_info_dest=Alexa.CreateStateHandler(states.ASK_INFO_DEST,{

	"LaunchRequest": function () {
		this.handler.state = states.STARTMODE;
		this.emit(':ask','Welcome in Zero 12 . Could you please tell me your first name, last name and the company you work for?', 'What is your first name, last name and the company you work for.');
	},
	
	"AMAZON.StopIntent": function() {
	  console.log("STOPINTENT");
	  this.emit(':tell', "Goodbye!");  
	},
	"AMAZON.CancelIntent": function() {
	  console.log("CANCELINTENT");
	  this.emit(':tell', "Goodbye!");  
	},
	'SessionEndedRequest': function () {
		console.log("SESSIONENDEDREQUEST");
		this.emit(':tell', "Goodbye!");
	},
	'Unhandled': function() {
		console.log("UNHANDLED");
		var message = 'I did not understand what you said. Please retry.';
		this.emit(':ask', message, message);
	},
	"destInfo":function(){
		dest = this.event.request.intent.slots.fullname.value;
		dest = dest.replace(/\b\w/g, function(l){ return l.toUpperCase() });
		console.log(dest);
		this.handler.state = states.DEST_FOUND_ASK;
		this.emit(':ask','Are you looking for '+dest+'?');
	}
});

//Handler che gestisce la richiesta di caffè, inviando un messaggio appropriato
var coffee=Alexa.CreateStateHandler(states.COFFEE,{
	"LaunchRequest": function () {
		this.handler.state = states.STARTMODE;
		this.emit(':ask','Welcome in Zero 12 . Could you please tell me your first name, last name and the company you work for?', 'What is your first name, last name and the company you work for.');
	},
	
	"AMAZON.StopIntent": function() {
	  console.log("STOPINTENT");
	  this.emit(':tell', "Goodbye!");  
	},
	"AMAZON.CancelIntent": function() {
	  console.log("CANCELINTENT");
	  this.emit(':tell', "Goodbye!");  
	},
	'SessionEndedRequest': function () {
		console.log("SESSIONENDEDREQUEST");
		this.emit(':tell', "Goodbye!");
	},
	'Unhandled': function() {
		console.log("UNHANDLED");
		var message = 'I did not understand what you said. Please retry.';
		this.emit(':ask', message, message);
	},
	"AMAZON.YesIntent": function(){
		var audio = this;
		//messaggio slack a dest per il caffè
		var sns = new AWS.SNS();
		sns.publish({
		   Message: '{"channel":"'+channel+'", "text":"'+fname+' '+lname+' desidera un caffè"}',
		   TopicArn: snsSlack
		}, function(err, data) {
			 if (err) {
			  console.log('errore publish sns');
			  console.log(error);
			  console.log(err.stack);
			return;
		}
			audio.handler.state = states.DOCUMENT;
			audio.emit(':ask','Ok, I tell '+dest+' about it. Do you need something for the meeting?','Do you need something for the meeting?');
		});    
	},
	"AMAZON.NoIntent": function(){
		var audio = this;
		//messaggio slack a dest per il caffè
		var sns = new AWS.SNS();
		sns.publish({
		   Message: '{"channel":"'+channel+'", "text":"'+fname+' '+lname+' non desidera un caffè"}',
		   TopicArn: snsSlack
		}, function(err, data) {
			 if (err) {
			  console.log('errore publish sns');
			  console.log(error);
			  console.log(err.stack);
			return;
		}
			console.log("publish giusta");
			audio.handler.state = states.DOCUMENT;
			audio.emit(':ask','Ok. Do you need something for the meeting?','Do you need something for the meeting?');
		});
	}
});

//Handler che gestisce la richiesta di documenti, inviando un messaggio appropriato
var document=Alexa.CreateStateHandler(states.DOCUMENT,{

	"LaunchRequest": function () {
		this.handler.state = states.STARTMODE;
		this.emit(':ask','Welcome in Zero 12 . Could you please tell me your first name, last name and the company you work for?', 'What is your first name, last name and the company you work for.');
	},
	
	"AMAZON.StopIntent": function() {
	  console.log("STOPINTENT");
	  this.emit(':tell', "Goodbye!");  
	},
	"AMAZON.CancelIntent": function() {
	  console.log("CANCELINTENT");
	  this.emit(':tell', "Goodbye!");  
	},
	'SessionEndedRequest': function () {
		console.log("SESSIONENDEDREQUEST");
		this.emit(':tell', "Goodbye!");
	},
	'Unhandled': function() {
		console.log("UNHANDLED");
		var message = 'I did not understand what you said. Please retry.';
		this.emit(':ask', message, message);
	},
	"AMAZON.YesIntent": function(){
		var audio = this;
		//messaggio slack a dest per i documenti
		var sns = new AWS.SNS();
		sns.publish({
			Message: '{"channel":"'+channel+'", "text":"'+fname+' '+lname+' richiede materiale per il meeting"}',
			TopicArn: snsSlack
		}, function(err, data) {
			 if (err) {
				console.log('errore publish sns');
				console.log(error);
				console.log(err.stack);
				return;
			}
			console.log("publish giusta");
			audio.handler.state=states.INTERACTION;
			audio.emit(':ask','Ok, '+dest+' will arrive with something for you. Would you like to know something cool?','Ok, '+dest+' will arrive with something for you. Would you like to know something cool?');
		});
	},
	"AMAZON.NoIntent": function(){
		var audio = this;
		//messaggio slack a dest per i documenti
		var sns = new AWS.SNS();
		sns.publish({
			Message: '{"channel":"'+channel+'", "text":"'+fname+' '+lname+' non necessita di materiale per il meeting"}',
			TopicArn: snsSlack
		}, function(err, data) {
			 if (err) {
				console.log('errore publish sns');
				console.log(error);
				console.log(err.stack);
				return;
			}
			console.log("publish giusta");
			audio.handler.state=states.INTERACTION;
			audio.emit(':ask','Ok. Would you like to know something cool?','Ok. Would you like to know something cool?');
		});
	}
});

var interaction=Alexa.CreateStateHandler(states.INTERACTION,{

	"LaunchRequest": function () {
		this.handler.state = states.STARTMODE;
		this.emit(':ask','Welcome in Zero 12 . Could you please tell me your first name, last name and the company you work for?', 'What is your first name, last name and the company you work for.');
	},
	
	"AMAZON.StopIntent": function() {
	  console.log("STOPINTENT");
	  this.emit(':tell', "Goodbye!");  
	},
	"AMAZON.CancelIntent": function() {
	  console.log("CANCELINTENT");
	  this.emit(':tell', "Goodbye!");  
	},
	'SessionEndedRequest': function () {
		console.log("SESSIONENDEDREQUEST");
		this.emit(':tell', "Goodbye!");
	},
	'Unhandled': function() {
		console.log("UNHANDLED");
		var message = 'I did not understand what you said. Please retry.';
		this.emit(':ask', message, message);
	},

	'AMAZON.YesIntent':function(){
		var params = {
			FunctionName: 'util_selectCuriosity',
			InvocationType: 'RequestResponse',
			LogType: 'Tail'
			//Payload: '{ "fullname" : "'+dest+'" }'
		};
		var audio=this;
		lambda.invoke(params, function(err,data){

			if(err){
				console.log('errore invoke lambda util_selectCuriosity');
				console.log(err);
				return;
			} else {
				console.log(data);
				var result = JSON.parse(data.Payload);
				console.log(result);
				audio.emit(':tell',result,result);
			}
		});

	},
	'AMAZON.NoIntent':function(){
		console.log("NoIntent");
		this.emit(':tell','Ok, Goodbye','Ok, Goodbye');
	}
});
