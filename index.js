
var fs = require("fs");
var configPath = "./config";
var configData = fs.readFileSync(configPath, "utf8");
var config = JSON.parse(configData);

var server = require("./modules/server");

// Run up server
if (config.is_server) {
	serverApp = server().run(config.server.port);
	console.log("Auto Deploy System is running...");

	serverApp.get('/', function(req, res) {
		res.send('Server.');
	});
}

// Run up client
if (config.is_client) {
	clientApp = server().run(config.client.port);
	console.log("Auto Deploy Client is listening...");

	clientApp.get('/', function(req, res) {
		res.status(403).send('');
	});
}
