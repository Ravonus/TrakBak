'use strict';

//These are schemas that the system automatically loads into models and routes within the application. It will pick the schema name and the prefix to determine which routes the models are attached too.

const mongoose = require('mongoose'),
    uniqueValidator = require("mongoose-unique-validator"),
    crud = require('../controllers/mongoose/crud'),
    bcrypt = require('bcrypt-nodejs'),
    mailer = require('../services/mail/mailer');

var modelName = 'Messages';
var schema = new mongoose.Schema({

    type: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    ticket: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tickets',
    },
    recipients: [{
        type: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users'
        }
    }],
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

let Model = mongoose.model(modelName, schema);

let crudObj = {
    m_create: crud.m_create(Model),
    m_read: crud.m_read(Model),
    m_update: crud.m_update(Model),
    m_delete: crud.m_delete(Model)
}

Model = Object.assign(Model, crudObj);

//mongoose.modelSchemas[modelName] = Object.assign(Model, crudObj);

const options = {
    prefix: 'api',
    routes: {
        m_create: {

        },
        m_read: {
            permissions: 1
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