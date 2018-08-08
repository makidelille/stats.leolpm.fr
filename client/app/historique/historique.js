
angular.module("statsApp.historique", ["statsApp.core"])
.directive("historique", function(){
    return {
        restrict: "E",
        templateUrl: "./app/historique/historique.tpl.html",
        controller: "historiqueCtrl"
    };
})
.controller("historiqueCtrl", historiqueCtrl)

historiqueCtrl.$inject = ["$scope", "dataService"];
function historiqueCtrl($scope, dataService){
    $scope.initialized = true;
    $scope.filterValues = {};
    $scope.search = {};
    $scope.data = null;
    dataService.get.tree().then(function(treeData){
        $scope.filterValues = treeData;
        $scope.initialized = true;
    });

    $scope.getHist = function(){
        dataService.get.hist($scope.search).then(function(histData) {
            console.log(histData);
            $scope.data = histData;
        });
    }
   
}