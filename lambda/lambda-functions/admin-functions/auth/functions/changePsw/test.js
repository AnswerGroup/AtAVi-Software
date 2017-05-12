const LambdaTester = require('lambda-tester');
const expect = require('chai').expect;
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
// +++++++++++++ END MOCK DATA +++++++++++++ //


describe( 'Testing auth::changePsw', function() {

	it( 'should return an error when jwt is empty or missing', function() {

		return LambdaTester( myHandler )
			.event({"old_password": "admin",
				    "new_password": "admin",
				    "repeat_password": "admin"})
			.expectError(function(err) {
				expect(err.message).to.equal("401 - Not Authorized.");
			});
	});

	it( 'should return an error when jwt is wrong', function() {

		return LambdaTester( myHandler )
			.event({"old_password": "admin",
				    "new_password": "admin",
				    "repeat_password": "admin",
				    "auth": "kkkkkkkkkkkkkk"})
			.expectError(function(err) {
				expect(err.message).to.equal("401 - Not Authorized.");
			});
	});

	it( 'should return an error when old_password || new_password || repeat_password are empty or missing', function() {

		return LambdaTester( myHandler )
			.event({"new_password": "admin",
				    "repeat_password": "admin",
				 	"auth": "eyJhbGciOiJIUzI1NiJ9.MTQ5Mzg4NDYyNDkzMA.i5nbOT10TFcj_MSXgE2su6AJZy7bJJGq8OkjIG_h1qY"})
			.expectError(function(err) {
				expect(err.message).to.equal("400 - Missing parameters.");
			});
	});

	it( 'should return an error when new_password and repeat_password are different', function() {

		return LambdaTester( myHandler )
			.event({"old_password": "admin",
				    "new_password": "admin123",
				    "repeat_password": "admin321",
				    "auth": "eyJhbGciOiJIUzI1NiJ9.MTQ5Mzg4NDYyNDkzMA.i5nbOT10TFcj_MSXgE2su6AJZy7bJJGq8OkjIG_h1qY"})
			.expectError(function(err) {
				expect(err.message).to.equal("400 - The passwords you inserted do not match.");
			});
	});

	it( 'should return an error when old_password is wrong', function() {

		return LambdaTester( myHandler )
			.event({"old_password": "not the right password",
				    "new_password": "admin123",
				    "repeat_password": "admin123",
				    "auth": "eyJhbGciOiJIUzI1NiJ9.MTQ5Mzg4NDYyNDkzMA.i5nbOT10TFcj_MSXgE2su6AJZy7bJJGq8OkjIG_h1qY"})
			.expectError(function(err) {
				expect(err.message).to.equal("400 - Invalid Password.");
			});
	});

	it( 'should return a success message when all data are correct', function() {

		return LambdaTester( myHandler )
        // admin ==> changes to admin, need this for mocha --recursive, auth::login fails if password is changed
        // if test is run locally and not recursively then the test can be done with admin ==> whatever_you_want
			.event({"old_password": "admin",
				    "new_password": "admin",
				    "repeat_password": "admin",
				    "auth": "eyJhbGciOiJIUzI1NiJ9.MTQ5Mzg4NDYyNDkzMA.i5nbOT10TFcj_MSXgE2su6AJZy7bJJGq8OkjIG_h1qY"})
			.expectResult(function(result){
				expect(result).to.equal("Password successfully updated.")
			});
	});

});
