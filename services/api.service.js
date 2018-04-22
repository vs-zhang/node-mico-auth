'use strict';

const _ = require('lodash');
const ApiGateway = require('moleculer-web');

module.exports = {
	name: 'api',
	mixins: [ApiGateway],
	settings: {
		port: process.env.PORT || 3000,
		use: [
            (req, res, next) => {
				const auth = req.headers.authorization;
				if (!auth) {
					res.writeHeader(403, {'Content-Type': 'application/json'});
					return res.end(JSON.stringify({ error: 'unauthorization' }));
				}
				const tmp = auth.split(' ');
                const buf = new Buffer(tmp[1], 'base64');
                const plain_auth = buf.toString();
                const [client_id, secret] = plain_auth.split(':');
				req.$service.broker.call('clients.find', { client_id }).then(client => {
					if (client.authenticate(secret)) {
						next();
					} else {
						res.writeHeader(403, {'Content-Type': 'application/json'});
						return res.end(JSON.stringify({ error: 'unauthorization' }));
					}
				});
			}
        ],
		routes: [{
			path: '/api',
			aliases: {
				'POST /auth/signup': 'auth.signup',
				'POST /auth/token': 'auth.token'
			}
		}],
		assets: {
			folder: 'public'
		}
	}
};
