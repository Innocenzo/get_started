var routerApp = angular.module('es2', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/home');

  $stateProvider

  // HOME STATES AND NESTED VIEWS ========================================
  .state('home', {
    url: '/home',
    templateUrl: 'partial-home.html'
  })
  // nested list with custom controller
  .state('home.contacts', {
    url: '/contacts',
    templateUrl: 'partial-home-list.html',
    controller: ['$scope','$http',
    function ContactListController($scope,$http) {
      $http.get("/api/contacts").then(function(response) {
        // $scope.contacts = data;
        console.log(response);
        $scope.contacts = response.data;
      }).catch(function(response) {
        console.error('Gists error', response.status, response.data);
      });
    }
  ]
});





}); // closes $routerApp.config()
