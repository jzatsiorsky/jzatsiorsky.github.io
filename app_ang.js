'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.leagues',
  'myApp.version',
  'myApp.admin',
  'myApp.browse',
  'ui.router',
  'angularUtils.directives.dirPagination',
  'ui.bootstrap',
  'datePicker',
  'xeditable',
  'specials',
  'music',
  'menu'
])
// Set theme for x-editable
.run(function($rootScope, $state, editableOptions) {
  editableOptions.theme = 'bs3'; 
})
.config(function($stateProvider, $urlRouterProvider, paginationTemplateProvider) {
  paginationTemplateProvider.setPath('partials/dirPagination.tpl.html');
  $urlRouterProvider.otherwise("/home");
  $stateProvider
  .state('home',{
      url: '/home',
      templateUrl: 'partials/home/home.html',
      controller: 'HomeCtrl',
  })
  .state('leagues', {
      url: "/leagues",
      templateUrl: "partials/leagues/leagues.html",
      controller: 'LeaguesCtrl'
    })
  .state('settings', {
    url: "/settings",
    templateUrl: "partials/settings.html"
  })
  .state('admin', {
    url: "/admin",
    templateUrl: "partials/admin.html",
    controller: 'AdminCtrl'
  })
  .state('browse', {
    url: "/browse",
    templateUrl: "partials/browse.html",
    controller: 'BrowseCtrl'
  })
  .state('signup', {
      url: "/signup",
      templateUrl: "partials/signup.html"
    })
  .state('login', {
      url: "/login",
      templateUrl: "partials/login.html"
    });
})
.controller('MainCtrl', function($rootScope, $scope, $location, $state, $timeout) {
});
