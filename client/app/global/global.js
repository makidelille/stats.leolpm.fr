
angular.module("statsApp.global", ["statsApp.core"])
.directive("global", function(){
    return {
        restrict: "E",
        templateUrl: "./app/global/global.tpl.html",
        controller: "globalCtrl"
    };
})
.controller("globalCtrl", globalCtrl)

globalCtrl.$inject = ["$scope", "$element", "$q", "$filter", "dataService"];
function globalCtrl($scope,$element, $q, $filter,  dataService){
    $scope.initialized = false;
    $scope.searchCriteria = ["district", "cp", "ville", "club"];
    $scope.search = {};
    $scope.data = null;


    $scope.hommeFemme = {
        avg: 0,
        data: [0,0],
        labels: ["Homme", "Femme"]
    };
    $scope.membresCount = 0;
    $scope.clubsCount = 0;
    $scope.ages = {
        max:-Infinity,
        min:+Infinity,
        avg:0,
        data: [],
        labels: [],
    };

    $scope.filterValues= {};

    $scope.versions = [];
    $scope.version = 'latest';
    dataService.get.versions().then(function(versions){
        $scope.versions = versions.concat('latest');
        return loadVersion();
    });

    function loadVersion(){
        console.log("load version:", $scope.version);
        $scope.initialized = false;
        return dataService.get.tree($scope.version).then(function(tree){
            $scope.filterValues = tree;
            return dataService.get.stats($scope.version);
        }).then(function(data){
            $scope.data = data;
            return display(data);
        });
    }

    $scope.loadVersion =loadVersion;

    function refresh(){
        for(var key in $scope.search){
            if($scope.search.hasOwnProperty(key) && (!$scope.search[key] || !$scope.search[key].length)){
                delete $scope.search[key];
            }
        }
        var data = $filter('filter')($scope.data, $scope.search, function(actual, expected){
            return actual.length && expected.indexOf(actual) !== -1;
        });
        $scope.initialized = false;
        return display(data);

    }
    $scope.refresh = refresh;

    //filter before function
    function display(data){ 
        return $q(function(resolve, reject){
            var scope = {
                membresCount:0,
                clubsCount:0,
                hommeFemme:{
                    data:[0,0],
                    labels:["Homme", "Femme"]
                },
                ages:{
                    max:10,
                    min:+120,
                    avg:0,
                    data: [],
                    labels: [],
                }
            };

            var temp = [];
            data.forEach(stats => {
                
                scope.membresCount += stats.membresCount;
                scope.clubsCount++;
                scope.hommeFemme.data[0] += stats.mCount;
                scope.hommeFemme.data[1] += stats.fCount;
                
                if(stats.ageMax > scope.ages.max){
                    scope.ages.max = stats.ageMax;
                }
                
                if(stats.ageMin < scope.ages.min){
                    scope.ages.min = stats.ageMin;
                }
                
                temp.push(stats.ages);
            });
            
            //ages assign
            var total=0;
            for(var age=scope.ages.min; age <= scope.ages.max; age++){
                var sum = 0;
                for (var i = 0; i < temp.length; i++) {
                    if(temp[i][age]){
                        var count = temp[i][age];
                        sum += count;
                        total += age * count;
                    }
                }
                scope.ages.data.push(sum);
                scope.ages.labels.push(age + " ans");
            }

            scope.ages.avg = total/scope.membresCount;
            scope.hommeFemme.avg = scope.hommeFemme.data[0]/scope.hommeFemme.data[1];
            return resolve(scope);
        }).then(function(scope){
            $scope.hommeFemme = scope.hommeFemme;
            $scope.ages = scope.ages;
            $scope.membresCount = scope.membresCount;
            $scope.clubsCount = scope.clubsCount;
            $scope.initialized = true;
        });;
    }

   
}