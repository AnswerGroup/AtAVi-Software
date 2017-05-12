
// IN {fname = "first name", lname = "last name"} in event
// OUT employee_rules[fname,lname] ==> first_name last_name

//var reee = require("./rules_getEmployeeRule.js").handle
console.log("loading function customer_getLastEmployee");
var AWS = require("aws-sdk");
if (!AWS.config.region) {
    AWS.config.update({
        region: "us-west-1",
        endpoint: "http://localhost:8000"
    });   
}
var db = new AWS.DynamoDB.DocumentClient();
var lambda = new AWS.Lambda();
var params = {
  TableName : "customer",
  Item : { 
    "id" : "1",
    "first_name": "Giorgio",
    "last_name": "Bianchi",
    "company": "Google",
    "last_employee": "061889c7-e8c4-400c-9959-54a328f46fb0",
    "last_visit": "1492184184776"
  }
};
db.put(params, function(err, data) {
  if (err) {
      console.log("500 - Could not add rule.");
    }
});

//Funzione che, dati nome e cognome del cliente, ritorna il nome e cognome dell'ultimo impiegato incontrato

exports.handle = function(e, ctx, cb) {
	if (!e.fname || !e.lname) {
		cb("Missing parameters.");
	} else {
		var fname = e.fname;
		var lname = e.lname;
		console.log(fname);
		console.log(lname);
		//Parametri di ricerca del cliente
		var params = {
			TableName : "customer",
			FilterExpression: "first_name = :firstname AND last_name = :lastname",
			ExpressionAttributeValues: {
				":firstname":e.fname,
				":lastname":e.lname
			}
		};
	//Ricerca del cliente secondo i parametri 'params'
	db.scan(params, function(err,data){
		console.log(data);
		console.log(data.Items);
		console.log(data.Items[0]);
		if(data.Items[0] === undefined){
			console.log(JSON.stringify(err,null,2));
			cb(null,null);
		}
		else{
			console.log("else");
			console.log(JSON.stringify(data.Items[0].last_employee, null, 2));
			var le = data.Items[0].last_employee;
			//Parametro di ricerca dell'impiegato
			var params2 = {
				FunctionName: 'rules_getEmployeeRule',
				InvocationType: 'RequestResponse',
				LogType: 'Tail',
				Payload: '{ "id" : "'+le+'" }'
			};
			console.log("prima di invoke ma dentro yes");
			//Invoca funzione getEmployeeRule con l'id dell'impiegato
			lambda.invoke(params2, function(err,data2){
				if (err) {
					console.log('errore invoke lambda');
					console.log(err);
				} else {
					result = JSON.parse(data2.Payload);
					result = result.fullname;
			cb(null, result);
		}
		});
	}});
	}
}
