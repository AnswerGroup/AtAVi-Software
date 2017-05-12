app.controller('ConversationController', ['$scope', function($scope) {
    var test = [
    {
        'sender' : 'user',
        'text' : 'Hi'

    },
    {
        'sender' : 'alexa',
        'text' : 'Welcome in Zero 12 . Could you please tell me your first name, last name and the company you work for?'
    },
    {
        'sender' : 'user',
        'text' : "I'm Andrea Rossi from Unipd"

    },
    {
        'sender' : 'alexa',
        'text' : 'Hello Andrea Rossi, you work in Unipd, are these informations correct?'
    },
    {
        'sender' : 'user',
        'text' : "Yes"

    },
    {
        'sender' : 'alexa',
        'text' : 'Do you know who are you looking for?'
    },
    {
        'sender' : 'user',
        'text' : "Yes"
    },
    {
        'sender' : 'alexa',
        'text' : 'What is the first name and the last name of the employee you are looking for?'
    },
    {
        'sender' : 'user',
        'text' : "I'm looking for Marco Rossi"
    },
    {
        'sender' : 'alexa',
        'text' : 'Are you looking for Marco Rossi?'
    },
    {
        'sender' : 'user',
        'text' : "Yes"
    },
    {
        'sender' : 'alexa',
        'text' : "Ok, I've already told Marco Rossi about your arrival. Would you like a coffee?"
    },
    {
        'sender' : 'user',
        'text' : "Yes"
    },
    {
        'sender' : 'alexa',
        'text' : "Ok, I tell Marco Rossi about it. Do you need something for the meeting?"
    },
    {
        'sender' : 'user',
        'text' : "Yes"
    },
    {
        'sender' : 'alexa',
        'text' : "Ok, Marco Rossi will arrive with something for you"
    }
    ];
    //$scope.conversation = test;
    $scope.nextAlexa = '';
    $scope.nextUtente = '';
        nU
    $scope.submitAlexa = function() {
        if($scope.nextAlexa) {
            var temp = [];
            temp[0] = "Alexa";
            temp[1] = "Alexa: " + $scope.nextAlexa;
            $scope.conversation.push(temp);
            $scope.nextAlexa = '';
        }
    };
    
    $scope.submitUtente = function () {
        if($scope.nextUtente) {
            var temp = [];
            temp[0] = "Utente";
            temp[1] = $scope.nextUtente;
            $scope.conversation.push(temp);
            $scope.nextUtente = '';
        }
    };
}]);
