'use strict';

const mongoose = require('mongoose'),
    ObjectID = require('mongoose').Types.ObjectId,
    mailer = require('../../../../services/mail/mailer');
module.exports = (model, compareName) => {

    return model.post('save', async (doc, next) => {

        doc = doc._doc ? doc._doc : doc;

        //automation of mongoose relationships. Anytime an update happens. This makes sure concurrent relationships get updated as well. 
        //example if Main mongo object as relationship of secondary object. If you add the objectID on the query. It will find objectID within sub object and add recently created/updated ID within it sub category.
        //If the other object does not have a relationship as well the other object nothing will happen.
        //You can also disable this for any column name. By creating an object under the mongoose model named rDisable.

        Object.keys(doc).forEach((schemaName) => {

            let ref, target;

            if (typeof doc[schemaName] === 'object' && schemaName === 'objects' && ObjectID(Object.keys(doc[schemaName])[0])) {

                let key = Object.keys(doc[schemaName])[0];

                ref = doc[schemaName][key].ref;

                if(doc[schemaName][key].target)  target = doc[schemaName][key].target;

            }

            try {
                if (ref === undefined) ref = model.paths[schemaName].options.ref ? model.paths[schemaName].options.ref : model.paths[schemaName].options.type && model.paths[schemaName].options.type[0] && model.paths[schemaName].options.type[0].ref ? model.paths[schemaName].options.type[0].ref : undefined;

                if (ref) {

                    let modelName = ref;
                    let modelSchema = mongoose.models[modelName];
                    let schemaList = mongoose.modelSchemas[modelName].paths ? mongoose.modelSchemas[modelName].paths : mongoose.models[modelName].schema.paths;

                    Object.keys(schemaList).forEach(async (deepSchemaName) => {
                        //   console.log(schemaList[deepSchemaName].options.type.ref, compareName)

                        if (schemaList[deepSchemaName].options.ref && schemaList[deepSchemaName].options.ref === compareName || schemaList[deepSchemaName].options.type && schemaList[deepSchemaName].options.type.ref === compareName) {
                            if(Array.isArray(doc[schemaName]) && doc[schemaName].length > 0 || ObjectID.isValid(doc[schemaName]) || deepSchemaName === target) 
                            modelSchema.m_update({
                                where: {
                                    _id: ( ObjectID.isValid(doc[schemaName]) || Array.isArray(doc[schemaName]) && doc[schemaName].length > 0) ? doc[schemaName] : Object.keys(doc[schemaName])[0]
                                },
                                body: {
                                    [deepSchemaName]: doc._id
                                }
                            });
                        } else if (schemaList[deepSchemaName].options.type[0] && schemaList[deepSchemaName].options.type[0].ref === compareName) {
                      
                            if(Array.isArray(doc[schemaName]) && doc[schemaName].length > 0 || ObjectID.isValid(doc[schemaName]) || deepSchemaName === target) 
                            modelSchema.m_update({
                                type: 'updateMany',
                                where: {
                                    _id: ( ObjectID.isValid(doc[schemaName]) || Array.isArray(doc[schemaName]) && doc[schemaName].length > 0) ? doc[schemaName] : Object.keys(doc[schemaName])[0]
                                },
                                body: {
                                    [deepSchemaName]: doc._id
                                },
                                push: true
                            }).catch(e => console.log(e));
                        }

                    });
                }
            } catch (e) {

            }

        });
        next();
    });
};