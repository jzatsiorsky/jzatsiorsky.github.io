var module = angular.module("specials", []);

module.directive('specials', [function() {
  return {
    templateUrl: 'components/specials/specials-tpl.html',
    controllerAs: 'ctrl',
    bindToController: true,
    scope: {
      admin: '='
    },
    controller: function ($scope, $timeout) {
      
      this.initialize = function() {
        var that = this;
        
        this.dotw = {name: "Nutella-me-More", price: 4, description: "A nutella mocha latte, fit for a king."};
        this.discount = 1;
        
      }
      
      this.initialize();
  }
}
}]);
