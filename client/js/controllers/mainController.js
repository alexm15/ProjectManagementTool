app.controller('mainController', function($scope, trelloAPI) {
    $scope.test = "Angular works";
    $scope.testService = trelloAPI.testService();
    $scope.runTrelloAPI = trelloAPI.authorize();
});