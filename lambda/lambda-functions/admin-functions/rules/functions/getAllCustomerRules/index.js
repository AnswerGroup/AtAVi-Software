// IN
// OUT all customer rules

console.log("loading function rules_getAllCustomerRules");
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

            var params = {
                TableName: "customer_rules",
                ProjectionExpression: "id, first_name, last_name, company, employee_id"
            };

            db.scan(params, function(err, data) {
                if (err) {
                    cb("500 - Could not retrieve rules.");
                } else {
                    cb(null, data.Items);
                }
            });
        }
    });
};
