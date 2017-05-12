
//IN {id:"id"} in event
//OUT employee_rules

console.log('loading function util_getSlackChannelById')
var AWS = require('aws-sdk');
if (!AWS.config.region) {
    AWS.config.update({
        region: "us-west-1",
        endpoint: "http://localhost:8000"
    });   
}
var db = new AWS.DynamoDB.DocumentClient();

//Funzione che dato l'id di una regola di un impiegato, ritorna i dati relativi alla regola

exports.handle = function(e, ctx, cb) {
  if(!e.id){
      cb("Missing parameters.");
    } else{
    //Parametri di ricerca della regola relativa all'impiegato
    var params = {
        AttributesToGet: [
            "fullname",
            "slack"
        ],
        TableName: "employee_rules",
        Key:{
        
            "id": e.id
        }
    };
    //Ricerca nel database della regola in base al parametro 'params'
    db.get(params,function(err,data){
       if(data.Item === undefined){
          cb ("Item not found.")
       } else {
          cb(null, data.Item);
       }
    });
    }
}
