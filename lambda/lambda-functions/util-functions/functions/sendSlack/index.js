console.log('Loading event');

//Modificare la variabile snsUrl con l'URL di Incoming Webhooks fornito da Slack
const slackUrl = '[YOUR_SLACK_WEBHOOK]';

// IN { text : "slack message text", channel: "channel destination"} in event
// OUT sends slack message
var aws = require('aws-sdk');
var request = require('request');

//Funzione che invia al canale slack indicato, il messaggio passato come parametro del messaggio SNS
exports.handle = function(e, ctx) {
  console.log('addSNSUser start');
  console.log(e);
  console.log(e.Records[0].Sns);
  var SnsMessage = e.Records[0].Sns.Message;
  var SnsData = JSON.parse(SnsMessage);
  console.log(SnsData);
 
  var options = {
    url: slackUrl,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:'{"username":"AtAVi", "text": "'+SnsData.text+'", "channel":"'+SnsData.channel+'"}'
  };
 
  function callback(err, res, data) {
    if (!err && res.statusCode == 200) {
    console.log('messaggio inviato');
    }
    else{
      console.log('errore');
      console.log(res.statusCode);
      console.log(err);
    }
  }
  request(options, callback);
};
