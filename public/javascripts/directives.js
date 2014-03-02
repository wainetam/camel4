angular.module('camelApp')
  .directive("onSubmit", function() {
    return {
      scope: true,
      link: function (myScope, element, attrs) {
        myScope.name = "David";

        element.bind('mouseenter', function() {
          // if($scope.urlObj.url.match(/amazon/i)) {
            console.log("You're shopping on Amazon!");
          // }
        });
      }
    };
  });
