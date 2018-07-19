
angular.module("statsApp.home", [])
    .directive("home", function(){
        return {
            templateUrl: "./app/home/home.tpl.html",
            controller: "homeCtrl"
        };
    })
    .controller("homeCtrl", homeCtrl)

homeCtrl.$inject = ["$scope", "dataService"];
function homeCtrl($scope, dataService){
    $scope.dataLoaded = false;
    dataService.getExample().then(function(data){
        $scope.data = data.data;
        $scope.dataLoaded = true;
    });
}