const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    firstName: String,
    lastName: String
  },
  biography: String,
  password: String,
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


var User = mongoose.model('User', userSchema);

module.exports = User;