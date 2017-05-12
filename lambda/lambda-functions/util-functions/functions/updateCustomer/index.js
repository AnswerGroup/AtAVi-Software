
// IN { id : "id", last_employee : "last employee"} in event
// OUT rule updated with new last_employee and new last_visit

console.log("loading function util_updateCustomer");
var AWS = require('aws-sdk');
if (!AWS.config.region) {
    AWS.config.update({
        region: "us-west-1",
        endpoint: "http://localhost:8000"
    });
}
var db = new AWS.DynamoDB.DocumentClient();

//Funzione che dato l'id del cliente e il suo 'last_employee', aggiorna il suo 'last_employee' e il 'last_visit' 
exports.handle = function(e, ctx, cb) {
	if (!e.id || !e.last_employee) {
		cb("Missing parameters.");
		return;
	} else {
		var date = Date.now();
		var paramsToUpdate = {
			TableName : "customer",
			Key : { 
				"id" : e.id
			},
			UpdateExpression: "set last_employee = :lem, last_visit = :lv",
			ExpressionAttributeValues:{
				":uid": e.id,
				":lem":e.last_employee,
				":lv":date
			},
			ReturnValues:"NONE",
			ConditionExpression: "id = :uid"
		};
		db.update(paramsToUpdate, function(err, data){
			if (err) {
				//console.log(err)
				cb("Could not update rule.");
			} else {
				cb(null, "Rule successfully updated.");
				
			}
		});
	}
}
