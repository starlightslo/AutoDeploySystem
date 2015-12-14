module.exports = function() {
	return {
		run: function(port, secret, isStaticRoute) {
			var express = require('express');
			var session = require('express-session');
			var app = express();
			var bodyParser = require('body-parser');

			// Set session
			//app.use(express.cookieParser());
			app.use(session({secret: secret}));

			// Set secret
			app.set('superSecret', secret);

			// Set static route
			if (isStaticRoute) {
				app.use(express.static('website'));
			}

			// Handle rawBoday
			app.use(function(req, res, next) {
				var contentType = req.headers['content-type'] || '', mime = contentType.split(';')[0];
				if ((mime != 'text/plain')) {
					return next();
				}

				req.rawBody = '';
				//req.setEncoding('utf8');

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
