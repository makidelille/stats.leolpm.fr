
angular.module("statsApp.menu", [])
.directive("menu", function(){
    return {
        templateUrl: "./app/menu/menu.tpl.html",
        controller: "menutrl"
    };
})
.controller("menuCtrl", menuCtrl)

menuCtrl.$inject = ["$scope", "dataService"];
function menuCtrl($scope, dataService){
$scope.dataLoaded = false;
dataService.getExample().then(function(data){
    $scope.data = data.data;
    $scope.dataLoaded = true;
});
}