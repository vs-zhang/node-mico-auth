'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        index: true,
        lowercase: true,
        required: 'Username cannot be blank',
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        index: true,
        lowercase: true,
        required: 'Email cannot be blank'
    },
    hashed_password: {
        type: String,
        required: 'Password cannot be blank'
    },
    salt: {
        type: String,
        required: 'Salt cannot be blank'
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    toJSON: {
        transform: function(doc, ret) {
            const { _id: id, username, email, created_at, updated_at } = ret;
            return {
                id,
                username,
                email,
                created_at,
                updated_at
            };
        }
    }
});

UserSchema.index({'username': 'text'});

/**
 * Virtuals
 */

UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function(plainText) {
        console.log(plainText);
        console.log(this.encryptPassword(plainText));
        console.log(this.hashed_password);
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function() {
        return bcrypt.genSaltSync(10);
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function(password) {
        if (!password)
            return '';
        try {
            console.log(this.salt);
            console.log(password);
            return bcrypt.hashSync(password, this.salt);
        } catch (err) {
            return '';
        }
    }
};

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);
