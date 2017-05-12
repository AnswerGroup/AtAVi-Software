describe('AdminController', function() {
	beforeEach(module('AtAViApp'));

	var $controller;
	var url = 'https://mkro94x1wa.execute-api.eu-west-1.amazonaws.com/AtAvi';

	beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  	}));

	beforeEach(function() {
		$scope = {};
		controller = $controller('AdminController', { $scope: $scope });
	});

	beforeEach(function () {
    //inject $rootScope
    inject(function ($rootScope) {
        //instead don't create a child scope and keep a reference to the actual rootScope
        rootScope = $rootScope;
    })
	});

	//get eployee moc
	beforeEach(inject(function($injector) {
     // Set up the mock http service responses
     $httpBackend = $injector.get('$httpBackend');
     // backend definition common for all tests
     authRequestHandler = $httpBackend.when('GET', url + '/rules/employee')
                            .respond([{fullname : "Marco Rossi", 
                            	id : "889126bd-f3f3-4fd0-be22-403ec79c9050",
                            	slack : "#random"}]);
                        }));

   	beforeEach(inject(function($injector) {
     // Set up the mock http service responses
     $httpBackend = $injector.get('$httpBackend');
     // backend definition common for all tests
     authRequestHandler = $httpBackend.when('GET', url + '/rules/customer')
                            .respond([{"company":"Unipd","id":"3ac6c60c-d1a2-4fe0-bd8b-b97101b3940e","last_name":"Zoso","employee_id":"889126bd-f3f3-4fd0-be22-403ec79c9050","first_name":"Leonardo"}]);
                        }));

   	it('should fetch employee rules', function() {
     	$httpBackend.expectGET(url + '/rules/employee').respond(200, '');
    	$httpBackend.flush();
    	expect($scope.slack).toBeDefined();
   	});

   	it('should fetch customer rules', function() {
     	$httpBackend.expectGET(url + '/rules/customer').respond(200, '');
    	$httpBackend.flush();
    	expect($scope.epmloyee).toBeDefined();
   	});

	it('test url', inject(function($rootScope) {
		expect(rootScope.url).toBeDefined();
		url = rootScope.url;
	}));
});