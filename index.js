var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config');
var server = require("./modules/server");

// Load ADS Config file
//var ADSConfig = require('./ads_config');
var fs = require('fs');
var ADSConfigFile = './ads_config';
var ADSConfig = JSON.parse(fs.readFileSync(ADSConfigFile).toString());

// Save function
function save() {
	var data = JSON.stringify(ADSConfig);
	fs.writeFileSync(ADSConfigFile, data);
}

// Check `cd` command to change current working directory
function checkCD(command, cwd) {
	if (command.indexOf('cd ') == 0) {
		command = command.substr(3);
		if (command.indexOf('/') == 0) {
			cwd = command;
		} else if (command.indexOf('../') == 0) {
			while (command.indexOf('../') == 0) {
				cwd = cwd.substr(0, cwd.lastIndexOf('/') - 1);
				command = command.substr(3);
			}
		} else if (command.indexOf('~/') == 0) {
			command = command.substr(2);
		} else if (command == '~') {
			return cwd;
		} else if (command.indexOf('./') == 0) {
			command = command.substr(2);
		}
		cwd = cwd + '/' + command;
	}
	return cwd;
}

// Deploy function
function deploy(command, cwd, callback) {
	var exec = require('child_process').exec;
	exec(command, {cwd: cwd}, function(error, stdout, stderr) {
		callback(error, stdout, stderr);
	});
}

// Run up server
if (config.is_server) {
	serverApp = server().run(config.server.port, config.server.secret, true);
	console.log("Auto Deploy System is running...");

	// Login
	serverApp.post('/api/login', function(req, res) {
		console.log('Login username: ' + req.body.username);
		console.log('Login password: ' + req.body.password);
		
		if ((req.body.username == config.server.username) & (req.body.password == config.server.password)) {
			var user = {
				username: req.body.username
			}
			var token = jwt.sign(user, serverApp.get('superSecret'), {
				expiresIn: 300 // seconds
			});
			req.session.token = token;
			res.send('1');
		} else {
			res.send('0');
		}
	});

	// Check login
	serverApp.get('/api/is_login', function(req, res) {
		var token = req.session.token;
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, serverApp.get('superSecret'), function(err, decoded) {
				if (err) {
					res.send('0');
				} else {
					req.decoded = decoded;
					res.send('1');
				}
			});
		} else {
			res.send('0');
		}
	});

	// Get client list
	serverApp.get('/api/clients', function(req, res) {
		var token = req.session.token;
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, serverApp.get('superSecret'), function(err, decoded) {
				if (err) {
					var resp = {
						'code': 403,
						'result': 'Access Denied'
					}
					res.json(resp);
				} else {
					var resp = {
						'code': 200,
						'result': ADSConfig.client_list
					}
					res.json(resp);
				}
			});
		} else {
			var resp = {
				'code': 403,
				'result': 'Access Denied'
			}
			res.json(resp);
		}
	});

	// Add client
	serverApp.put('/api/client/add/', function(req, res) {
		var token = req.session.token;
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, serverApp.get('superSecret'), function(err, decoded) {
				if (err) {
					var resp = {
						'code': 403,
						'result': 'Access Denied'
					}
					res.json(resp);
				} else {
					var ip = req.body.ip;
					var port = req.body.port;
					var secret = req.body.secret;
					var command = req.body.command;
					var commandList = command.split('\n');

					// Generating the client id
					var _id = (ADSConfig.client_list[ADSConfig.client_list.length-1]._id) + 1;
					console.log('add new id: ' + _id);
					var client = {
						_id: _id,
						ip: ip,
						port: port,
						secret: secret,
						command_list: commandList
					}
					ADSConfig.client_list.push(client);
					console.log(ADSConfig.client_list);
					save();
					var resp = {
						'code': 200,
						'result': 'OK'
					}
					res.json(resp);
				}
			});
		} else {
			var resp = {
				'code': 403,
				'result': 'Access Denied'
			}
			res.json(resp);
		}
	});

	// Modify client
	serverApp.post('/api/client/modify/', function(req, res) {
		var token = req.session.token;
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, serverApp.get('superSecret'), function(err, decoded) {
				if (err) {
					var resp = {
						'code': 403,
						'result': 'Access Denied'
					}
					res.json(resp);
				} else {
					var _id = req.body._id;
					var ip = req.body.ip;
					var port = req.body.port;
					var secret = req.body.secret;
					var command = req.body.command;
					console.log('modify id: ' + _id);

					var clientList = ADSConfig.client_list;
					for (var i=0 ; i < clientList.length ; i++) {
						if (clientList[i]._id == _id) {
							clientList[i].ip = ip;
							clientList[i].port = port;
							clientList[i].secret = secret;
							var commandList = command.split('\n');
							clientList[i].command_llist = commandList;
							break;
						}
					}
					save();
					var resp = {
						'code': 200,
						'result': 'OK'
					}
					res.json(resp);
				}
			});
		} else {
			var resp = {
				'code': 403,
				'result': 'Access Denied'
			}
			res.json(resp);
		}
	});

	// Delete client
	serverApp.delete('/api/client/delete/:_id', function(req, res) {
		var token = req.session.token;
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, serverApp.get('superSecret'), function(err, decoded) {
				if (err) {
					var resp = {
						'code': 403,
						'result': 'Access Denied'
					}
					res.json(resp);
				} else {
					var _id = req.params._id;
					console.log('delete id: ' + _id);

					var clientList = ADSConfig.client_list;
					for (var i=0 ; i < clientList.length ; i++) {
						if (clientList[i]._id == _id) {
							clientList.splice(i);
							break;
						}
					}
					save();
					var resp = {
						'code': 200,
						'result': 'OK'
					}
					res.json(resp);
				}
			});
		} else {
			var resp = {
				'code': 403,
				'result': 'Access Denied'
			}
			res.json(resp);
		}
	});
}

// Run up client
if (config.is_client) {
	clientApp = server().run(config.client.port, config.client.secret, false);
	console.log("Auto Deploy Client is listening...");

	clientApp.get('/', function(req, res) {
		res.status(403).send('');
	});

	// Deploy
	clientApp.post('/deploy', function(req, res) {
		var resp = {};
		var data = JSON.parse(req.rawBody);
		if (config.client.secret == data.secret) {
			var commandList = data.commandList;
			var i = 0;
			if (commandList.length > 0) {
				var result = [];
				var cwd = __dirname;
				var handleDeploy = function(error, stdout, stderr) {
					result.push(stdout);
					i++;
					if (i == commandList.length) {
						resp = {
							'code': 200,
							'result': result
						}
						res.send(resp);
					} else {
						cwd = checkCD(commandList[i], cwd);
						deploy(commandList[i], cwd, handleDeploy);
					}
				};
				cwd = checkCD(commandList[i], cwd);
				deploy(commandList[i], cwd, handleDeploy);
			}
		} else {
			res.status(403).send('');
		}
	});
}
