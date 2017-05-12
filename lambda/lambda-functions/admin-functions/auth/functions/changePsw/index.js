
// IN { old_password: "old_password", new_password: "new_password", repeat_password: "repeat_password"} in event
// OUT

console.log("loading function auth_change_psw");

var crypto = require('crypto');
var AWS = require("aws-sdk");
if (!AWS.config.region) {
    process.env.SECRET = "test-encryption-key";
    AWS.config.update({
        region: "us-west-1",
        endpoint: "http://localhost:8000"
    });   
}
var db = new AWS.DynamoDB.DocumentClient();
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

exports.handle = function(e, ctx, cb) {
    jwt.verify(e.auth, secret, function(err, decoded){
        if(!decoded) {
            cb("401 - Not Authorized.");
        }
        else {
            if (!e.old_password || !e.new_password || !e.repeat_password) {
              cb("400 - Missing parameters.");
            } else {

                // preparo i dati per la query: tabella = auth, voglio i campi "password" e "salt" della riga con id = "admin"
                var params = {
                    AttributesToGet: [
                        "password",
                        "salt"
                    ],
                    TableName : 'auth',
                    Key : { 
                        "id" : "admin"
                    }
                };

                // eseguo la query, se va buon fine data contiene "password" e "salt" della riga in cui id = "admin"
                // se hash256(e.old_password+db_salt) == db_password la password è corretta
                db.get(params, function(err, data) {
                    if (err) {
                        cb("500 - Could not perform action.");
                    } else {
                        var db_password = data.Item.password;
                        var db_salt = data.Item.salt;
                        var passwordToHash = e.old_password.concat(db_salt);
                        var passwordToCheck = crypto.createHash('sha256').update(passwordToHash).digest("hex");
                        if (passwordToCheck === db_password) {
                            if (e.new_password != e.repeat_password){
                                cb("400 - The passwords you inserted do not match.");
                            } else {
                            
                                var salt = crypto.randomBytes(10).toString("hex");
                                var newPasswordToHash = e.new_password.concat(salt);
                                var newHashedPassword = crypto.createHash('sha256').update(newPasswordToHash).digest("hex");
                                var paramsToUpdate = {
                                    TableName : 'auth',
                                    Key : { 
                                        "id" : "admin"
                                    },
                                    UpdateExpression: "set password = :nhp, salt = :s",
                                    ExpressionAttributeValues:{
                                        ":nhp":newHashedPassword,
                                        ":s":salt
                                    },
                                    ReturnValues:"NONE"
                                };

                                db.update(paramsToUpdate, function(err, data){
                                    if (err) {
                                        cb("500 - Could not update password.");
                                    } else {
                                        cb(null, "Password successfully updated.");
                                    }
                                });
                            }

                        } else {
                          cb("400 - Invalid Password.");
                        }
            
                    }
                });
            }
            
        }
    });
    
};
