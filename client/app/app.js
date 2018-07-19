'use strict';

angular.module("statsApp", ["ngRoute","ngResource", "ngMaterial", "statsApp.home", "statsApp.core", "statsApp.menu"])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('');
        
        $routeProvider.when('/home', {
            template: "<home></home>"
        })
        .otherwise({redirectTo :'/home'});
      }]);
