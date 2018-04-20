'use strict';

const { MoleculerError } = require('moleculer').Errors;

module.exports = {
	name: 'auth',
	settings: {},
	metadata: {},
	actions: {
		/**
		 * Signup
		 * @param {String} username
		 * @param {String} email
		 * @param {String} password
		 */
		signup: {
			handler(ctx) {
				const { username, email, password } = ctx.params;
				return this.waitForServices(['users'])
					.then(() => this.broker.call('users.create', { username, email, password }))
					.then(user => user.toJSON());
			}
		},
		/**
		 * Token
		 * @param {String} username
		 * @param {String} password
		 */
		token: {
			handler(ctx) {
				const { username, password } = ctx.params;
				return this.waitForServices(['users'])
					.then(() => this.broker.call('users.find', { username, password }))
					.then(user => {
						const isAuth = user.authenticate(password);
						if (!isAuth) {
							throw new MoleculerError('Unauthorized', 401);
						}
						return user.toJSON();
					});
			}
		}
	},

	events: {

	},

	methods: {

	}
};
