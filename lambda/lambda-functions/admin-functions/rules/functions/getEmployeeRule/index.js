// IN { id : "id"} in event
// OUT employee_rules[id] ==> id, fullname, slack

console.log("loading function rules_getEmployeeRule");
var AWS = require("aws-sdk");
if (!AWS.config.region) {
  process.env.SECRET = "test-encryption-key";
  AWS.config.update({
      region: "us-west-1",
      endpoint: "http://localhost:8000"
  });   
}
var db = new AWS.DynamoDB.DocumentClient();

exports.handle = function(e, ctx, cb) {

    if (!e.id) {
        cb("400 - Missing parameters.");
    } else {

        var params = {
            AttributesToGet: [
              "id",
              "fullname",
              "slack"
            ],
            TableName : "employee_rules",
            Key : { 
              "id" : e.id
            }
        };

	    db.get(params, function(err, data) {
	        if (err) {
	          	cb("500 - Could not get item.");
          } else if (!data.Item) {
              cb("204 - Item not found.") 
	        } else {
	          	cb(null, data.Item);
	      	}
	    });
	}

};
