const mongoose = require('mongoose');

var authorSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
          firstName: String,
      lastName: String
  },
  biography: String,
  twitter: String,
  facebook: String,
  linkedin: String,
  profilePicture: Buffer,
  created: { 
      type: Date,
      default: Date.now
  }
});


var authorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
            firstName: String,
        lastName: String
    },
    biography: String,
    twitter: String,
    facebook: String,
    linkedin: String,
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


var Author = mongoose.model('Author', authorSchema);

module.exports = Author;