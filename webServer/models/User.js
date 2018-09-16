const mongoose = require('mongoose'),
uniqueValidator = require("mongoose-unique-validator"),
bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    firstName: String,
    lastName: String
  },
  biography: String,
  passwordHash: String,
  groups: Number,
  permissions: Number,
  profilePicture: Buffer,
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 12);
});

var User = mongoose.model('User', UserSchema);

module.exports = User;