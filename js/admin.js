'use strict';

angular.module('myApp.admin', ['ngRoute'])

.controller('AdminCtrl', function($scope) {
  
  var getSelected = function() {
    if (typeof(Storage) !== "undefined")
    {
      if (localStorage.selectedAdmin) {
        return localStorage.selectedAdmin;
      }
      else {
        return "editGames";
      }
    }
    else {
      return "editGames";
    }
  }
  
  
  $scope.selected = getSelected();
  
  $scope.setSelected = function(setting) {
    $scope.selected = setting;
    
    // Add the selected setting to the user's localstorage, if available
    if (typeof(Storage) !== "undefined") {
      localStorage.selectedAdmin = setting;
    }
  }
  

});

