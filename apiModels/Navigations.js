'use strict';

const mongoose = require('mongoose'),
  uniqueValidator = require("mongoose-unique-validator"),
  crud = require('../controllers/mongoose/crud'),
  bcrypt = require('bcrypt-nodejs');

var modelName = 'Navigations',
  modelConfig = require('../config/modelConfigs/Navigations.json'),
  schemaObject = Functions.templateLiterals(modelConfig.schema),
  schema = new mongoose.Schema(schemaObject);

delete modelConfig.schema;

require('../controllers/mongoose/middleware/mongooseAutoMiddleware')(schema, modelName);

schema.plugin(uniqueValidator);
var Model = mongoose.model(modelName, schema);

let crudObj = {
  m_create: crud.m_create(Model),
  m_read: crud.m_read(Model),
  m_update: crud.m_update(Model),
  m_delete: crud.m_delete(Model)
};

Model = Object.assign(Model, crudObj);

const options = new Promise(resolve => resolve(modelConfig));

module.exports = {
  [modelName]: Model,
  options
};