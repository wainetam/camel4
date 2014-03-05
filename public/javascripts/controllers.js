angular.module('myApp.controllers', []);

angular.module('myApp.controllers')
  .controller('SubmitCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.form = {
      url: "",
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
  }]);

angular.module('myApp.controllers')
  .controller('DashCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $http.get('/data').success(function(data) {
      $location.path('/');
      $scope.trackedUrls = data;
      console.log('data: ', $scope.trackedUrls);
    });

    $scope.deleteItem = function(url) {
      var urltoDelete = url.url;
      var currentContent = url.currentContent;
      var domElement = url.domElement;
      var itemToDelete = { 'url': urltoDelete, 'currentContent': currentContent, 'domElement': domElement };
      console.log('trying to delete');
      $http.delete('/delete', { params: itemToDelete } ).success(function(data) {
        $location.path('/');
        console.log("delete successful!");
      });
    };

  }]);

//   function ReadPostCtrl($scope, $http, $routeParams) {
//   $http.get('/api/post/' + $routeParams.id).
//     success(function(data) {
//       $scope.post = data.post;
//     });
// }
