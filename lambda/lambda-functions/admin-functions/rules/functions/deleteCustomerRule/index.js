// IN {id : "id"} in event
// OUT success/error message

console.log("loading function rules_deleteCustomerRule");
var AWS = require("aws-sdk");
if (!AWS.config.region) {
    process.env.SECRET = "test-encryption-key";
    AWS.config.update({
        region: "us-west-1",
        endpoint: "http://localhost:8000"
    });   
}
var db = new AWS.DynamoDB.DocumentClient();
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

exports.handle = function(e, ctx, cb) {

    jwt.verify(e.auth, secret, function(err, decoded){
        if(!decoded) {
            cb("401 - Not Authorized.");
        } else {

            if (!e.id) {
                cb("400 - Missing parameters.");
            } else {

                var params = {
                    TableName : "customer_rules",
                    Key : { 
                      "id" : e.id
                    },
                    ReturnValues : "ALL_OLD"
                };

                db.delete(params, function(err, data) {
                    if (err) {
                        cb("500 - Could not delete rule.");
                    } else {
                        if (JSON.stringify(data) === "{}") {
                            cb("204 - Rule not found.")
                        } else if (data.Attributes.id === e.id) {
                            cb(null, "Rule successfully deleted.");
                        }
                        
                    }
                });
            }

        }
    });
};
