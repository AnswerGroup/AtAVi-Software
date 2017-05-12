 
 
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
    "id" : "88888",
    "first_name": "Giulio",
    "last_name": "Verdi",
    "company": "Amazon",
    "last_employee": "codiceregolaemployee123",
    "last_visit": "1492184184776"
  }
};

db.put(params, function(err, data) {
  if (err) {
      console.log("Could not add rule.");
    }
}); 
// +++++++++++ END MOCK DATA ++++++++++++ //


describe('Testing util::getCustomer', function() {

    it('should get the customer', function() {

        return LambdaTester( myHandler )
            .event({"first_name": "Giulio",
                    "last_name": "Verdi",
                    "company": "Amazon"})
            .expectResult(function(result){
                expect(result.id).to.equal("88888");
                expect(result.first_name).to.equal("Giulio");
            });
    });


    it('should not let me get the customer when a param is missing', function() {

        return LambdaTester( myHandler )
            .event({"first_name": "Giulio",
                    "last_name": "",
                    "company": "Amazon"})
            .expectError(function(err){
                expect(err.message).to.equal("Missing parameters.");
            });
    });

});
