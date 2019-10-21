'use strict';

const mongoose = require('mongoose'),
    uniqueValidator = require("mongoose-unique-validator"),
    crud = require('../controllers/mongoose/crud'),
    bcrypt = require('bcrypt-nodejs');

var modelName = 'Groups';

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    categories: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Categories'
    }],
    topics: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Topics'
    }],
    navigations: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Navigations'
      }],
    notifications: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Notifications'
    }],
    users: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    }],
    status: {
        type: Number,
        default: 1
    },
    permissions: Number,
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

schema.plugin(uniqueValidator);
var Model = mongoose.model(modelName, schema);

let crudObj = {
    m_create: crud.m_create(Model),
    m_read: crud.m_read(Model),
    m_update: crud.m_update(Model),
    m_delete: crud.m_delete(Model)
}

Model = Object.assign(Model, crudObj);

const options = {
    prefix: 'api',
    routes: {
        m_create: {
            
        },
        m_read: {

        },
        m_update: {

        },
        m_delete: {
            permissions: 1
        }
    }
}

module.exports = {
    [modelName]: Model,
    options
};