'use strict';

const { MoleculerError } = require('moleculer').Errors;

module.exports = {
	name: 'auth',
	settings: {},
	actions: {
		/**
		 * Signup
		 * @param {String} username
		 * @param {String} email
		 * @param {String} password
		 */
		signup: {
			async handler(ctx) {
				const { username, email, password } = ctx.params;
				await this.waitForServices(['users']);
				const user = await this.broker.call('users.create', { username, email, password });
				return user.toJSON();
			}
		},
		/**
		 * Token
		 * @param {String} username
		 * @param {String} password
		 */
		token: {
			async handler(ctx) {
				const { username, password } = ctx.params;
				const { client } = ctx.meta;
				await this.waitForServices(['users']);
				const user = await this.broker.call('users.find', { username, password });
				const isAuth = user.authenticate(password);
				if (!isAuth) {
					throw new MoleculerError('Unauthorized', 401);
				}
				return user.toJSON();
			}
		}
	},

	events: {

	},

	methods: {

	}
};
