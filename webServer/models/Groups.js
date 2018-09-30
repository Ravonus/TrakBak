const mongoose = require('mongoose'),
  uniqueValidator = require("mongoose-unique-validator");

var GroupsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  permission: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

GroupsSchema.plugin(uniqueValidator);
var Groups = mongoose.model('Groups', GroupsSchema);

module.exports = Groups;
