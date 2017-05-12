app.controller('AudioController', ['$scope', function($scope){
	var recording = false;
	 $scope.changeStatus = function() {
        if(!recording) {
        	recording = true;
        	startRecord();
        }
        else {
        	recording = false;
        	stopRecord();
        }
    };
    function startRecord() {
    	startRecording(this);
    }
   	function stopRecord() {
   		stopRecording(this);
   	}
	var audio_context;
	var recorder;
	function startUserMedia(stream) {
		var input = audio_context.createMediaStreamSource(stream);
		recorder = new Recorder(input);
	}
	function startRecording(button) {
		recorder && recorder.record();
	}
	function stopRecording(button) {
		recorder && recorder.stop();
		sendServer();
		recorder.clear();
	}
	function sendServer() {
		//audio not working
	}
	window.onload = function init() {
	try {
	  window.AudioContext = window.AudioContext || window.webkitAudioContext;
	  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
	  window.URL = window.URL || window.webkitURL;
	  
	  audio_context = new AudioContext;
	} catch (e) {
	  alert('No web audio support in this browser!');
	}

	navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
	});
	}


}]);