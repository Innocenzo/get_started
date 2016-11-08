'use strict';

angular.module('app211App')
.factory('Main', function ($resource) {
  return $resource('/api/things/:id/', {
    id: '@_id'
  },
  {
    update: {
      method: 'PUT',
    }
  });
})
  .controller('MainCtrl', function ($scope, $http,Main,$location,$stateParams) {
    $scope.awesomeThings = [];

    function handleError() {
      return function(err) { // NOTE: callback della catch
       console.log(err,'handleError Main');
      };
    }

    Main.query()
    .$promise
    .then(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      console.log(awesomeThings);
    })
    .catch(handleError());
    // $http.get('/api/things/').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    //   console.log(awesomeThings);
    // });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      Main.save({ name: $scope.newThing })
      .$promise
      .then(function(thing) {
        console.log(thing);
        $scope.awesomeThings.push(thing);
      })
      .catch(handleError());
      // $http.post('/api/things', { name: $scope.newThing }).then(function(response) {
      //   console.log(response.data);
      //   $scope.awesomeThings.push(response.data);
      // })
      // .catch(function(err) {
      //   console.log(err);
      // });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      console.log(thing._id);
      Main
          .delete({id:thing._id})
          .$promise
          .then(function(msg) {
            console.log(msg);
            _.remove($scope.awesomeThings, function(obj) {
                return obj._id === thing._id;
              });
          })
          .catch(handleError());

      // $http.delete('/api/things/' + thing._id).then(function(response) {
      //   console.log(response);
      // })
      // .catch(function(err) {
      //   console.log(err);
      // });
      // _.remove($scope.awesomeThings, function(obj) {
      //     return obj._id === thing._id;
      //   });
    };
    $scope.updateThing = function () {

      Main.update({_id : $stateParams.id, name: $scope.updatingThing})
      .$promise
      .then(function(thing) {
        console.log(thing);
         $location.path('/');
      })
      .catch(function(err) {
        console.log(err);
      });
    };

  });
