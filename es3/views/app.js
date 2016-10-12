var routerApp = angular.module('es2', ['ui.router','ngResource']);

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
}).
state('signup', {
  url: '/signup',
  templateUrl: 'partial-signup.html'
}).
state('signin', {
  url: '/signin',
  templateUrl: 'partial-login.html'
})
.state('home.contacts', {
  url: '/contacts',
  templateUrl: 'partial-home-list.html',
  controller: ['$scope',"UpdateContact",
  function ContactListController($scope,UpdateContact) {
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
      return UpdateContact
                      .save(data)
                      .$promise
                      .then(function(res){
                        console.log(res);
                        $scope.contacts.push(res);
                      }).catch(function(response) {
                        console.error('Gists error', response, response.data);
                      });
    };

    UpdateContact
              .query()
              .$promise
              .then(function(res){
                console.log(res);
                $scope.contacts = res;
              }).catch(function(response) {
                console.error('Gists error', response, response.data);
              });
$scope.RemoveId = function (id) {
                console.log(id);
                UpdateContact.remove({id:id})
                              .$promise
                              .then(function(res){
                                console.log(JSON.stringify(res)+"update response");
                                return UpdateContact
                                                  .query()
                                                  .$promise
                                                  .then(function(res){
                                                    console.log(res);
                                                    $scope.contacts = res;
                                                  }).catch(function(response) {
                                                    console.error('Gists error', response, response.data);
                                                  });
                              }).catch(function(response) {
                                console.error('Gists error', response, response.data);
                              });
              };
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
                      console.log(JSON.stringify(res)+"update response");
                      return UpdateContact
                                        .query()
                                        .$promise
                                        .then(function(res){
                                          console.log(res);
                                          $scope.contacts = res;
                                        }).catch(function(response) {
                                          console.error('Gists error', response, response.data);
                                        });
                    }).catch(function(response) {
                      console.error('Gists error', response, response.data);
                    });
    };
  }]
});





}); // closes $routerApp.config()
