var myApp = angular.module('myApp');

myApp.controller('ADSController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
	$scope.getLogin = function() {
		$http.get('/api/is_login').success(function(response) {
			console.log('response: '+ response);
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
				console.log(clients.length);
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
		console.log('add ip: ' + client.ip);
		$http.put('/api/client/add/', client).success(function(response) {
			console.log('add response: ' + response);
			$location.path("/");
		});
	}

	$scope.deleteClient = function() {
		var _id = $routeParams._id;
		console.log('id: ' + _id);
		$http.delete('/api/client/delete/' + _id).success(function(response) {
			console.log('delete response: ' + response);
			$location.path("/admin");
		});
	}

	$scope.modifyClient = function() {
		var client = {
			_id: $scope.client._id,
			ip: $scope.client.ip,
			port: $scope.client.port,
			secret: $scope.client.secret,
			command: $scope.client.command_list
		}
		console.log('modify id: ' + $scope.client._id);

		$http.post('/api/client/modify/', client).success(function(response) {
			console.log('modify response: ' + response);
			$location.path("/admin");
		});
	}
}]);