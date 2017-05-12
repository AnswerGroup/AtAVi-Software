// IN { id : "id"} in event
// OUT customer_rules[id] ==> id, fname, lname, company, last_employee, last_visit

console.log("loading function rules_getCustomerRule");
var AWS = require("aws-sdk");
if (!AWS.config.region) {
    process.env.SECRET = "test-encryption-key";
    AWS.config.update({
        region: "us-west-1",
        endpoint: "http://localhost:8000"
    });   
}
var db = new AWS.DynamoDB.DocumentClient();
const jwt = require("jsonwebtoken");
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
                    AttributesToGet: [
                      "id",
                      "first_name",
                      "last_name",
                      "company",
                      "employee_id"
                    ],
                    TableName : "customer_rules",
                    Key : { 
                      "id" : e.id
                    }
                };

                db.get(params, function(err, data) {
                    if (err) {
                        cb("500 - Could not get item.");
                    } else if (!data.Item) {
                        cb("204 - Item not found.");
                    } else {
                        cb(null, data.Item);
                    }
                });
            }
        }
    });   
}
