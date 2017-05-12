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


describe('Testing rules::getEmployeeRule', function() {

    it('should get the employee rule by ID', function() {

        return LambdaTester( myHandler )
            .event({"id": "1"})
            .expectResult(function(result){
                expect(result.id).to.be.equal("1");
            });
    });

    it('should not let me get the rule when ID is missing', function() {

        return LambdaTester( myHandler )
            .event({"id": ""})
            .expectError(function(err){
                expect(err.message).to.equal("400 - Missing parameters.");
            });
    });

    it('should return an error when the request rule does not exist', function() {

        return LambdaTester( myHandler )
            .event({"id": "1234567"})
            .expectError(function(err){
                expect(err.message).to.equal("204 - Item not found.");
            });
    });

});
