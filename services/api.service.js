"use strict";

const _ = require("lodash");
const ApiGateway = require("moleculer-web");

module.exports = {
	name: "api",
	mixins: [ApiGateway],
	settings: {
		port: process.env.PORT || 3000,
		routes: [{
			path: "/api",
			aliases: {
				"POST /auth/signup": "auth.signup"
			},
			whitelist: [
				"*"
			]
		}],
		assets: {
			folder: "public"
		}
	}
};
