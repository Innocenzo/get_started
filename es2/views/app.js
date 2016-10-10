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

routerApp.factory('UpdateContact',['$resource', function($resource) {
  return $resource('/api/contacts/:id', {id: '@id'}, {
    update: {
      method: 'PUT'
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
    controller: ['$scope','ListContact','AddContact',
    function ContactListController($scope,ListContact,AddContact) {
      $scope.orderProp = "id";
      // we will store all of our form data in this object
      $scope.formData = {};
      $scope.SendData = function () {

        var data = {
          name1:    $scope.formData.name,
          surname:  $scope.formData.surname,
          tel:      $scope.formData.tel
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
})

.state('home.contact', {
    url: '/contact/:ID',
    templateUrl: 'partial-update.html',
    controller: ['$scope','$stateParams','UpdateContact',
    function UpdateContactController($scope,$stateParams,UpdateContact) {
      $scope.UpdateId = function () {
        var id = $stateParams.ID;
        var data = {
          id: $stateParams.ID,
          name:    $scope.formDataU.name,
          surname:  $scope.formDataU.surname,
          tel:      $scope.formDataU.tel
        };
        console.log(id);
        console.log(data);
        UpdateContact.update(data)
                      .$promise
                      .then(function(res){
                        console.log(res);
                        $scope.contacts[res.id] = res;
                      }).catch(function(response) {
                        console.error('Gists error', response, response.data);
                      });
      };
    }]
});





}); // closes $routerApp.config()
