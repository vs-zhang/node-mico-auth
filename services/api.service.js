'use strict';

const _ = require('lodash');
const ApiGateway = require('moleculer-web');
const E = require('moleculer-web').Errors;

module.exports = {
	name: 'api',
	mixins: [ApiGateway],
	settings: {
		port: process.env.PORT || 3000,
		routes: [{
            authorization: true,
			path: '/api',
			aliases: {
				'POST /auth/signup': 'auth.signup',
				'POST /auth/token': 'auth.token'
			}
		}],
		assets: {
			folder: 'public'
		}
	},
	methods: {
		authorize(ctx, route, req, res) {
			const auth = req.headers.authorization;
			if (!auth) {
				return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
			}
			const tmp = auth.split(' ');
			const buf = new Buffer(tmp[1], 'base64');
			const plain_auth = buf.toString();
			const [client_id, secret] = plain_auth.split(':');
			return ctx.broker.call('clients.find', { client_id }).then(client => {
				if (client.authenticate(secret)) {
					ctx.meta.client = {
						client_id,
						secret
					};
					return Promise.resolve(ctx);
				} else {
					return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
				}
			});
		}
	}
};
