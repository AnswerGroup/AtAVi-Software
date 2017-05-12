const LambdaTester = require('lambda-tester');
const expect = require('chai').expect
const myHandler = require('./index').handle;

// +++++++++++++ BEGIN MOCK DATA +++++++++++++ //
var AWS = require("aws-sdk");
AWS.config.update({
  region: "us-west-1",
  endpoint: "http://localhost:8000"
});
var db = new AWS.DynamoDB.DocumentClient();
var params = {
    TableName : "auth",
    Item : { 
        "id" : "admin",
        "password": "ed70e93a37b0be9b2b99a51fdb5bb193740f145b980c2e7b8e0c04300581b163",
        "salt": "17e79c4a12a12f7a3570"
    }
};
db.put(params, function(err, data) {
    if (err) {
        console.log(err)
    }
});


describe( 'Testing auth::login', function() {

    it( 'should return a jwt token when password is correct', function() {

        return LambdaTester( myHandler )
            .event({"password": "admin"})
            .expectResult();
    });

    it( 'should return an error when password is wrong', function() {

        return LambdaTester( myHandler )
            .event({"password": "not the right password"})
            .expectError(function(err){
                expect(err.message).to.equal("400 - Invalid Password.")
            });
    });

    it( 'should return an error when password is empty', function() {
        
        return LambdaTester( myHandler )
            .event({"password": ""})
            .expectError(function(err){
                expect(err.message).to.equal("400 - Missing parameters");
            });
    });
});


