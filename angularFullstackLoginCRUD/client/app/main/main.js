'use strict';

angular.module('app211App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('update', {
        url: '/update/:id',
        templateUrl: 'app/main/update.html',
        controller: 'MainCtrl'
      });
  });
