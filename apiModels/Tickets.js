'use strict';

const mongoose = require('mongoose'),
    uniqueValidator = require("mongoose-unique-validator"),
    crud = require('../controllers/mongoose/crud'),
    bcrypt = require('bcrypt-nodejs'),
    modelName = 'Tickets',
    mailer = require('../services/mail/mailer');

var schema = new mongoose.Schema({
    
    type: {
        type: String,
        required: true
    },
    messages: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Messages'
    }],
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    categories: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Categories'
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

var Model = mongoose.model(modelName, schema);

let crudObj = {
    m_create: crud.m_create(Model),
    m_read: crud.m_read(Model),
    m_update: crud.m_update(Model),
    m_delete: crud.m_delete(Model)
}

Model = Object.assign(Model, crudObj);

mongoose.models[modelName] = Model;
//console.log(mongoose.models[modelName]);
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
    'Tickets':Model,
    options
};