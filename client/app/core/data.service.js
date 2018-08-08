
angular.module("statsApp.core")
    .factory("dataService", dataServiceFactory)

dataServiceFactory.$inject= ['$http', '$q']
function dataServiceFactory($http, $q){

    var getFunctions = {};
    
    getFunctions.stats = function(version){
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

    getFunctions.hist = function(filter){
        filter = filter || {};
        return $http.get('/api/stats/hist', {
            params: {
                district: filter.district,
                ville: filter.ville,
                club: filter.club
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