'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.home',
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
  });
})
.controller('MainCtrl', function($rootScope, $scope, $location, $state, $timeout) {
});
