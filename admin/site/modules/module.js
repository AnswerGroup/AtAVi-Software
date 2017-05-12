var app = angular.module('AtAViApp', []);
//Modificare $rootScope.url sostituendo [YOUR_API_ID] con l'ID dell'API: https://[YOUR_API_ID].execute-api.eu-west-1.amazonaws.com/AtAVi

app.run(['$rootScope', function($rootScope){
    $rootScope.url = '[YOUR_API_ID]';
}]);
