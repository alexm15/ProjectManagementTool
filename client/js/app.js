var app = angular.module("myApp", []);

app.controller("myController", ['$scope', '$http', function($scope, $http) {
    $scope.test = "Angular works";
    
    $scope.GetTrelloList = function () {
        $http.get('https://api.trello.com/boards/5a008ddf7f0afee2bb74b510', {
            headers: {
                'Access-Control-Allow-Origin': "*"
            },
            params: {
                "key": "6ee5f865fe77804b7e5d6e70bbb46350",
                "token": "478c9ec0c1c071d81fc489f9c7f1800d36d45e31d9d74e13bfe0583f18f9383c"
            }
        }).then(function successCallback(response) {
            $scope.Details = response;
        }, function errorCallback(response) {
            $scope.ResponseDetails = response;
        });
    };
}]);