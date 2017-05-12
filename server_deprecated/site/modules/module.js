var app = angular.module('AtAViApp', []);

app.run(['$rootScope', function($rootScope){
    $rootScope.url = 'https://mkro94x1wa.execute-api.eu-west-1.amazonaws.com/AtAvi';
}]);