
angular.module("statsApp.core")
    .factory("dataService", dataServiceFactory)

dataServiceFactory.$inject= ['$http', '$q']
function dataServiceFactory($http, $q){

    var getFunctions = {};
    
    getFunctions.latest = function(version){
        return $http.get('/api/stats', {
            params: {
                version: version || 'latest' 
            }
        })
            .then(function(response){
                // stats caluclation
                return response.data;
            });
    }

    getFunctions.tree = function(version){
        return $http.get('/api/tree', {
            params: {
                version: version || 'latest' 
            }
        })
            .then(function(response){
                // stats caluclation
                return response.data;
            });
    }

    getFunctions.versions = function(){
        return $http.get('/api/versions').then(function(response){
            return response.data;
        });
    }
        

    return {
       get: getFunctions
    }
}