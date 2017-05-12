// IN id, fullname, fname, lname, company, last_employee, last_visit
// OUT success/error message

console.log("loading function rules_updateCustomerRule");
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
            if (!e.first_name || !e.last_name || !e.company || !e.employee_id || !e.id) {
                cb("400 - Missing parameters.");
            } else {

                var paramsToUpdate = {

                    TableName : "customer_rules",
                    Key : { 
                        "id" : e.id
                    },
                    UpdateExpression: "set first_name = :fn, last_name = :ln, company = :com, employee_id= :eid",
                    ExpressionAttributeValues:{
                        ":fn":e.first_name,
                        ":ln":e.last_name,
                        ":com":e.company,
                        ":eid":e.employee_id,
                        ":uid":e.id
                    },
                    ReturnValues:"NONE",
                    ConditionExpression: "id = :uid"
                };

                db.update(paramsToUpdate, function(err, data){
                    if (err) {
                        cb("500 - Could not update rule or rule does not exist.");
                    } else {
                        cb(null, "Rule successfully updated.");
                    }
                });
            }
        }
    });
};



