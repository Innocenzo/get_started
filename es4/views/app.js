var routerApp = angular.module('es4', ['ui.router','ngResource']);

routerApp.config(function($stateProvider, $urlRouterProvider) {

$urlRouterProvider.otherwise('/home');

$stateProvider
// HOME STATES AND NESTED VIEWS ========================================
.state('home', {
  url: '/home',
  templateUrl: 'home.html',
});

}); // closes $chatApp.config()
