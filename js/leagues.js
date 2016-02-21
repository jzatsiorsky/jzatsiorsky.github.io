'use strict';

angular.module('myApp.leagues', ['ngRoute', 'uiGmapgoogle-maps'])

.controller('LeaguesCtrl', function($scope) {
  $scope.headers=["Date", "Time", "Opponent", "Location", "Attending"];
  $scope.map = {center: {latitude: 42.366875, longitude: -71.126622}, zoom: 16, events: {
            tilesloaded: function (map) {
                $scope.$apply(function () {
                    $scope.mapInstance = map;
                });
            }
        }};
  
  $scope.opponents = ["Owen Prunskis", "Matt Podlesak", "Michael Yuan"];
  
  $scope.sports=["Basketball", "Softball", "Tennis", "Flag Football"];
  $scope.inSeason=["Basketball", "Softball", "Tennis", "Flag Football", "Hockey"];
  $scope.outOfSeason=["Volleyball","Soccer","Frisbey"];
  
  var getSelected = function() {
    if (typeof(Storage) !== "undefined")
    {
      if (localStorage.selected) {
        return localStorage.selected;
      }
      else {
        return "Basketball";
      }
    }
    else {
      return "Basketball";
    }
  }
  $scope.selected = getSelected();
  
  
  $scope.show = false;
  $scope.showGame = function(game) {
    $scope.shownGame = game;
    $('#myModal').modal();
    window.setTimeout(function() {$scope.$apply(function () {$scope.show = true; })}, 150);
    
  }
  
  $('#myModal').on('hide.bs.modal', function(e) {
    $scope.show = false;
  });
  
  $scope.get = function() {
    Parse.Cloud.run('getUpcomingGames', {}, {
      success: function(games) {  
        $scope.$apply(function(){
          $scope.games = games;
        });
      },
      error: function(error) {
        console.log("Could not fetch data.");
      }
    });
  }
  
  $scope.init = function () {
    $scope.get();
  }
  
  
  $scope.init();
  
  $scope.signUpGame = function () {
    Parse.Cloud.run('insertPlayer', {id: $scope.shownGame.id}, {
      success: function() {
        // re-fetch the data on success
        $scope.get();
      },
      error: function(error) {
        console.log("Could not fetch data.");
      }
    });
  }
  
  $scope.cancelSignUpGame = function () {
    Parse.Cloud.run('removePlayer', 
        {id: $scope.shownGame.id}, {
      success: function() {
        $scope.get();
      },
      error: function(error) {
        console.log("Could not fetch data.");
      }
    });
  }
  
  $scope.updateSport = function (sport) {
    $scope.selected = sport;
    
    // Add the selected sport to the user's localstorage, if available
    if(typeof(Storage) !== "undefined") {
      localStorage.selected = sport;
    }
    $scope.$broadcast("newSport", {sport: $scope.selected});
  }
  

});

