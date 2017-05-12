const LambdaTester = require('lambda-tester');
const expect = require ('chai').expect;
const myHandler = require('./index').handle;

// +++++++++++ BEGIN MOCK DATA ++++++++++++ //
var AWS = require("aws-sdk");
if (!AWS.config.region) { // region is not set if teting on local machine
    AWS.config.update({
        region: "us-west-1",
        endpoint: "http://localhost:8000"
    });   
}
var db = new AWS.DynamoDB.DocumentClient();
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
// +++++++++++ END MOCK DATA ++++++++++++ //


describe('Testing util::addCustomer', function() {

    it('should add the customer', function() {

        return LambdaTester( myHandler )
            .event({"fname": "Giorgio",
                    "lname": "Bianchi"})
            .expectResult(function(result){
                expect(result).to.have.length(36);
            });
    });


    it('should not let me add the customer when a param is missing', function() {

        return LambdaTester( myHandler )
            .event({"first_name": "Giorgio",
                    "last_name": "",
                    "company": "Google",
                    "last_employee": "061889c7-e8c4-400c-9959-54a328f46fb0",
                    "last_visit": "1492184184776"})
            .expectError(function(err){
                expect(err.message).to.equal("Missing parameters.");
            });
    });

});
