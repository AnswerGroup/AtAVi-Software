console.log('loading function util_selectCuriosity');
var AWS = require('aws-sdk');
if (!AWS.config.region) {
    AWS.config.update({
        region: "us-west-1",
        endpoint: "http://localhost:8000"
    });
}
var db = new AWS.DynamoDB.DocumentClient();
exports.handle = function(e, ctx, cb) {
/*var random = require("random-js"); // uses the nativeMath engine
var value = random.integer(1, 10);*/
var value=Math.random() * (113 - 1) + 1;
console.log(Math.floor(value));
value = Math.floor(value);
var params = {
  AttributesToGet: [
    "text"
    ],
    TableName: "curiosities",
        Key:{

            "id": value.toString()
        }
    };
    db.get(params,function(err,data){

       if(err){
           cb("Item not found!");
       } else {
           console.log(data);
           cb(null , data.Item.text);
       }
    });
}
