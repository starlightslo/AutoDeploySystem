var myApp = angular.module('myApp');

myApp.factory('ClientFactory', function($http){
	var factory = {}
	factory.getClients = function(callback) {
		$http.get('/api/clients').success(function(response) {
			if (response.code != 200) {
				callback([])
			} else {
				var clients = response.result;
				for (var i = 0 ; i < clients.length ; i++) {
					var commands = '';
					for (var j = 0 ; j < clients[i].command_list.length ; j++) {
						if (j != 0) commands += '\n';
						commands += clients[i].command_list[j];
					}
					clients[i].command_list = commands;
				}
				callback(clients)
			}
		});
	}
	return factory
})

myApp.controller('ADSController', function($rootScope, $scope, $http, $location, $routeParams, ClientFactory) {
	$scope.getLogin = function() {
		$http.get('/api/is_login').success(function(response) {
			if (response == '1') {
				$location.path("/admin");
			} else {
				$scope.is_login = false;
			}
		});
	}

	$scope.login = function() {
		var data = {
			username: $scope.username,
			password: $scope.password,
		}
		$http.post('/api/login', data).success(function(response) {
			if (response == '1') {
				$location.path("/admin");
			} else {

			}
		});
	}

	$scope.getClients = function() {
		$http.get('/api/clients').success(function(response) {
			if (response.code != 200) {
				$location.path("/");
			} else {
				var clients = response.result;
				for (var i = 0 ; i < clients.length ; i++) {
					var commands = '';
					for (var j = 0 ; j < clients[i].command_list.length ; j++) {
						if (j != 0) commands += '\n';
						commands += clients[i].command_list[j];
					}
					clients[i].command_list = commands;
				}
				$scope.clients = clients;
			}
		});
	}

	$scope.addClient = function() {
		var client = {
			ip: $scope.client.ip,
			port: $scope.client.port,
			secret: $scope.client.secret,
			command: $scope.client.command_list
		}
		$http.put('/api/client/add/', client).success(function(response) {
			$location.path("/");
		});
	}

	$scope.deleteClient = function(index) {
		var _id = $scope.clients[index]._id;
		$http.delete('/api/client/delete/' + _id).success(function(response) {
			ClientFactory.getClients(function(clients) {
				$scope.clients = clients;
			});
		});
	}

	$scope.modifyClient = function(index) {
		var client = {
			_id: $scope.clients[index]._id,
			ip: $scope.clients[index].ip,
			port: $scope.clients[index].port,
			secret: $scope.clients[index].secret,
			command: $scope.clients[index].command_list
		}

		$http.post('/api/client/modify/', client).success(function(response) {
			ClientFactory.getClients(function(clients) {
				$scope.clients = clients;
			});
		});
	}
});