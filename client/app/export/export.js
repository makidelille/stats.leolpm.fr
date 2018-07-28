
angular.module("statsApp.export", ["statsApp.core"])
.directive("export", function(){
    return {
        restrict: "E",
        templateUrl: "./app/export/export.tpl.html",
        controller: "exportCtrl"
    };
})
.controller("exportCtrl", exportCtrl)

exportCtrl.$inject = ["$scope"];
function exportCtrl($scope){
   
}