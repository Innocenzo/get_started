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
      // we will store all of our form data in this object
      $scope.formData = {};
      $scope.SendData = function () {
        var data ={
          name:    $scope.formData.name,
          surname: $scope.formData.surname,
          tel: $scope.formData.tel
        };
        console.log(data);
        $http.post('/api/contacts', data )
        .then(function(response) {
          console.log(response);
          $scope.contacts.push(response.data);
        }).catch(function(response) {
          console.error('Gists error', response.status, response.data);
        });
      };  
      $http.get("/api/contacts").then(function(response) {
        // $scope.contacts = data;
        console.log(response);
        $scope.contacts = response.data;
      }).catch(function(response) {
        console.error('Gists error', response, response.data);
      });
    }
  ]
});





}); // closes $routerApp.config()
