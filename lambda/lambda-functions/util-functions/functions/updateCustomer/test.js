 
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
    "last_employee": "codiceregolaemployee123",
    "last_visit": "1492184184776"
  }
};

db.put(params, function(err, data) {
  if (err) {
      console.log("500 - Could not add rule.");
    }
}); 
// +++++++++++ END MOCK DATA ++++++++++++ //


describe('Testing util::updateCustomer', function() {

    it('should update the customer', function() {

        return LambdaTester( myHandler )
            .event({"id": "1",
                    "last_employee": "new_last_employee"})
            .expectResult();
    });


    it('should not let me update the customer when a param is missing', function() {

        return LambdaTester( myHandler )
            .event({"id": "1",
                    "last_employee": ""})
            .expectError(function(err){
                expect(err.message).to.equal("Missing parameters.");
            });
    });


    it('should not let me update a non existing customer', function() {

        return LambdaTester( myHandler )
            .event({"id": "not a real customer",
                    "last_employee": "new_last_employee"})
            .expectError(function(err){
                expect(err.message).to.equal("Could not update rule.");
            });
    });

});
