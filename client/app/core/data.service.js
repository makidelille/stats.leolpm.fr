
angular.module("statsApp.core")
    .factory("dataService", dataServiceFactory)

dataServiceFactory.$inject= ['$http', '$q']
function dataServiceFactory($http, $q){

    var getFunctions = {};
    
    getFunctions.latest = function(){
        return $http.get('/api/stats', {})
            .then(function(response){
                // stats caluclation
                return response.data;
            });
    }

    getFunctions.tree = function(){
        return $http.get('/api/tree', {})
            .then(function(response){
                // stats caluclation
                return response.data;
            });
    }
        

    return {
       get: getFunctions
    }
}