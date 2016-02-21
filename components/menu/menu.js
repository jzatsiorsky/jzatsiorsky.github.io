var module = angular.module("menu", []);

module.directive('menu', [function() {
  return {
    templateUrl: 'components/menu/menu-tpl.html',
    controllerAs: 'ctrl',
    bindToController: true,
    scope: {
      admin: '='
    },
    controller: function ($scope, $timeout) {
      
      this.initialize = function() {
        var that = this;
        
        this.menu = [
          {
            name: "Coffee",
            price: "3"
          },
          {
            name: "Nutella-me-More",
            price: "4"
          },
          {
            name: "Latte",
            price: "3.50"
          }
        ];
        
        
      }
      
      this.initialize();
  }
}
}]);
