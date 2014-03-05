angular.module('myApp.filters', []);

angular.module('myApp.filters')
  .filter('createLastUpdateField', ['$scope', function($scope) {
    return function(input) {
      var lastElement = function(arr) {
        var arrLen = arr.length;
        return arr[arrLen-1];
      };

      var arr = [];
      for(var url in inputs) {
        lastUpdatedTime = lastElement(url['changes']);
        arr.push({ url: url, last_updated: lastUpdatedTime });
      }
      return arr;
    };
  }]);

// [{url: 'www.cnn.com', changes:[]}, {url: 'www.espn.com', changes:[] }]

// last one is most recent change
