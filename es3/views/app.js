var routerApp = angular.module('es2', ['ui.router','ngResource']);

routerApp.factory('UpdateContact',['$resource', function($resource) {
return $resource('/api/contacts/:id', {id: '@id'}, {
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
  controller : ['$scope','Logout',
  function LoginController($scope,Logout) {
    $scope.Logout = function () {
      return    Logout
                      .get()
                      .$promise
                      .then(function(res){
                        console.log('logout ok');
                        console.log(res);
                        //res.redirect("/");
                        // $scope.contacts.push(res);
                      }).catch(function(response) {
                        console.error('Gists error', response, response.data);
                      });
    };
  }]
}).
state('signup', {
  url: '/signup',
  templateUrl: 'partial-signup.html',
  controller : ['$scope','Signup',
  function SignupController($scope,Signup) {
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
                        // res.redirect("/");
                        // $scope.contacts.push(res);
                      }).catch(function(response) {
                        console.error('Gists error', response, response.data);
                      });
    };
  }]
}).
state('login', {
  url: '/login',
  templateUrl: 'partial-login.html',
  controller : ['$scope','Login',
  function LoginController($scope,Login) {
    $scope.Login = function () {
      var data = {
        username:  $scope.formDataL.email,
        password:  $scope.formDataL.password
      };
      console.log(data);
      return    Login
                      .save(data)
                      .$promise
                      .then(function(res){
                        console.log('login ok');
                        console.log(res);
                        //res.redirect("/");
                        // $scope.contacts.push(res);
                      }).catch(function(response) {
                        console.error('Gists error', response, response.data);
                      });
    };
  }]
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
