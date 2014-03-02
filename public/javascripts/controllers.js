
angular.module('camelApp')
  .controller('SubmitCtrl', function($scope) {
    $scope.urlObj = {
      url: "http://"
    };

    $scope.$watch('urlObj.url', function(newval, oldval) {
      console.log(newval, oldval);
      if(newval.match(/amazon/i)) {
        console.log("You're shopping on Amazon!");
      }
    });
    // why doesn't this work?
  });


