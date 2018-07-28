
angular.module("statsApp.historique", ["statsApp.core"])
.directive("historique", function(){
    return {
        restrict: "E",
        templateUrl: "./app/historique/historique.tpl.html",
        controller: "historiqueCtrl"
    };
})
.controller("historiqueCtrl", historiqueCtrl)

historiqueCtrl.$inject = ["$scope"];
function historiqueCtrl($scope){
   
}