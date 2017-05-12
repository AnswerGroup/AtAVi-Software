
// IN {first_name : "first name", last_name : "last name", company : "company"} in event
// OUT customer[first_name, last_name, company]

console.log("loading function util_getCustomer");
var AWS = require("aws-sdk");
if (!AWS.config.region) {
    AWS.config.update({
        region: "us-west-1",
        endpoint: "http://localhost:8000"
    });   
}
var db = new AWS.DynamoDB.DocumentClient();

//Funzione per ritornare i dati di un utente dati nome, cognome e azienda
exports.handle = function(e, ctx, cb) {
	if (!e.first_name || !e.last_name || !e.company) {
		cb("Missing parameters.");
		return;
	} else {
		//parametri di ricerca
		var params = {
			TableName : "customer",
			FilterExpression: "first_name = :firstname AND last_name = :lastname AND company = :comp",
			ExpressionAttributeValues: {
				":firstname":e.first_name,
				":lastname":e.last_name,
				":comp":e.company
			}
		};
	//Ricerca nel database con i parametri 'params'
	db.scan(params, function(err,data){
		if(data.Items[0] == undefined){
			cb(null);
		}
		else{
			//Ritorna il primo risultato
			cb(null, data.Items[0]);

	}});
	}
}
