
angular.module("statsApp.core")
    .factory("dataService", dataServiceFactory)

dataServiceFactory.$inject= ['$http', '$q']
function dataServiceFactory($http, $q){

    function processData(data){
        return $q(function(resolve, reject){
            var clubs = data.map(function(club){
                // calculate club stats
                var h = 0;
                var f = 0;
                var ageMoyen = 0;
                var ageMin = Infinity;
                var ageMax = -Infinity;
                var ages = {};
                
                club.membres.forEach(function(membre){
                    switch(membre.sexe){
                        case "M": 
                        h++;
                        break;
                        case "F":
                        f++;
                        break;
                    }
                    
                    var age = membre.age;
                    if(age === null || age === undefined){
                        return;
                    }
                    
                    if(ages[age] === undefined){
                        ages[age] = 0;
                    }
                    
                    if(age < ageMin){
                        ageMin = age;
                    }
                    
                    if(age > ageMax){
                        ageMax = age;
                    }
                    ages[age]++;
                    ageMoyen += age;
                });
                
                var parite = h / club.membres.length;
                var ageMoyen = ageMoyen / club.membres.length;
                
                club.stats = {
                    parite: parite,
                    mCount: h,
                    fCount: f,
                    ageMoyen: ageMoyen,
                    ageMin: Math.max(ageMin, 18),
                    ageMax: ageMax,
                    ages: ages
                };
                
                return club;
                });
            return resolve(clubs);
        });
    }

    
    var getExample = function(){
        return $http.get('/data/example.json', {})
        .then(function(response){
            // stats caluclation
            return processData(response.data);
        });
    }

    var getLatest = function(){
        return $http.get('/data/latest.json', {})
            .then(function(response){
                // stats caluclation
                return processData(response.data);
            });
    }
        

    return {
        getExample: getExample,
        getLatest: getLatest
    }
}