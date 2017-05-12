
// IN { first_name : "first_name", last_name : "last_name", company : "company", last_employee : "last employee"} in event
// OUT added customer id

console.log("loading function util_addCustomer");
var AWS = require('aws-sdk');
if (!AWS.config.region) {
    AWS.config.update({
        region: "us-west-1",
        endpoint: "http://localhost:8000"
    });   
}
var db = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid/v4");

//Funzione per l'inserimento di un nuovo cliente nel database
//Vengono passati in event i dati relativi al nome, cognome, azienda e ultimo cliente
//viene quindi creato un nuovo item nella tabella relativa ai clienti con i dati in input, un id creato con un'apposita
//funzione uuid() e la data di ultima visita impostata con Date.now()

//La funzione ritorna l'id del cliente inserito in caso di successo, altrimenti ritorna un errore
exports.handle = function(e, ctx, cb) {
	if (!e.first_name || !e.last_name || !e.company || !e.last_employee) {
		cb("Missing parameters.");
		return;
	} else {
		var date = Date.now();
		var params = {
			TableName : "customer",
			Item : { 
				"id" : uuid(),
				"first_name": e.first_name,
				"last_name": e.last_name,
				"company": e.company,
				"last_employee":e.last_employee,
				"last_visit":date
			}
		};

		db.put(params, function(err, data) {
			if (err) {
				console.log(err)
				cb("Could not add customer.");
			} else {
				cb(null, params.Item.id);
			}
		});  
	}
}
