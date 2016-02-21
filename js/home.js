'use strict';

angular.module('myApp.home', ['ngRoute', 'uiGmapgoogle-maps'])

.controller('HomeCtrl', function($scope) {
  $scope.myHouse = "Cabot";
  $scope.headers=["Date", "Time", "Sport", "Opponent", "Location"];
  $scope.show = false;
    $('#myModal').on('hide.bs.modal', function(e) {
      $scope.show = false;
    });
    
    $scope.map = {center: {latitude: 42.366875, longitude: -71.126622}, zoom: 16, events: {
        tilesloaded: function (map) {
            $scope.$apply(function () {
                $scope.mapInstance = map;
            });
        }
    }};
  $scope.showGame = function(game) {
    $scope.map.center = 
        {latitude: $scope.settings.coordinates[game.Location].latitude,
         longitude: $scope.settings.coordinates[game.Location].longitude}
    $scope.shownGame = game;
    $('#myModal').modal();
    window.setTimeout(function() {$scope.$apply(function () {$scope.show = true; })}, 150);
  }
  
  $scope.signUpGame = function () {
    // Adds a player to the game's roster
    Parse.Cloud.run('insertPlayer', {id: $scope.shownGame.id}, {
      // After player is added, reload the data
      success: function() {
          $scope.$broadcast("addGame", {game: $scope.shownGame});
      },
      error: function(error) {
        console.log("Could not fetch data.");
      }
    });
  }
  
  $scope.cancelSignUpGame = function () {
    Parse.Cloud.run('removePlayer', {id: $scope.shownGame.id}, {
      success: function() {
          $scope.$broadcast("removeGame", {game: $scope.shownGame});
      },
      error: function(error) {
        console.log("Could not fetch data.");
      }
    });
  }
  
  $scope.clearMyGames = function () {  
    Parse.Cloud.run('deleteMyGames', {}, {
      success: function(response) {
        $scope.$broadcast("clearMyGames");
      },
      error: function(error) {
        console.log("Could not delete games.");
      }
    });
  }
  
})

// My games box
.controller('HomeCtrlMyGames', function($scope) {
  var initialize = function () {
    $scope.myGamesObj = {};
    
    $scope.myGamesObj.get = function() {
      console.log("reload games");
      // Get user's games
      Parse.Cloud.run('getMyGames', {}, {
        success: function(games) {
          $scope.$apply(function(){
            $scope.myGamesObj.games = games;
            console.log(games);
          });
        },
        error: function(error) {
          console.log("Could not fetch data.");
        }
      });
    }
    
    $scope.myGamesObj.get();
    
  }
  
  
  
  $scope.$on("removeGame", function(event, obj) {
    $scope.$apply(function(){
      $scope.myGamesObj.games = null;
    });
    
    $scope.myGamesObj.get();
  });
  $scope.$on("addGame", function(event, obj) {
    $scope.$apply(function(){
      $scope.myGamesObj.games = null;
    });
    $scope.myGamesObj.get();
  });
  $scope.$on("clearMyGames", function(event) {
    $scope.myGamesObj.games = [];
  });

  initialize();
})

// Upcoming games box
.controller('HomeCtrlUpcoming', function($scope) {
  var initialize = function() {
    $scope.upcomingObj = {};
    $scope.upcomingObj.headers = ["Sport", "Date", "Time", "Opponent", "Location", "Attending"];
    $scope.upcomingObj.get = function() {
      // Get upcoming games
      Parse.Cloud.run('homeGetUpcoming', {}, {
        success: function(games) {
          $scope.$apply(function(){
            $scope.upcomingObj.games = games;
          });
        },
        error: function(error) {
          console.log("Could not fetch data.");
        }
      });
    }
    
    $scope.upcomingObj.get();
    
  
    $scope.$on("clearMyGames", function(event) {
      $scope.$apply(function() {
        $scope.upcomingObj.games = null;
      });
      $scope.upcomingObj.get();
    });


    $scope.$on("removeGame", function(event, obj) {
      $scope.$apply(function() {
        $scope.upcomingObj.games = null;
        $scope.upcomingObj.get();
      });
      
    });

    $scope.$on("addGame", function(event, obj) {
      $scope.$apply(function() {
        $scope.upcomingObj.games = null;
        $scope.upcomingObj.get();
      });
      
    });
    
  }
  
  initialize();
});