'use strict';

const mongoose = require('mongoose'),
  uniqueValidator = require("mongoose-unique-validator"),
  countExists = require("../controllers/mongoose/plugins/countExists"),
  crud = require('../controllers/mongoose/crud'),
  bcrypt = require('bcrypt-nodejs');

var modelName = 'Permissions';

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  permissions: {
    type: Number,
    default: () => {
      return schema.count ? schema.count : schema.permissions;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

require('../controllers/mongoose/middleware/mongooseAutoMiddleware')(schema, modelName);

schema.plugin(countExists, {modelName});
schema.plugin(uniqueValidator);

let Model = mongoose.model(modelName, schema);

let crudObj = {
  m_create: crud.m_create(Model),
  m_read: crud.m_read(Model),
  m_update: crud.m_update(Model),
  m_delete: crud.m_delete(Model)
};

Model = Object.assign(Model, crudObj);

const options = new Promise((resolve, reject) => {
  resolve(require('../config/modelConfigs/Permissions.json'));
});

module.exports = {
  [modelName]: Model,
  options
};