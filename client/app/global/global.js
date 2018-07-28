
angular.module("statsApp.global", ["statsApp.core"])
.directive("global", function(){
    return {
        restrict: "E",
        templateUrl: "./app/global/global.tpl.html",
        controller: "globalCtrl"
    };
})
.controller("globalCtrl", globalCtrl)

globalCtrl.$inject = ["$scope", "dataService"];
function globalCtrl($scope, dataService){
    $scope.initialized = false;
    $scope.data = [];

    $scope.hommeFemme = {};
    $scope.ages = {};

    dataService.getExample().then(function(response){
        $scope.data = response.data;
        console.log(response.data);
        
        calcultateHommeFemme();  
        calcultateAge();      
        
        $scope.initialized = true;
    });

    function calcultateHommeFemme(){
        var h = 0;
        var f = 0;

        $scope.data.forEach(function(element) {
            element.membres.forEach(function(ele){
                switch(ele.sexe){
                    case "M": 
                        h++;
                        break;
                    case "F":
                        f++;
                        break;
                }
            })
        });


        $scope.hommeFemme = {
            data: [h, f],
            labels: ["homme", "femme"]
        }

    }

    function calcultateAge(){
        var obj = {}

        $scope.data.forEach(function(element) {
            element.membres.forEach(function(ele){
                var age = ele.age;
                if(obj[age] === undefined){
                    obj[age] = 0;
                }
                obj[age]++;
            })
        });


        $scope.ages = {
            data: [],
            labels: []
        }  

        for(var age in obj){
            if(age === "null" || age === "undefined") {
                continue
            };
            $scope.ages.data.push(obj[age]);
            $scope.ages.labels.push(age + " ans");
        };

    }

   
}