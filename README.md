# Auto Deploy System
This is an auto deploy system develped by Node.js. You can setup multiple clients and commands on Auto Deploy System and integrate Jenkins to trigger deploy when there is an new push to GitHub.

This is my first product of Node.js, please give me some feedback, thank you and hope this software can help you guys.

# Install
 1. npm install
 2. sudo npm install -g nodemon
 3. sudo nodemon

# Configuration file
config.js:
 ```
module.exports = {
	'is_server': true,
	'server': {
		'port': 7777,
		'secret': 'ABCDEFG1234567890HIJKLMN',
		'username': 'admin',
		'password': 'admin',
	},
	'is_client': true,
	'client': {
		'port': 7778,
		'secret': 'ABCDEFG1234567890HIJKLMN'
	}
}
 ```

# Usage
 1. Login to Auto Deploy Management System.
  - http://localhost:7777/
 2. Configurate your clients and commands.
 3. Trigger server to deploy:
  - *Endpoint*: http://localhost:7777/deploy
  - *Parameters*: id={cliend id list}
    - Example: id=1,2,3
  - *Header*: Authorization  ADS username="{username of server}", password="{password of server}"
    - Example: Authorization  ADS username="admin", password="admin"
  - *Method*: POST
