'use strict';

const mongoose = require('mongoose');

module.exports = (model, modelName) => {

  if (!model.lastQuery) model.lastQuery = {}
  return model.pre('save', function (next) {

    next();
  });

}