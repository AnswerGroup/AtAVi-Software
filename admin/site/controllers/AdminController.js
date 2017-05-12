app.controller('AdminController', ['$rootScope','$scope', '$http', function ($rootScope, $scope, $http) {
	//TABELLA SLACK
	var token = localStorage.getItem('token');
	if(token != 'undefined' && token != null) {
		$http.defaults.headers.common['Authorization'] = token;
	} else {
		//window.location.replace("/login");
	};
	var req = {
		method: 'GET',
		url: $rootScope.url + '/rules/employee'		
	};
	$http(req).then(function successCallback(response) {
		$scope.slack = response.data;
		$scope.pulsantiS = new Array($scope.slack.length);
		for(var i=0; i<$scope.slack.length; i++) {
			$scope.pulsantiS[i] = false;
		}
		//callback
		var req = {
			method: 'GET',
			url: $rootScope.url + '/rules/customer'
		};
	
		$http(req).then(function successCallback(response) {
			$scope.employee = response.data;
			for(var i=0; i<$scope.employee.length; i++) {
				for (var j = 0; j < $scope.slack.length; j++) {
					if($scope.slack[j].id == $scope.employee[i].employee_id)
						$scope.employee[i].rule = $scope.slack[j].fullname + " --> " + 
				$scope.slack[j].slack;
				}
			}

			$scope.pulsantiE = new Array($scope.employee.length);
			for(var i=0; i<$scope.employee.length; i++) {
				$scope.pulsantiE[i] = false;
			}
			document.getElementById('globalSpinner').style.display = "none";
			document.getElementById('tables').style.display = "inline";
		
		}, function errorCallback(response) {
			console.log(response);
		});
	}, function errorCallback(response) {
		console.log(response);
	});

	

    $scope.modifing = false;
	$scope.newFname = '';
	$scope.newLname = '';
	$scope.newCompany = '';
	
	$scope.newEmployee = function() {
		if($scope.newCompany) {
			document.getElementById("plusEmpl").style.display = "none";
			document.getElementById("spinnerEmpl").style.display = "inline";
			var sel = document.getElementById("sel2");
			var ruleId = sel.options[sel.selectedIndex].id;
			var req = {
				method: 'POST',
				url: $rootScope.url + '/rules/customer',

				data: {
					"first_name" : $scope.newFname || "null", 
					"last_name" : $scope.newLname || "null",
					"company" : $scope.newCompany,
					"employee_id" : ruleId
				}
			}

			$http(req).then(function successCallback(response) {
				for (var j = 0; j < $scope.slack.length; j++) {
					if($scope.slack[j].id == req.data.employee_id)
						var rule = $scope.slack[j].fullname + " --> " + 
						$scope.slack[j].slack;
				}
				var temp = { "id" : response.data, "first_name" : req.data.first_name, "last_name" : req.data.last_name,
				"company" : req.data.company, "rule" : rule};
				$scope.employee.push(temp);
				document.getElementById("plusEmpl").style.display = "inline";
				document.getElementById("spinnerEmpl").style.display = "none";
			
			}, function errorCallback(response) {
		    	console.log(response);
	        });
	        $scope.rule = '';
			$scope.newFname = '';
			$scope.newLname = '';
			$scope.newCompany = '';
		};
	};


	$scope.newEmplS = '';
	$scope.newChannel = '';
	$scope.newSlack = function() {
		//prendi i dati da ng-model e chiama l'API
		if($scope.newEmplS && $scope.newChannel) {
			document.getElementById("plusSlack").style.display = "none";
			document.getElementById("spinnerSlack").style.display = "inline";
			var req = {
				method: 'POST',
				url: $rootScope.url + '/rules/employee',

				data: { 
					'fullname': $scope.newEmplS,
					'slack': $scope.newChannel
				}
			}

			$http(req).then(function successCallback(response) {
				var temp = { "id" : response.data, "fullname" : req.data.fullname, "slack" : req.data.slack };
				$scope.slack.push(temp);
				document.getElementById("plusSlack").style.display = "inline";
				document.getElementById("spinnerSlack").style.display = "none";
			
			}, function errorCallback(response) {
		    	console.log(response);
	        });
	        $scope.newEmplS = '';
			$scope.newChannel = '';
		}
	};


	$scope.removeSlack = function(index) {
		var req = {
			method: 'DELETE',
			url: $rootScope.url + '/rules/employee/' +
			$scope.slack[index].id
		}
		deleteSlack(index,req);
	};

	$scope.modifyS = function (index) {
		$scope.pulsantiS[index] = true;
	};

	$scope.saveS = function (index) {
		$scope.pulsantiS[index] = false;
		var empl = document.getElementById("name" + $scope.slack[index].id).value;
		var slack = document.getElementById("slack" + $scope.slack[index].id).value;
		var req = {
			method: 'PUT',
			url: $rootScope.url + '/rules/employee/' +
			$scope.slack[index].id,
			data: { 
				'fullname': empl,
				'slack': slack
			}
		};
		$http(req).then(function successCallback(response) {
				$scope.slack[index].fullname = empl;
				$scope.slack[index].slack = slack;
		}, function errorCallback(response) {
		    	console.log(response);
	    });
	};

	$scope.showSaveEmpl = function (index) {
		return $scope.pulsantiE[index];
	};
	
	$scope.removeEmployee = function (index) {
		var req = {
			method: 'DELETE',
			url: $rootScope.url + '/rules/customer/' +
			$scope.employee[index].id
		}
		deleteEmpl(index,req);
		
	}
	$scope.modifyE = function (index) {
		$scope.pulsantiE[index] = true;
	};

	$scope.saveE = function (index) {
		$scope.pulsantiE[index] = false;
		$scope.pulsantiE[index] = false;
		var fname = document.getElementById("fname" + $scope.employee[index].id).value;
		var lname = document.getElementById("lname" + $scope.employee[index].id).value;
		var comp = document.getElementById("company" + $scope.employee[index].id).value;
		var sel = document.getElementById("sel1");
		var rule = sel.options[sel.selectedIndex].text;
		var ruleId = sel.options[sel.selectedIndex].id;
		var req = {
			method: 'PUT',
			url: $rootScope.url + '/rules/customer/' +
			$scope.employee[index].id,
			data: 
			{ 
				'first_name': fname || "null",
				'last_name': lname || "null",
				'company' : comp,
				'employee_id' : ruleId
			}
		};

		$http(req).then(function successCallback(response) {
			$scope.employee[index].first_name = req.data.first_name;
			$scope.employee[index].last_name = req.data.last_name;
			$scope.employee[index].company = req.data.company;
			$scope.employee[index].employee_id = req.data.employee_id;
			for (var j = 0; j < $scope.slack.length; j++) {
				if($scope.slack[j].id == $scope.employee[index].employee_id)
					$scope.employee[index].rule = $scope.slack[j].fullname + " --> " + 
					$scope.slack[j].slack;
			}
		}, function errorCallback(response) {
	    	console.log(response);
	    });
	};
	
	$scope.showSaveSlack = function (index) {
		return $scope.pulsantiS[index];
	};

	function deleteSlack(index,req) {
		document.getElementById("spinnerS" + index).style.display = "inline";
		document.getElementById("trashS" + index).style.display = "none";
		document.getElementById("saveS" + index).style.display = "none";
		$http(req).then(function successCallback(response) {
				$scope.slack.splice(index,1);
			}, function errorCallback(response) {
		    	console.log(response);
        });
	};

	function deleteEmpl(index,req) {
		document.getElementById("spinnerE" + index).style.display = "inline";
		document.getElementById("trashE" + index).style.display = "none";
		document.getElementById("saveE" + index).style.display = "none";
		$http(req).then(function successCallback(response) {
				$scope.employee.splice(index,1);
			}, function errorCallback(response) {
		    	console.log(response);
        });
	};

}]);
