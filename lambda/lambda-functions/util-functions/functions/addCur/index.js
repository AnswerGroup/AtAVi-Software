
var AWS = require('aws-sdk');
var db = new AWS.DynamoDB.DocumentClient();

exports.handle = function(e, ctx, cb) {
var lineReader = require('readline').createInterface({
	input: require('fs').createReadStream('curiosities.txt')
});
var i=1;
	var line;
	lineReader.on('line', function (line) {
	if(i<400){
	console.log('Line from file:', line);
	console.log(i);
	var params = {
		TableName : "curiosities",
		Item : {
			"id" : i.toString(),
			"text": line
		}
	};

		db.put(params, function(err, data) {
			if (err) {
				console.log(err);
				cb("500 - Could not add customer!");
			} else {
				cb(null, params.Item.id);
			}
		});
	i=i+1;
	}
});
}



