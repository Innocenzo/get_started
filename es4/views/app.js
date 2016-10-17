var routerApp = angular.module('es4', ['ui.router','ngResource']);

routerApp.factory('SaveMsg',['$resource', function($resource) {
return $resource('/api/msg');
}]);

routerApp.config(function($stateProvider, $urlRouterProvider) {

$urlRouterProvider.otherwise('/home');

$stateProvider
// HOME STATES AND NESTED VIEWS ========================================
.state('home', {
  url: '/home',
  templateUrl: 'home.html',
  controller : ['$scope','SaveMsg',
  function LoginController($scope,SaveMsg) {
    $scope.msgs=[];
    $scope.data = {
    multipleSelect: '0'
   };
  //  console.log($scope.data.multipleSelect,"one");
    var socket = io();

    socket.on('users', function(user,userCurrent){
      $scope.users=[];

      console.log(user,'response server');
      for (var variable in user) {
        if (user.hasOwnProperty(variable)) {
          console.log(variable);
          // $scope.$apply(function() {
          //
          //     });
            if (user[variable]!==$scope.me) {
                $scope.users.push({id:variable,name:user[variable]});
            }else {
              $scope.currentUsr=variable;
            }

              // $scope.$apply();
        }
      }
      console.log($scope.me,"user current");
      // $scope.userCurrent=$scope.users.id[userCurrent];
      $scope.$apply();
      // $scope.msgs=[];
    });
    $scope.SendMsg = function () {
      var nameTo='';
      console.log($scope.currentUsr);
      console.log($scope.data.multipleSelect);
      if ($scope.data.multipleSelect!==0) {
        for (var i = 0; i < $scope.users.length; i++) {
          // console.log($scope.users[i].id);
          if ($scope.users[i].id===$scope.data.multipleSelect) {
            nameTo=$scope.users[i].name;
            console.log($scope.users[i]);
          }
        }

      }
      var to ={msg:$scope.formMsg.msg,
                multipleSelect: $scope.data.multipleSelect};
        console.log($scope.formMsg.msg,'form msg');
      var msg ={msg:$scope.formMsg.msg};
      var msgSave={msg:$scope.formMsg.msg,
                   idTo: $scope.data.multipleSelect,
                   usernameTo: nameTo,
                   idFrom: $scope.currentUsr,
                   usernameFrom: $scope.me
                    };
                    console.log(msgSave,'send msg to server');
                    console.log($scope.users,"users obj");
      $scope.formMsg.msg=null;
      socket.emit('chat message', to);
      SaveMsg
              .save(msgSave)
              .$promise
              .then(function(res){
                console.log('Save Msg');
                console.log(res);
              }).catch(function(response) {
              console.error('Gists error', response);
              });
    };
    $scope.SendName = function () {
      console.log($scope.formName.name);
      $scope.me = $scope.formName.name;
      socket.emit('users', $scope.formName.name);
      $scope.formName.name=null;

    };


    socket.on('chat message', function(msg,user){
      console.log(msg,'response server');
      console.log(user,"id user");
      // $scope.$apply(function() {
      //
      //     });
      $scope.msgs.push({msg:msg.msg,id:user.id,name:user.name});
      // $scope.msgs=[];
      $scope.$apply();
    });
  }]
});

}); // closes $chatApp.config()
