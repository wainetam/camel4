angular.module('myApp.controllers', []);

angular.module('myApp.controllers')
  .controller('SubmitCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.form = {
      url: "http://",
      domElement: "Enter DOM element"
    };

    $scope.submitUrlAndDom = function() {
      console.log('in submit func with form var ', $scope.form);
      $http.post('/submit', $scope.form).success(function(data) {
        $location.path('/');
        $scope.error = data.urlError;
        console.log(data);
      });
    };

    $scope.$watch('form.url', function(newval, oldval) {
      console.log(newval, oldval);
      if(newval.match(/amazon/i)) {
        console.log("You're shopping on Amazon!");
      }
    });

  }])
  .controller('DashCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

  }]);
