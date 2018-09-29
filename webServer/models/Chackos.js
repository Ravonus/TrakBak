const mongoose = require('mongoose'),
  uniqueValidator = require("mongoose-unique-validator");

var ChackosSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  gay: Boolean,
  jewish: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

ChackosSchema.plugin(uniqueValidator);
var Chackos = mongoose.model('Chackos', ChackosSchema);

module.exports = Chackos;