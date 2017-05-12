app.controller('ChangePasswordController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	var token = localStorage.getItem('token');
	if(token != 'undefined' && token != null) {
		console.log(token);
		$http.defaults.headers.common['Authorization'] = token;
	} else {
		window.location.replace("http://localhost:8000/Views/AdminLoginView.html");
	}
	$scope.change = function () {
		console.log('ciao');
		var req = {
		method: 'POST',
			url: $rootScope.url + '/auth/changepsw',
			data: 
			{
			    "old_password" : document.getElementById('old').value,
			    "new_password" : document.getElementById('new').value,
			    "repeat_password" : document.getElementById('rep').value
			}
		};
		$http(req).then(function sucessCallback(response) {
			console.log(response);
			document.getElementById('success').style.display = "block";
			document.getElementById('warning').style.display = "none";
		}, function errorCallback(response) {
			document.getElementById('warning').style.display = "block";
			document.getElementById('success').style.display = "none";
		});
	}
}]);