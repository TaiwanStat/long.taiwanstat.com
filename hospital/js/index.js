(function() {

  var app = angular.module('myApp', ['ngRoute'])
                   .controller('mainController', mainCtrl);

  mainCtrl.$inject = ['$scope', '$rootScope', '$location', '$http'];

  function mainCtrl ($scope, $rootScope, $location, $http, mapService) {
    
    var vm = this;
    init();

    function init () {
      $http.get('./data/data.json').then(function(resp) {
        for (var obj in resp.data) {
          for (var key in resp.data[obj]) {
            if (key != 'population') {
              resp.data[obj][key] = zhutil.annotate(resp.data[obj][key]);
            }
            else {
              resp.data[obj][key] = zhutil.approximate(resp.data[obj][key], {base: '萬', extra_decimal: 2}); 
            }
          }
        }

        $scope.data = resp.data;
      });
    }

  } 

})();
