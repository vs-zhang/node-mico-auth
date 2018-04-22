'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let ClientSchema = new Schema({
    client_id: {
        type: String,
        unique: true,
        index: true,
        lowercase: true,
        required: 'client_id cannot be blank',
        trim: true
    },
    secret: {
        type: String,
        trim: true,
        lowercase: true,
        required: 'secret cannot be blank'
    },
    active: {
        type: Boolean,
        default: true
    },
    allowed_origin: {
        type: String,
        default: '*'
    },
    refresh_token_time: {
        type: Number,
        default: 14400
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

ClientSchema.index({'client_id': 'text'});

/**
 * Methods
 */
ClientSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function(secret) {
        return this.secret === secret;
    }
};

ClientSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Client', ClientSchema);
