
// IN {password: "admin_password"} in event
// OUT {token: "admin_token"} if successful, else error

console.log("loading function auth_login");

var crypto = require("crypto");
const jwt = require('jsonwebtoken');
var AWS = require("aws-sdk");

if (!AWS.config.region) {
    process.env.SECRET = "test-encryption-key";
    AWS.config.update({
        region: "us-west-1",
        endpoint: "http://localhost:8000"
    });   
}

var db = new AWS.DynamoDB.DocumentClient();
const secret = process.env.SECRET;

exports.handle = function(e, ctx, cb) {

    // controllo e.password non sia undefined
    if (!e.password) {
        cb("400 - Missing parameters");
    } else {

        // preparo i dati per la query: tabella = auth, voglio i campi "password" e "salt" della riga con id = "admin"
        var params = {
            AttributesToGet: [
                "password",
                "salt"
            ], 
            TableName : "auth",
            Key : { 
                "id" : "admin"
            }
        };
        
        var jwtAuth = jwt.sign(Date.now(), secret);
        //cb(null, { token : jwtAuth});

        // eseguo la query, se va buon fine data contiene "password" e "salt" della riga in cui id = "admin"
        // se hash256(e.password+db_salt) == db_password la password è corretta ==> ritorno {token: "token"}
        // altrimenti ritorno "Invalid Password!"
        db.get(params, function(err, data) {
            if (err) {
                cb("500 - Could not perform action.");
            } else {
                var db_password = data.Item.password;
                var db_salt = data.Item.salt;
                var passwordToHash = e.password.concat(db_salt);
                var passwordToCheck = crypto.createHash("sha256").update(passwordToHash).digest("hex");
                if (passwordToCheck === db_password) {
                  cb(null, { token : jwtAuth});
                }
                else {  //wrong password
                  cb("400 - Invalid Password.");
                }
            }
        });

    }

};
