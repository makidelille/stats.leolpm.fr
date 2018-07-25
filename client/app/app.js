'use strict';

angular.module("statsApp", ["ngRoute","ngResource", "ngMaterial","ui.router", "statsApp.home", "statsApp.core", "statsApp.menu"])
    .config(['$stateProvider', function($stateProvider) {
        var states = [
            {
                name:"home",
                url:"/home",
                component: "home"
            }
        ];
        states.forEach(function(state){
            $stateProvider.state(state);
        });
    }]);
