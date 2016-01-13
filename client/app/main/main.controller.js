'use strict';

angular.module('nearbyTweetReactiveApp')
  .filter('reverse', function() {
    return function(items) {

	debugger;
	console.log(typeof(items));
	console.log("%j", items);
      return items.slice().reverse();
    };
  })
  .directive("sentiment", function(){
    return {
      scope: {
        ratings: "="
      },
      template: "<i ng-repeat='i in range(ratings)' ng-class='cssClass' style='margin-left:2px'></i>",
     
      restrict: "E",
      controller: ["$scope", function($scope) {
        
         $scope.range = function(count){
              
              var r = []; 
              for (var i = 0; i < Math.abs(count); i++) { 
                  r.push(i) 
              } 
              return r;
          }
          
          if ($scope.ratings > 0)
            $scope.cssClass = "fa fa-thumbs-up";
          else if ($scope.ratings < 0)
            $scope.cssClass = "fa fa-thumbs-down";
        
      }]
    }
  })
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
    
    $scope.tweets = [];
    
    socket.socket.on("tweet:new",  function(tweet){

	debugger;
	console.log(typeof(tweet));
	console.log("%j", tweet);

      $scope.tweets.push(tweet);
    });
    
  
    
  });
