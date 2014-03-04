angular.module('myApp', ['myApp.controllers', 'myApp.services', 'ngRoute']);

angular.module('myApp')
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/index',
        controller:'SubmitCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    // $locationProvider.html5Mode(true);
  }]);

// angular.module('myApp').config(function ($routeProvider) {
//   $routeProvider
//     .when('/', {
//       templateUrl: '../../views/index.html',
//       controller: 'SubmitCtrl'
//     })
//     .otherwise({
//       redirectTo: '/'
//     });
// });

// when('/', {
//   templateUrl: 'partials/index',
//   controller: IndexCtrl
// }).
