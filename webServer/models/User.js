const mongoose = require('mongoose'),
  uniqueValidator = require("mongoose-unique-validator"),
  bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    firstName: String,
    lastName: String,
    username: { type: String, required: true, unique: true },
  },
  sessionJwt: String,
  biography: String,
  passwordHash: { type: String, required: true },
  groups: Number,
  permissions: Number,
  profilePicture: Buffer,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  jwtExpire: Number
});

UserSchema.methods.validPassword = function (password) {
  if (password)
    return bcrypt.compareSync(password, this.passwordHash);

};

UserSchema.virtual("password").set(function (value) {
  if (value)
  this.passwordHash = bcrypt.hashSync(value, bcrypt.genSaltSync(12));
});

UserSchema.plugin(uniqueValidator);
var User = mongoose.model('User', UserSchema);

module.exports = User;