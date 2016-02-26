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
  'menu',
  'explore'
])
// Set theme for x-editable
.run(function($rootScope, $state, editableOptions) {
  editableOptions.theme = 'bs3'; 
})
.config(function($stateProvider, $urlRouterProvider, paginationTemplateProvider) {
  paginationTemplateProvider.setPath('partials/dirPagination.tpl.html');
  $urlRouterProvider.otherwise("/live");
  $stateProvider
  .state('live',{
      url: '/live',
      templateUrl: 'partials/home/home.html',
      controller: 'HomeCtrl',
  })
  .state('explore',{
    url: '/explore',
    templateUrl: 'components/explore/explore.html'
  })
})
.controller('MainCtrl', function($rootScope, $scope, $location, $state, $timeout) {
});
