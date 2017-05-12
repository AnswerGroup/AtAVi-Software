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
    TableName : "employee_rules",
    Item : { 
        "id" : "1",
        "fullname": "Mario Rossi",
        "slack": "@random"
    }
};
db.put(params, function(err, data) {
    if (err) {
        console.log(err);
    }
});
// +++++++++++ END MOCK DATA ++++++++++++ //


describe('Testing rules::updateEmployeeRule', function() {

    it('should update the rule', function() {

        return LambdaTester( myHandler )
            .event({"id" : "1",
                    "fullname": "Giorgio Bianchi",
                    "slack": "#general",
                    "auth": "eyJhbGciOiJIUzI1NiJ9.MTQ5Mzg4NDYyNDkzMA.i5nbOT10TFcj_MSXgE2su6AJZy7bJJGq8OkjIG_h1qY"})
            .expectResult(function(result){
                expect(result).to.equal("Rule successfully updated.");
            });
    });


    it('should not let me update the rule when jwt is wrong', function() {

        return LambdaTester( myHandler )
            .event({"id" : "1",
                    "fullname": "Mario Rossi",
                    "slack": "@random",
                    "auth": "wrong or empty jwt"})
            .expectError(function(err){
                expect(err.message).to.equal("401 - Not Authorized.");
            });
    });


    it('should not let me update the rule when one of the parameteres is missing or empty', function() {

        return LambdaTester( myHandler )
            .event({"id" : "1",
                    "fullname": "Mario Rossi",
                    "slack": "",
                    "auth": "eyJhbGciOiJIUzI1NiJ9.MTQ5Mzg4NDYyNDkzMA.i5nbOT10TFcj_MSXgE2su6AJZy7bJJGq8OkjIG_h1qY"})
            .expectError(function(err){
                expect(err.message).to.equal("400 - Missing parameters.");
            });
    });

    it('should return an error when trying to update a non existent rule', function() {

        return LambdaTester( myHandler )
            .event({"id" : "1234567",
                    "fullname": "Mario Rossi",
                    "slack": "@random",
                    "auth": "eyJhbGciOiJIUzI1NiJ9.MTQ5Mzg4NDYyNDkzMA.i5nbOT10TFcj_MSXgE2su6AJZy7bJJGq8OkjIG_h1qY"})
            .expectError(function(err){
                expect(err.message).to.equal("500 - Could not update rule or rule does not exist.");
            });
    });
});
