module.exports = function() {
	return {
		run: function(port) {
			var express = require('express');
			var app = express();
			var bodyParser = require('body-parser');

			// Set static route
			app.use(express.static(__dirname+'/website'))

			// Handle rawBoday
			app.use(function(req, res, next) {
			  req.rawBody = '';
			  req.setEncoding('utf8');

			  req.on('data', function(chunk) { 
			    req.rawBody += chunk;
			  });

			  req.on('end', function() {
			    next();
			  });
			});

			// Handle body
			app.use(bodyParser());

			app.listen(port);
			return app;
		}
	}
}
