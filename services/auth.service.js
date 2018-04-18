"use strict";

module.exports = {
	name: "auth",
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
				return this.waitForServices(["users"])
					.then(() => this.broker.call("users.create", { username, email, password }));
			}
		}
	},

	events: {

	},

	methods: {

	}
};
