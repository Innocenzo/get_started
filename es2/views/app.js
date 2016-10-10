var routerApp = angular.module('es2', ['ui.router','ngResource']);

routerApp.factory('ListContact',['$resource', function($resource) {
  return $resource('/api/contacts/', {
    query: {
      method: 'GET', isArray:true
    }
  });
}]);

routerApp.factory('AddContact',['$resource', function($resource) {
  return $resource('/api/contacts/', {
    save: {
      method: 'POST'
    }
  });
}]);

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
    controller: ['$scope','$http','ListContact','AddContact',
    function ContactListController($scope,$http,ListContact,AddContact) {
      $scope.orderProp = "name";
      // we will store all of our form data in this object
      $scope.formData = {};
      $scope.SendData = function () {

        var data = {
          name1:    $scope.formData.name,
          surname: $scope.formData.surname,
          tel: $scope.formData.tel
        };
        console.log(data);
        return AddContact
                        .save(data)
                        .$promise
                        .then(function(res){
                          console.log(res);
                          $scope.contacts.push(res);
                        }).catch(function(response) {
                          console.error('Gists error', response, response.data);
                        });
      };

      ListContact
                .query()
                .$promise
                .then(function(res){
                  console.log(res);
                  $scope.contacts = res;
                }).catch(function(response) {
                  console.error('Gists error', response, response.data);
                });
    }
  ]
});





}); // closes $routerApp.config()
