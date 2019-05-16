'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment-timezone');

const Schema = mongoose.Schema;
const oAuthTypes = ['github', 'twitter', 'google', 'linkedin'];
/**
 * User Schema
 */

const UserSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: false,
    },
    active_token: {
      type: String,
    },
    active_token_expire: {
      type: Date,
      default: moment().add(process.env.ACTIVE_TOKEN_EXPIRE_TIME, 'days'),
    },
    requested_in_comming: [
      {
        type: Schema.ObjectId,
        ref: 'User',
      },
    ],
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Virtuals
 */
const validatePresenceOf = value => value && value.length;

/**
 * Virtuals
 */

UserSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

/**
 * Validations
 */

/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password) && !this.skipValidation()) {
    next(new Error('Invalid password'));
  } else {
    next();
  }
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
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  /**
   * Validation is not required if using OAuth
   */

  skipValidation: function() {
    return ~oAuthTypes.indexOf(this.provider);
  },

  comparePassword: function(password) {
    return this.encryptPassword(password) !== this.hashed_password;
  },

  updatePassword: function(newPassword) {
    try {
      this.hashed_password = this.encryptPassword(newPassword);
      this.save();
    } catch (err) {
      throw new Error(err);
    }
  },
};

/**
 * Statics
 */

UserSchema.statics = {
  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function(options, cb) {
    options.select = options.select || 'name username hashed_password salt';
    return this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  },

  getMyContactRequest: function(userId, options) {
    let limit = options.limit;
    const page = options.page || 0;
    return this.find(
      {
        _id: userId,
      },
      { name: 1, requested_in_comming: { $slice: [limit * page, limit] } }
    )
      .populate({
        path: 'requested_in_comming',
        select: { avatar: 1, name: 1, _id: 1, email: 1 },
      })
      .exec();
  },

  getAllContactRequest: function(userId) {
    return this.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(userId) } },
      {
        $project: {
          number_of_contact: {
            $cond: { if: { $isArray: '$requested_in_comming' }, then: { $size: '$requested_in_comming' }, else: 0 },
          },
        },
      },
    ]);
  },
};

mongoose.model('User', UserSchema);
