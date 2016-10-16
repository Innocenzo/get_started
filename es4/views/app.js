var routerApp = angular.module('es4', ['ui.router','ngResource']);

routerApp.config(function($stateProvider, $urlRouterProvider) {

$urlRouterProvider.otherwise('/home');

$stateProvider
// HOME STATES AND NESTED VIEWS ========================================
.state('home', {
  url: '/home',
  templateUrl: 'home.html',
  controller : ['$scope',
  function LoginController($scope) {
    $scope.msgs=[];
    $scope.data = {
    multipleSelect: '0'
   };
  //  console.log($scope.data.multipleSelect,"one");
    var socket = io();
    $scope.SendMsg = function () {
      var to ={msg:$scope.formMsg.msg,
                multipleSelect: $scope.data.multipleSelect};
        console.log($scope.formMsg.msg,'form msg');
      var msg ={msg:$scope.formMsg.msg};

      $scope.formMsg.msg=null;
      socket.emit('chat message', to);

    };
    socket.on('users', function(user){
      $scope.users=[];
      console.log(user,'response server');
      for (var variable in user) {
        if (user.hasOwnProperty(variable)) {
          console.log(variable);
          // $scope.$apply(function() {
          //
          //     });
              $scope.users.push({id:variable});
              $scope.$apply();
        }
      }
      // $scope.msgs=[];
    });

    socket.on('chat message', function(msg,id){
      console.log(msg,'response server');
      // $scope.$apply(function() {
      //
      //     });
      $scope.msgs.push({msg:msg.msg,id:id});
      // $scope.msgs=[];
      $scope.$apply();
    });
  }]
});

}); // closes $chatApp.config()
