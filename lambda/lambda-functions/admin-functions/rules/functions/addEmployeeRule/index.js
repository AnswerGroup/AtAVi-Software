// IN fullname, slack in event
// OUT success/error message

console.log("loading function rules_addEmployeeRule");
var AWS = require("aws-sdk");

if (!AWS.config.region) { // region is not set if teting on local machine
	process.env.SECRET = "test-encryption-key";
    AWS.config.update({
        region: "us-west-1",
        endpoint: "http://localhost:8000"
    });   
}

var db = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid/v4");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

exports.handle = function(e, ctx, cb) {
    
	jwt.verify(e.auth, secret, function(err, decoded){  
	    if(!decoded) {
	        cb("401 - Not Authorized.");
	    } else {
		  	if (!e.fullname || !e.slack) {
			      cb("400 - Missing parameters.");
		  	} else {
			    var params = {
			        TableName : "employee_rules",
			        Item : { 
			            "id" : uuid(),
			            "fullname": e.fullname,
			            "slack": e.slack
			        }
			    };

			    db.put(params, function(err, data) {
			        if (err) {
			          	cb("500 - Could not add rule.");
			        } else {
			          	cb(null, params.Item.id);
			      	}
			    });
			}

		}
	
	});
};
