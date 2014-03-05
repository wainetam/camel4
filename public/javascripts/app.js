angular.module('myApp', ['myApp.controllers', 'myApp.services', 'myApp.filters', 'ngRoute', 'ngResource']);

angular.module('myApp')
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/index',
        controller:'DashCtrl'
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
