
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
    $scope.initialized = false;
    $scope.filterSelected = false;
    $scope.filterValues = {};
    $scope.search = {};
    $scope.data = {};
    $scope.labels = [];
    dataService.get.tree().then(function(treeData){
        $scope.filterValues = treeData;
        $scope.initialized = true;
    });

    $scope.getHist = function(){
        dataService.get.hist($scope.search)
        .then(function(histData) {
            console.log(histData);
            $scope.filterSelected = true;
            var keys = ['ageMin', 'ageMax', 'ageMoyen', 'fCount', 'mCount', 'membresCount', 'parite']
            $scope.labels = histData.map(function(obj){return obj.version; });
            for(var i=0; i< keys.length; i++){
                var key = keys[i];
                $scope.data[key] = histData.map(function(obj){ return obj.value[key]});
            }
        });
    }
   
}