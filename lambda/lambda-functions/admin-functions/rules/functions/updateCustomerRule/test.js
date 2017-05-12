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
  TableName : "customer_rules",
  Item : { 
    "id" : "1",
    "first_name": "Giorgio",
    "last_name": "Bianchi",
    "company": "Google",
    "employee_id": "codiceregolaemployee123"
  }
};

db.put(params, function(err, data) {
  if (err) {
      console.log("500 - Could not add rule.");
    }
}); 
// +++++++++++ END MOCK DATA ++++++++++++ //


describe('Testing rules::updateCustomerRule', function() {

    it('should update the rule', function() {

        return LambdaTester( myHandler )
            .event({"id" : "1",
                    "first_name": "Mario",
                    "last_name": "Bianchi",
                    "company": "Amazon",
                    "employee_id": "codiceregolaemployee123",
                    "auth": "eyJhbGciOiJIUzI1NiJ9.MTQ5Mzg4NDYyNDkzMA.i5nbOT10TFcj_MSXgE2su6AJZy7bJJGq8OkjIG_h1qY"})
            .expectResult(function(result){
                expect(result).to.equal("Rule successfully updated.");
            });
    });


    it('should not let me update the rule when jwt is wrong', function() {

        return LambdaTester( myHandler )
            .event({"id" : "1",
                    "first_name": "Giorgio",
                    "last_name": "Bianchi",
                    "company": "Google",
                    "employee_id": "codiceregolaemployee123",
                    "auth": "wrong or empty jwt"})
            .expectError(function(err){
                expect(err.message).to.equal("401 - Not Authorized.");
            });
    });


    it('should not let me update the rule when one of the parameteres is missing or empty', function() {

        return LambdaTester( myHandler )
            .event({"id" : "1",
                    "first_name": "Giorgio",
                    "last_name": "Bianchi",
                    "company": "",
                    "employee_id": "codiceregolaemployee123",
                    "auth": "eyJhbGciOiJIUzI1NiJ9.MTQ5Mzg4NDYyNDkzMA.i5nbOT10TFcj_MSXgE2su6AJZy7bJJGq8OkjIG_h1qY"})
            .expectError(function(err){
                expect(err.message).to.equal("400 - Missing parameters.");
            });
    });

    it('should return an error when trying to update a non existent rule', function() {

        return LambdaTester( myHandler )
            .event({"id" : "1234567",
                    "first_name": "Giorgio",
                    "last_name": "Bianchi",
                    "company": "Google",
                    "employee_id": "codiceregolaemployee123",
                    "auth": "eyJhbGciOiJIUzI1NiJ9.MTQ5Mzg4NDYyNDkzMA.i5nbOT10TFcj_MSXgE2su6AJZy7bJJGq8OkjIG_h1qY"})
            .expectError(function(err){
                expect(err.message).to.equal("500 - Could not update rule or rule does not exist.");
            });
    });
});
