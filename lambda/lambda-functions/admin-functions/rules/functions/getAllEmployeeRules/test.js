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


describe('Testing rules::getAllEmployeeRules', function() {

    it('should get all the rules', function() {

        return LambdaTester( myHandler )
            .event({"auth": "eyJhbGciOiJIUzI1NiJ9.MTQ5Mzg4NDYyNDkzMA.i5nbOT10TFcj_MSXgE2su6AJZy7bJJGq8OkjIG_h1qY"})
            .expectResult(function(result){
                expect(result).to.be.instanceof(Array);
            });
    });


    it('should not let me get the rules when jwt is wrong', function() {

        return LambdaTester( myHandler )
            .event({"auth": "wrong or empty jwt"})
            .expectError(function(err){
                expect(err.message).to.equal("401 - Not Authorized.");
            });
    });

});
