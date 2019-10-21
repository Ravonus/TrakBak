'use strict';

const mongoose = require('mongoose'),
    uniqueValidator = require("mongoose-unique-validator"),
    crud = require('../controllers/mongoose/crud'),
    fs = require('fs'),
    path = require('path'),
    bcrypt = require('bcrypt-nodejs');

var modelName = 'Users';

var schema = new mongoose.Schema({
    account: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    persons: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        middleName:String,
        address:String,
        city:String,
        state:String,
        zip:Number,
        bio:String
    },
    groups: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Groups'
    }],
    replies: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Replies'
    }],
    posts: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Posts'
    }],
    navigations: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Navigations'
    }],
    messages: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Messages'
    }],
    avatar: {
        type: mongoose.Schema.ObjectId,
        ref: 'Files'
    },
    status: {
        type: Number,
        default: 1
    },
    verified: String,
    biography: String,
    permissions: Number,
    profilePicture: Buffer,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    passwordHash: {
        type: String,
        required: true
    },
});

//This is mongoose middleware Scripts.
require('../controllers/mongoose/middleware/mongooseAutoMiddleware')(schema, modelName);

//Loading all schema custom methods. 
eval(fs.readFileSync(path.join(__dirname, '../', 'controllers/mongoose/schemaMethods', 'validPassword.js'), 'utf8'));

schema.plugin(uniqueValidator);
var Model = mongoose.model(modelName, schema);

let crudObj = {
    m_create: crud.m_create(Model),
    m_read: crud.m_read(Model),
    m_update: crud.m_update(Model),
    m_delete: crud.m_delete(Model)
};

Model = Object.assign(Model, crudObj);

const options = new Promise((resolve, reject) => {
    resolve(require('../config/modelConfigs/Users.json'));
});

module.exports = {
    [modelName]: Model,
    options
};