'use strict';

const DbService = require('moleculer-db');
const MongooseAdapter = require('moleculer-db-adapter-mongoose');
const CacheCleaner = require('../mixins/cache.cleaner.mixin');
const Client = require('../models/client.model');

module.exports = {
	name: 'clients',
	mixins: [DbService, CacheCleaner(['users'])],
	adapter: new MongooseAdapter(process.env.MONGO_URI || 'mongodb://localhost/connectbay-dev'),
	model: Client,
	metadata: {},
	actions: {
		/**
		 * find
		 * @param {String} username
		 * @param {String} password
		 */
		find: {
			params: {
				client_id: { type: 'string' }
			},
			async handler(ctx) {
				const { client_id } = ctx.params;
				return Promise.resolve()
				const client = await this.adapter.findOne({ client_id });
				return client;
			}
		}
	},

	events: {

	},

	methods: {
		seedDB() {
			this.logger.info('Seed Client DB...');
			return Promise.resolve()
				.then(() => this.adapter.insert({
					client_id: 'web',
					secret: 'secret',
				}));
		}
	},

	afterConnected() {
		return this.adapter.count().then(count => {
			if (count == 0) {
				this.seedDB();
			}
		});
	}
};
