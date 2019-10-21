'use strict';

const mongoose = require('mongoose'),
    ObjectID = require('mongoose').Types.ObjectId,
    mailer = require('../../../../services/mail/mailer');

module.exports = (model, compareName) => {

    return model.pre('deleteOne', async function (next) {

        let that = this;

        async function grabDoc(_id, model) {
            let doc = await model.m_read({
                type: "findOne",
                query: {
                    _id
                }
            }).catch(e => console.log(e));
            return doc;
        }

        let _id = this.getQuery()._id;
        let deletedSchemaPaths = this.schema.paths;

        await Functions.asyncForEach(Object.keys(deletedSchemaPaths), (schemaName) => {

            try {
                let ref = model.paths[schemaName].options.ref ? model.paths[schemaName].options.ref : model.paths[schemaName].options.type && model.paths[schemaName].options.type[0] && model.paths[schemaName].options.type[0].ref ? model.paths[schemaName].options.type[0].ref : undefined;

                if (ref) {

                    let modelName = ref;
                    let modelSchema = mongoose.models[modelName];
                    let schemaList = mongoose.modelSchemas[modelName].paths ? mongoose.modelSchemas[modelName].paths : mongoose.models[modelName].schema.paths;
                    let readDoc = '';
                    Object.keys(schemaList).forEach(async (deepSchemaName) => {

                        if (schemaList[deepSchemaName].options.ref && schemaList[deepSchemaName].options.ref === compareName || schemaList[deepSchemaName].options.type && schemaList[deepSchemaName].options.type.ref === compareName) {

                            if (readDoc === '')
                                readDoc = await grabDoc(_id, that.model);

                            modelSchema.m_update({
                                where: {
                                    _id: readDoc[schemaName][0]
                                },
                                body: {
                                    $unset: {
                                        [deepSchemaName]: 1
                                    }
                                }
                            }).catch(e => console.log(e));


                        } else if (schemaList[deepSchemaName].options.type[0] && schemaList[deepSchemaName].options.type[0].ref === compareName) {


                            if (readDoc === '') readDoc = await grabDoc(_id, that.model).catch(e => console.log(e));

                            if (readDoc && readDoc[schemaName] && readDoc[schemaName].length > 0 || readDoc && readDoc[schemaName] && ObjectID.isValid(readDoc[schemaName])) {


                                modelSchema.m_update({
                                    type: 'updateMany',
                                    where: {
                                        _id: readDoc[schemaName]
                                    },
                                    body: {
                                        [deepSchemaName]: [_id]
                                    },
                                    pull: true
                                }).catch(e => console.log(e));

                            }
                        }

                    });

                }

            } catch (e) {

            }

        });
        next();

    });
};