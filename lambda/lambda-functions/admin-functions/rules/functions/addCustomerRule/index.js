// IN fullname, slack in event
// OUT success/error message

console.log("loading function rules_addCustomerRule");
var AWS = require("aws-sdk");
if (!AWS.config.region) {
  process.env.SECRET = "test-encryption-key";
  AWS.config.update({
      region: "us-west-1",
      endpoint: "http://localhost:8000"
  });   
}
var db = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid/v4");
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

exports.handle = function(e, ctx, cb) {
    
    jwt.verify(e.auth, secret, function(err, decoded){  
      if(!decoded) {
          cb("401 - Not Authorized.");
      } else {
        if (!e.first_name || !e.last_name || !e.company || !e.employee_id) {
            cb("400 - Missing parameters.");
        } else {
          var params = {
              TableName : "customer_rules",
              Item : { 
                "id" : uuid(),
                "first_name": e.first_name,
                "last_name": e.last_name,
                "company":e.company,
                "employee_id":e.employee_id
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
