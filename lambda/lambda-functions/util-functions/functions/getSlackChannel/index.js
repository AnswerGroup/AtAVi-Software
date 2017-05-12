
// IN {fullname = "employee's last name and first name"} in event
// OUT employee_rule[fname,lname]

console.log('loading function util_getSlackChannel');
var AWS = require("aws-sdk");
if (!AWS.config.region) {
    AWS.config.update({
        region: "us-west-1",
        endpoint: "http://localhost:8000"
    });   
}
var db = new AWS.DynamoDB.DocumentClient();

//Funzione che dato il nome e il cognome di un impiegato, ritorna i dati relativi alla regola dell'impiegato

exports.handle = function(e, ctx, cb) {
  if(!e.fullname){

      cb("Missing parameters.");
    } else {
        var fn=e.fullname;

        //Parametri di ricerca della regola relativa all'impiegato
        var params = {
            TableName: "employee_rules",
            FilterExpression: "fullname = :full",
            ExpressionAttributeValues: {
            ":full": e.fullname
            }
        };

        //Ricerca nel database della regola in base al parametro 'params'
        db.scan(params,function(err,data){
            if (data.Items[0]===undefined){
                cb(null, null);
            }else{
                var result = data.Items[0];
                cb(null,result);
            }
        });
    }
}
