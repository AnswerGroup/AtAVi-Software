
// IN { first_name : "first_name", last_name : "last_name", company : "company"} in event
// OUT "caseL","dest","channel"

console.log("loading function util_checkConstraints");
var AWS = require("aws-sdk");
if (!AWS.config.region) {
    AWS.config.update({
        region: "us-west-1",
        endpoint: "http://localhost:8000"
    });   
}
var db = new AWS.DynamoDB.DocumentClient();
var lambda = new AWS.Lambda();

//Funzione che controlla l'esistenza di vincoli nell'interazione ritornando il nome e cognome dell'impiegato, il suo canale slack e:
//caseL = 1 se esiste una regola associata al cliente o all'azienda,
//caseL = 2 se non esiste una regola associata al cliente o all'azienda, ma esiste 'last_employee',
//caseL = 3 se non esiste una regola associata al cliente o all'azienda e non esiste 'last_employee'
exports.handle = function(e, ctx, cb) {
	var fname=e.fname;
	var lname=e.lname;
	var company=e.company;
	var dest;
	var channel;
	var params = {
		FunctionName: 'util_searchCustomerRule',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: '{ "fname" : "'+fname+'", "lname":"'+lname+'", "company":"'+company+'" }'
	};
	console.log("prima di invoke ma dentro yes");
	lambda.invoke(params, function(err,data){
		if (err) {
			console.log('errore invoke lambda');
			console.log(err);
		} else {
			console.log('lambda invocata');
			console.log(data);
			if(data.Payload!=="null"){
				//se si
				console.log("data.payload search customer !== null ");
				var response = JSON.parse(JSON.parse(data.Payload));
				console.log(response);
				dest = response.fullname;
				channel = response.slack;
				console.log(dest);
				console.log(channel);
				console.log(response.fullname);
				console.log(response.slack);
				var result = '{"caseL":"1", "dest":"'+dest+'","channel":"'+channel+'"}'
				console.log(result);
				result = JSON.parse(result);
				cb(null,result);
			}
			else{
				//se no
				//funzione che cerca se il cliente ha un last_employee
				console.log("data.payload search customer === null ");
				var params2 = {
					FunctionName: 'util_getLastEmployee',
					InvocationType: 'RequestResponse',
					LogType: 'Tail',
					Payload: '{ "fname" : "'+fname+'", "lname":"'+lname+'", "company":"'+company+'" }'
				};
				console.log("prima di invoke ma dentro yes");
				var lambda2 = new AWS.Lambda();
				lambda2.invoke(params2, function(err,data){
					if (err) {
					console.log('errore invoke lambda');
					console.log(err);
					} else {
						//se si
						if(data.Payload !== "null"){
							console.log("data.payload get last employee !== null ");
							console.log(data);
							dest = data.Payload;
							console.log(dest);
							dest = dest.replace(/\"/g,"");
							console.log(dest);
							var result = '{"caseL":"2", "dest":"'+dest+'","channel":"'+channel+'"}'
							console.log(result);
							result = JSON.parse(result);
							cb(null,result);
						}
						else{
							//se no
							console.log("data.payload get last employee === null ");
							var result = "{\"caseL\":\"3\",\"dest\":\""+dest+"\",\"channel\":\""+channel+"\"}"
							console.log(result);
							result = JSON.parse(result);
							cb(null,result);
						}
					}
				});
			}
		}
	});
}
