'use strict';

const mongoose = require('mongoose'),
    uniqueValidator = require("mongoose-unique-validator"),
    crud = require('../controllers/mongoose/crud');

var modelName = 'Notifications';

var schema = new mongoose.Schema({
    type: {
        type: Number,
        requred: true
    },
    actions: {
        type: Object,
        required: true
    },
    templates: {
        type: Object
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    },
    link: Boolean,
    text: {
        type: String,
        required: true
    },
    tickets: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Tickets'
    }],
    groups: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Groups'
    }],
    users: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    }],
    messages: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Messages'
    }],
    enabled: {
        type: Boolean,
        default: true
    },
    status: {
        type: Boolean,
        default: true
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
            permissions: 1
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