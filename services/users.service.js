'use strict';

const DbService = require('moleculer-db');
const MongooseAdapter = require('moleculer-db-adapter-mongoose');
const CacheCleaner = require('../mixins/cache.cleaner.mixin');
const User = require('../models/user.model');

module.exports = {
	name: 'users',
	mixins: [DbService, CacheCleaner(['users'])],
	adapter: new MongooseAdapter(process.env.MONGO_URI || 'mongodb://localhost/connectbay-dev'),
	model: User,
	metadata: {},
	actions: {
		/**
		 * Create
		 * @param {String} username
		 * @param {String} email
		 * @param {String} password
		 */
		create: {
			params: {
				username: { type: 'string' },
				email: { type: 'string' },
				password: { type: 'string' }
			},
			async handler(ctx) {
				const { username, email, password } = ctx.params;
				return await this.adapter.insert({
					username,
					email,
					password,
				});
			}
		},
		/**
		 * find
		 * @param {String} username
		 */
		find: {
			params: {
				username: { type: 'string' }
			},
			async handler(ctx) {
				const { username } = ctx.params;
				return await this.adapter.findOne({ username: username });
			}
		}
	},

	events: {

	},

	methods: {

	}
};
