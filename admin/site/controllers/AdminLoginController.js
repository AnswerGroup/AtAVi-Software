app.controller('AdminLoginController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	console.log($rootScope.url);
	if(localStorage.getItem('token') != 'undefined' && localStorage.getItem('token') != null) {
		window.location.replace("/rules");
	}
	$scope.login = function () {
		var password = document.getElementById('psw').value;
		var req = {
		method: 'POST',
			url: $rootScope.url + '/auth',

			data: 
			{
				"password" : password
			}
	};
	$http(req).then(function sucessCallback(response) {
		localStorage.setItem('token', response.data.token);
		if(localStorage.getItem('token') != 'undefined' && localStorage.getItem('token') != null) {
			window.location.replace("/rules");
		}
	},
	function errorCallback(response) {
		console.log(response);
		document.getElementById('warning').style.display = "block";
	});	
	}
}]);