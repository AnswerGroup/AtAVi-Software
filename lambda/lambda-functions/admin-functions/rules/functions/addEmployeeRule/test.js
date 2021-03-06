const LambdaTester = require('lambda-tester');
const expect = require ('chai').expect;
const myHandler = require('./index').handle;

describe('Testing rules::addEmployeeRule', function() {

	it('should return the uuid of the added rule', function() {

		return LambdaTester( myHandler )
			.event({"fullname": "Mario Rossi",
				    "slack": "@canalepersonale",
				    "auth": "eyJhbGciOiJIUzI1NiJ9.MTQ5Mzg4NDYyNDkzMA.i5nbOT10TFcj_MSXgE2su6AJZy7bJJGq8OkjIG_h1qY"})
			.expectResult(function(result){
				expect(result).to.have.lengthOf(36);
			});
	});


	it('should not let me add the rule when jwt is wrong', function() {

		return LambdaTester( myHandler )
			.event({"fullname": "Mario Rossi",
				    "slack": "@canalepersonale",
				    "auth": "not the rigth jwt, it might also be empty"})
			.expectError(function(err){
				expect(err.message).to.equal("401 - Not Authorized.");
			});
	});


	it('should not let me add the rule when one of the parameteres is missing or empty', function() {

		return LambdaTester( myHandler )
			.event({"fullname": "Mario Rossi",
				    "slack": "",
				    "auth": "eyJhbGciOiJIUzI1NiJ9.MTQ5Mzg4NDYyNDkzMA.i5nbOT10TFcj_MSXgE2su6AJZy7bJJGq8OkjIG_h1qY"})
			.expectError(function(err){
				expect(err.message).to.equal("400 - Missing parameters.");
			});
	});
});
