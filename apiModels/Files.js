'use strict';

const mongoose = require('mongoose'),
    uniqueValidator = require("mongoose-unique-validator"),
    fileExists = require("../controllers/mongoose/plugins/fileExists"),
    crud = require('../controllers/mongoose/crud'),
    bcrypt = require('bcrypt-nodejs');

const modelConfig = require('../config/modelConfigs/Files.json');

var modelName = 'Files';

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    directory: {
        type: String
    },
    size: {
        type: Number,
        required: true
    },
    buffer: {
        type: Buffer
    },
    symlink: {
        type: Boolean,
        default: false
    },
    objects: {
        postScript: "fileRelationships",
        type: {
            [mongoose.Schema.ObjectId]: {
                ref: String
            }
        }
    },
    permissions: {
        type: Number
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
schema.plugin(fileExists);
var Model = mongoose.model(modelName, schema);

let crudObj = {
    m_create: crud.m_create(Model),
    m_read: crud.m_read(Model),
    m_update: crud.m_update(Model),
    m_delete: crud.m_delete(Model)
}

Model = Object.assign(Model, crudObj);


const options = new Promise((resolve, reject) => {
    resolve(require('../config/modelConfigs/Files.json'));
});

module.exports = {
    [modelName]: Model,
    options
};