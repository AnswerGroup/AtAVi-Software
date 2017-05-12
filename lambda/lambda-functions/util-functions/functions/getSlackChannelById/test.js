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
        "fullname": "Mario Bianchi",
        "slack": "@random"
    }
};
db.put(params, function(err, data) {
    if (err) {
        console.log(err);
    }
});
// +++++++++++ END MOCK DATA ++++++++++++ //


describe('Testing util::getSlackChannelById', function() {

    it('should get the slack channel', function() {

        return LambdaTester( myHandler )
            .event({"id": "1"})
            .expectResult(function(result){
                expect(result.slack).to.equal("@random");
            });
    });


    it('should not let me get the slack channel when a param is missing', function() {

        return LambdaTester( myHandler )
            .event({"id": ""})
            .expectError(function(err){
                expect(err.message).to.equal("Missing parameters.");
            });
    });


    it('should get an error when looking for a non existing employee', function() {

        return LambdaTester( myHandler )
            .event({"id": "skdljjfaskjdfjkasfjdk"})
            .expectError(function(err){
                expect(err.message).to.equal("Item not found.")
            });
    });

});
