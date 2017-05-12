//interactionModule contiene tutti i metodi richiamabili tramite il server che riguardano l'interazione con alexa

const http2 = require("http2");
const config = require("./config");
const fs = require('fs');

var synchronizeState = function(_token){
	
  var message={
      "context": [{
          "header" : {
              "namespace" : "Alerts",
              "name" : "AlertsState"
          },
          "payload" : {
              "allAlerts" : [],
              "activeAlerts" : []
          }
      }, {
          "header" : {
              "namespace" : "AudioPlayer",
              "name" : "PlaybackState"
          },
          "payload" : {
              "token" : "",
              "offsetInMilliseconds" : 0,
              "playerActivity" : "IDLE"
          }
      }, {
          "header" : {
              "namespace" : "Speaker",
              "name" : "VolumeState"
          },
          "payload" : {
              "volume" : 50,
              "muted" : false
          }
      }, {
          "header" : {
              "namespace" : "SpeechSynthesizer",
              "name" : "SpeechState"
          },
          "payload" : {
              "token" : "",
              "offsetInMilliseconds" : 0,
              "playerActivity" : "FINISHED"
          }
      }],
      "event": {
          "header": {
              "namespace": "System",
              "name": "SynchronizeState",
              "messageId": "1111"
          },
          "payload": {
          }
      }
  }

  console.log("1")

  var options = {
    host: config.AVS.HOST,
    path: config.AVS.EVENTS_PATH,
    method: "POST",
    headers:{
      "authorization": "Bearer " + _token,
    	"Content-Type": "multipart/form-data; boundary=LIMIT123"
    }
  }

  var req = http2.request(options, (res) => {
    console.log(res.statusCode);
  });

  console.log("2")
  req.write(config.AVS.CONTEXT_HEADER);
  req.write(JSON.stringify(message));
  req.write(config.AVS.MULTIPART_END_CONTEXT);

  req.end();
};

console.log("3 esatblished down channel")
var establishDownChannel = function(_token){
  var options = {
    host: config.AVS.HOST,
    path: config.AVS.DIRECTIVES_PATH,
    method: 'GET',
    headers:{
      "authorization": "Bearer " + _token
    }
  }
  var req = http2.request(options, (res) =>{
    console.log(res.statusCode);
  });
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var sendAudio = function(_token){
  
  var message={
      "context": [
      {
          "header" : {
              "namespace" : "Alerts",
              "name" : "AlertsState"
          },
          "payload" : {
              "allAlerts" : [],
              "activeAlerts" : []
          }
      }, {
          "header" : {
              "namespace" : "AudioPlayer",
              "name" : "PlaybackState"
          },
          "payload" : {
              "token" : "",
              "offsetInMilliseconds" : 0,
              "playerActivity" : "IDLE"
          }
      }, {
          "header" : {
              "namespace" : "Speaker",
              "name" : "VolumeState"
          },
          "payload" : {
              "volume" : 50,
              "muted" : false
          }
      }, {
          "header" : {
              "namespace" : "SpeechSynthesizer",
              "name" : "SpeechState"
          },
          "payload" : {
              "token" : "",
              "offsetInMilliseconds" : 0,
              "playerActivity" : "FINISHED"
          }
      }],
      "event": {
          "header": {
            "namespace": "SpeechRecognizer",
            "name": "Recognize",
            "messageId": "111",
            "dialogRequestId": "11111"
          },
          "payload": {
            "profile": "CLOSE_TALK",
            "format": "AUDIO_L16_RATE_16000_CHANNELS_1"
          }
      }
  }

  console.log("4 finito di caricare message")
  var options = {
    host: "localhost", //config.AVS.HOST,
    port: "8080",
    path: "/res", //config.AVS.EVENTS_PATH,
    schema: "https",
    headers:{
      "authorization": "Bearer " + _token,
      "Content-Type": "multipart/form-data; boundary=LIMIT123"
    }
  }

  var audioRecording = fs.readFileSync('./file.raw', 'binary');
  //console.log(audioRecording)
  console.log("5 caricato audio")

  const postMessage = [config.AVS.CONTEXT_HEADER, JSON.stringify(message, null, 2), config.AVS.AUDIO_HEADER, audioRecording, config.AVS.MULTIPART_END_AUDIO].join('');
    
  console.log([config.AVS.CONTEXT_HEADER, JSON.stringify(message, null, 2), config.AVS.AUDIO_HEADER, config.AVS.MULTIPART_END_AUDIO].join(''));

  var req = http2.request(options, (res) => {

    var str = "";
    res.on('data', (chunk) => {
      str += chunk;
      //console.log(chunk)
    });

    res.on('end', function () {
      //console.log(req.data);
      console.log(str);
      console.log(res.headers);
      console.log(res.statusCode);
      //console.log(res);
    });


  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  //req.write(config.AVS.CONTEXT_HEADER);
  //req.write(JSON.stringify(message, null, 2));
  //req.write(config.AVS.AUDIO_HEADER);
  //req.write(audioRecording);
  //req.write(config.AVS.MULTIPART_END_AUDIO);
  req.write(postMessage);
  //console.log(req);
  req.end();
  
};

exports.establishDownChannel = establishDownChannel;
exports.synchronizeState = synchronizeState;
exports.sendAudio = sendAudio;

