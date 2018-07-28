
angular.module("statsApp.menu", ["statsApp.core"])
.directive("menu", function(){
    return {
        restrict: "E",
        templateUrl: "./app/menu/menu.tpl.html",
        controller: "menuCtrl"
    };
})
.controller("menuCtrl", menuCtrl)

menuCtrl.$inject = ["$scope", "states"];
function menuCtrl($scope, states){
    $scope.menuItems = states();
    $scope.selected = 0;
}