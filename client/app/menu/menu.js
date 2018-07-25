
angular.module("statsApp.menu", [])
.directive("menu", function(){
    return {
        restrict: "E",
        templateUrl: "./app/menu/menu.tpl.html",
        controller: "menuCtrl"
    };
})
.controller("menuCtrl", menuCtrl)

menuCtrl.$inject = ["$scope", "dataService"];
function menuCtrl($scope, dataService){
    $scope.menuItems = [
        {
            name:"home",
            state:"home",
            label: "home"
        },
        {
            name:"test2",
            state:"about",
            label: "test2"
        },
        {
            name:"test3",
            state:"state3",
            label: "test3"
        }
    ];
    $scope.selected = $scope.menuItems[0];
}