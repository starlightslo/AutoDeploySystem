var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'ADSController',
		templateUrl: 'views/index.html'
	})
	.when('/admin', {
		controller: 'ADSController',
		templateUrl: 'views/admin.html'
	})
	.when('/delete/client/:_id', {
		controller: 'ADSController',
		templateUrl: 'views/delete_project.html'
	})
	.otherwise({
		redirectTo: '/'
	})
});