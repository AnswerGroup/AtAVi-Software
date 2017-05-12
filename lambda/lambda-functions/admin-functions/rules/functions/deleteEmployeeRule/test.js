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
        "id" : "id_rule_to_delete",
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


describe('Testing rules::deleteEmployeeRule', function() {

    it('should delete the rule', function() {

        return LambdaTester( myHandler )
            .event({"id": "id_rule_to_delete",
                    "auth": "eyJhbGciOiJIUzI1NiJ9.MTQ5Mzg4NDYyNDkzMA.i5nbOT10TFcj_MSXgE2su6AJZy7bJJGq8OkjIG_h1qY"})
            .expectResult(function(result){
                expect(result).to.equal("Rule successfully deleted.");
            });
    });


    it('should not let me delete the rule when jwt is wrong', function() {

        return LambdaTester( myHandler )
            .event({"id": "id_rule_to_delete",
                    "auth": "wrong or empty jwt"})
            .expectError(function(err){
                expect(err.message).to.equal("401 - Not Authorized.");
            });
    });


    it('should not let me delete the rule when one of the parameteres is missing or empty', function() {

        return LambdaTester( myHandler )
            .event({"id": "",
                    "auth": "eyJhbGciOiJIUzI1NiJ9.MTQ5Mzg4NDYyNDkzMA.i5nbOT10TFcj_MSXgE2su6AJZy7bJJGq8OkjIG_h1qY"})
            .expectError(function(err){
                expect(err.message).to.equal("400 - Missing parameters.");
            });
    });

    it('should return an error when trying to delete a non existent rule', function() {

        return LambdaTester( myHandler )
            .event({"id": "1234",
                    "auth": "eyJhbGciOiJIUzI1NiJ9.MTQ5Mzg4NDYyNDkzMA.i5nbOT10TFcj_MSXgE2su6AJZy7bJJGq8OkjIG_h1qY"})
            .expectError(function(err){
                expect(err.message).to.equal("204 - Rule not found.");
            });
    });
});
