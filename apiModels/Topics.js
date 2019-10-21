'use strict';

//These are schemas that the system automatically loads into models and routes within the application. It will pick the schema name and the prefix to determine which routes the models are attached too.

const mongoose = require('mongoose'),
    uniqueValidator = require("mongoose-unique-validator"),
    crud = require('../controllers/mongoose/crud');

var modelName = 'Topics';
var schema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        require: true
    },
    permissions: Number,
    enabled: {
        type: Boolean,
        default: true
    },
    groups: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Groups'
    }],
    logo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Files'
    },
    img: {
        type: mongoose.Schema.ObjectId,
        ref: 'Files'
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Categories'
    },
    posts: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Posts'
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
schema.plugin(uniqueValidator);
let Model = mongoose.model(modelName, schema);

let crudObj = {
    m_create: crud.m_create(Model),
    m_read: crud.m_read(Model),
    m_update: crud.m_update(Model),
    m_delete: crud.m_delete(Model)
}

Model = Object.assign(Model, crudObj);

const options = new Promise((resolve) => {
    resolve(require('../config/modelConfigs/Topics.json'));
});

module.exports = {
    [modelName]: Model,
    options
};