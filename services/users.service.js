"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const bcrypt = require("bcrypt");
const CacheCleaner = require("../mixins/cache.cleaner.mixin");
const User = require("../models/user.model");

function hashPassword(password) {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(10, function (error, salt) {
			if (error) {
				return reject(error);
			}

			bcrypt.hash(password, salt, function (error, hashedPassword) {
				if (error) {
					return reject(error);
				}

				resolve(hashedPassword);
			});
		});
	});
}

module.exports = {
	name: "users",
	mixins: [DbService, CacheCleaner(["users"])],
	adapter: new MongooseAdapter(process.env.MONGO_URI || "mongodb://localhost/connectbay-dev"),
	settings: {
		fields: ["_id", "username", "email"]
	},
	model: User,
	metadata: {},
	actions: {
		/**
		 * Signup
		 * @param {String} username
		 * @param {String} email
		 * @param {String} password
		 */
		create: {
			params: {
				username: { type: "string" },
				email: { type: "string" },
				password: { type: "string" }
			},
			handler(ctx) {
				const { username, email, password } = ctx.params;
				return Promise.resolve()
					.then(() => this.adapter.insert({
						username,
						email,
						password: "john1234",
					})).then(() => {
						return "user created";
					});
			}
		}
	},

	events: {

	},

	methods: {

	}
};
