'use strict';

angular.module("statsApp", ["ngRoute","ngResource", "ngMaterial","ui.router","chart.js", "statsApp.core", "statsApp.menu", "statsApp.home","statsApp.global","statsApp.historique","statsApp.export"])
    .config(['$stateProvider', 'states', function($stateProvider, states) {
        states().forEach(function(state){
            $stateProvider.state(state);
        });

        
    }]);
