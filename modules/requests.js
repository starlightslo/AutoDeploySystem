module.exports = function() {
	return {
		https: function() {
			var https = require('https');
			return {
				options: {
					port: '443'
				},
				post: function(host, endpoint, data, callback) {
					this.options.host = host;
					this.options.path = endpoint;
					this.options.method = 'POST';
					this.options.headers = {
						'Content-Type': 'text/plain; charset=utf-8',
						'Content-Length': Buffer.byteLength(data)
					}

					// Set up the request
					var post_req = https.request(this.options, callback);

					// post the data
					post_req.write(data);
					post_req.end();
				}
			}
		},
		http: function() {
			var http = require('http');
			return {
				options: {},
				post: function(host, endpoint, port, data, callback) {
					this.options.host = host;
					this.options.path = endpoint;
					this.options.port = port;
					this.options.method = 'POST';
					this.options.headers = {
						'Content-Type': 'text/plain; charset=utf-8',
						'Content-Length': Buffer.byteLength(data)
					}

					// Set up the request
					var post_req = http.request(this.options, callback);

					// post the data
					post_req.write(data);
					post_req.end();
				}
			}
		}
	}
}
