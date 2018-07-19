
angular.module("statsApp.core", [])
    .factory("dataService", dataServiceFactory)

dataServiceFactory.$inject= ['$http']
function dataServiceFactory($http){
    
    var getExample = function(){
        return $http.get('/data/example.json', {
        
        });
    }
        

    return {
        getExample: getExample
    }
}