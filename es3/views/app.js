var routerApp = angular.module('es2', ['ui.router','ngResource']);

routerApp.factory('UpdateContact',['$resource', function($resource) {
return $resource('/api/contacts/:id/:uuid', {id: '@id',uuid:'@uuid'}, {
  update: {
    method: 'PUT'
  }
});
}]);
routerApp.factory('Signup',['$resource', function($resource) {
return $resource('/api/signup');
}]);
routerApp.factory('Login',['$resource', function($resource) {
return $resource('/api/login');
}]);
routerApp.factory('Logout',['$resource', function($resource) {
return $resource('/api/logout');
}]);

routerApp.config(function($stateProvider, $urlRouterProvider) {

$urlRouterProvider.otherwise('/home');

$stateProvider
// HOME STATES AND NESTED VIEWS ========================================
.state('home', {
  url: '/home',
  templateUrl: 'partial-home.html',
})
.state('logout', {
  url: '/logout',
  templateUrl: 'logout.html',
  controller : ['$scope','Logout','$location',
  function LoginController($scope,Logout,$location) {
    $scope.Logout = function () {
      return    Logout
                      .get()
                      .$promise
                      .then(function(res){
                        console.log('logout ok');
                        console.log(res);
                        $location.path('/');

                      }).catch(function(response) {
                        console.error('Gists error', response, response.data);
                      });
    };
  }]
}).
state('signup', {
  url: '/signup',
  templateUrl: 'partial-signup.html',
  controller : ['$scope','$location','Signup',
  function SignupController($scope,$location,Signup) {
    $scope.Signup = function () {
      var data = {
        username:  $scope.formDataS.email,
        password:  $scope.formDataS.password
      };
      console.log(data+"signup");
      return    Signup
                      .save(data)
                      .$promise
                      .then(function(res){
                        console.log("signup OK");
                        $location.path('/');
                      }).catch(function(response) {
                        console.error('Gists error', response, response.data);
                      });
    };
  }]
}).
state('login', {
  url: '/login',
  templateUrl: 'partial-login.html',
  controller : ['$scope','Login','$location','UpdateContact',
  function LoginController($scope,Login,$location,UpdateContact) {
    $scope.Login = function () {
      var data = {
        username:  $scope.formDataL.email,
        password:  $scope.formDataL.password
      };
      console.log(data);
      Login
          .save(data)
          .$promise
          .then(function(res){
            console.log('login ok');
            console.log(res);
            var urlUser ='/home/contacts/'+res.uuid;
            console.log(urlUser);
             $location.path(urlUser);

          })
          .catch(function(response) {
            console.error('Gists error', response, response.data);
          });

    };
  }]
})
.state('home.contacts', {
  url: '/contacts/:uuid',
  templateUrl: 'partial-home-list.html',
  controller: ['$scope',"UpdateContact","$stateParams",
  function ContactListController($scope,UpdateContact,$stateParams) {
    $scope.orderProp = "id";
    // we will store all of our form data in this object
    $scope.formData = {};
    $scope.SendData = function (uuid) {
      console.log(uuid,'uuid SendData');
      var data = {
        name1:    $scope.formData.name,
        surname:  $scope.formData.surname,
        tel:      $scope.formData.tel,
        uuid:     uuid
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
              .query({id:$stateParams.uuid})
              .$promise
              .then(function(res){
                console.log(res,'UpdateContact query');
                $scope.contacts = res;
                $scope.uuid=$stateParams.uuid;
              }).catch(function(response) {
                console.error('Gists error', response, response.data);
              });
$scope.RemoveId = function (id,uuid) {
                console.log(id);
                UpdateContact.remove({id:id,uuid:uuid})
                              .$promise
                              .then(function(res){
                                console.log(JSON.stringify(res)+"update remove");
                                return UpdateContact
                                                  .query({id:uuid})
                                                  .$promise;

                              }).then(function(res){
                                console.log(res);
                                $scope.contacts = res;
                              })
                              .catch(function(response) {
                                console.error('Gists error', response, response.data);
                              });
              };
  }
]
})

.state('home.contact', {
  url: '/contact/:ID/:UUID',
  templateUrl: 'partial-update.html',
  controller: ['$scope','$stateParams','UpdateContact','$location',
  function UpdateContactController($scope,$stateParams,UpdateContact,$location) {
    $scope.UpdateId = function () {
      var id = $stateParams.ID;
      var data = {
        id: $stateParams.ID,
        name:     $scope.formDataU.name,
        surname:  $scope.formDataU.surname,
        tel:      $scope.formDataU.tel,
        uuid:     $stateParams.UUID
      };
      console.log(id);
      console.log(data);
      UpdateContact.update(data)
                    .$promise
                    .then(function(res){
                      console.log("update response");
                      var urlUser ='/home/contacts/'+$stateParams.UUID;
                      console.log(urlUser);
                       $location.path(urlUser);
                    }).catch(function(response) {
                      console.error('Gists error', response, response.data);
                    });
    };
  }]
});





}); // closes $routerApp.config()
