'use strict';

angular.module('app211App')
  .controller('SignupCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          if(err.name) {
          angular.forEach(err.fields, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = err.message;
          });
        }
        });
      }
    };

  });
