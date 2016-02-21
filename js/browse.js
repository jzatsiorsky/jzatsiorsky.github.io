'use strict';

angular.module('myApp.browse', ['ngRoute'])

.controller('BrowseCtrl', function($scope) {
  
  var getSelected = function() {
    if (typeof(Storage) !== "undefined")
    {
      if (localStorage.selectedBrowse) {
        return localStorage.selectedBrowse;
      }
      else {
        return "games";
      }
    }
    else {
      return "games";
    }
  }
  
  
  $scope.selected = getSelected();
  
  $scope.setSelected = function(setting) {
    $scope.selected = setting;
    
    // Add the selected setting to the user's localstorage, if available
    if (typeof(Storage) !== "undefined") {
      localStorage.selectedBrowse = setting;
    }
  }
  

});

