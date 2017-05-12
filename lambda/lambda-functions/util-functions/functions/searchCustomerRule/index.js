
// IN { fname : "first_name", lname : "last_name", company : "company"} in event
// OUT employee_rules[id]
console.log("loading function searchCustomerRule");
var AWS = require('aws-sdk');
var lambda = new AWS.Lambda();
if (!AWS.config.region) {
    AWS.config.update({
        region: "us-west-1",
        endpoint: "http://localhost:8000"
    });   
}
var db = new AWS.DynamoDB.DocumentClient();

//Funzione che ritorna i dati dell'impiegato associato alla regola di interesse
var getSlack = function(idEmployee,cb){
		var params = {
		FunctionName: 'rules_getEmployeeRule',
		InvocationType: 'RequestResponse',
		LogType: 'Tail',
		Payload: '{ "id" : "'+idEmployee+'" }'
	};
	lambda.invoke(params, function(err, data) {
			console.log(idEmployee);
			console.log("entra");
				if (err) {
				console.log("err getslack");
						cb(err,null);
		} else {
				console.log("no err getslack");
				var result = data.Payload;
						console.log(result);
						cb(null,result);
		}
	})
}

//Funzione che cerca nel database se esiste una regola associata al cliente. In caso affermativo invoca la funzione che ricerca i dati 
//dell'impiegato associato, altrimenti invoca la funzione che cerca se esiste una regola associata all'azienda
var searchIdByNames= function(e,cb) {
		var params = {
				TableName : "customer_rules",
				FilterExpression: "first_name = :firstname AND last_name = :lastname",
				ExpressionAttributeValues: {
				":firstname":e.fname,
				":lastname":e.lname
				}
		};
		
		db.scan(params,function(err,data){
				console.log(data);
				console.log(data.Items[0]);
				console.log(e.fname);
				console.log(e.lname);
				console.log(e.company);
				if (data.Items[0]===undefined){
						console.log("err names");
						console.log(JSON.stringify(err, null, 2));
						searchIdByCompany(e,cb);
				} else {
						console.log("ok names");
						console.log(JSON.stringify(data.Items[0].employee_id, null, 2));
						var idEmpl = data.Items[0].employee_id;
						var emplName = data.Items[0].fullname;
						console.log(JSON.stringify(data.Items[0],null,2));
						getSlack(idEmpl,cb);
				}
		});
}

//Funzione che cerca nel database se esiste una regola associata all'azienda di cui fa parte il cliente.
//In caso affermativo invoca la funzione che ricerca i dati dell'impiegato associato,
//altrimenti ritorna null
var searchIdByCompany = function(e,cb) {
		var params = {
				TableName : "customer_rules",
				FilterExpression: "first_name = :firstname AND last_name = :lastname AND company = :company",
				ExpressionAttributeValues: {
				":firstname": "null",
				":lastname": "null",
				":company":e.company
				}
		};
		
		db.scan(params,function(err,data){
				if (data.Items[0]===undefined){
						console.log("err comp");
						console.log(JSON.stringify(err, null, 2));
						cb(err,null);
				}else{
						console.log("no err comp");
						console.log(JSON.stringify(data.Items[0].employee_id, null, 2));
						var idEmpl=data.Items[0].employee_id;
						getSlack(idEmpl,cb);
				}
		});
}

//Funzione che dati nome, cognome e azienda di appartenenza controlla se esiste una regola nel database
exports.handle = function(e, ctx, cb) {
		if (!e.fname || !e.lname || !e.company) {
				cb("Missing parameters");
				return;
		} else {
			searchIdByNames(e,cb);
		}
}



