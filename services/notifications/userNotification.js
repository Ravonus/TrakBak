'use strict';

const mongoose = require('mongoose'),
    mailer = require('../mail/mailer'),
    Notifications = mongoose.models.Notifications;



class Notification {

    constructor(doc, text, options) {
        this.doc = doc;
        this.sender = options.sender;
        this.text = text;
        this.promises = [];
        this.route = options.route;
        this.rooms = options.rooms;
        this.recipients = options.recipients;
        this.model = options.model;
    }

    async checkDoc(doc) {

        return doc.type ? doc[doc.type] : doc._id;

    }

    async emailVariables(template, doc) {

        if(!template) return;

        let newTemplate = {};

        await Functions.asyncForEach(Object.keys(template), async key => {
            
                if(key === 'table') newTemplate[key] = doc.variables.table;
                if(key === 'item') newTemplate[key] = doc.variables.item ? doc.variables.item : doc.variables.table; 
                if(key === 'id') newTemplate[key] = doc.variables.id;
                if(key === 'objId') newTemplate[key] = doc.variables.msgId;
                if(key === 'server') newTemplate[key] = 'TechnomancyIT';
                if(key === 'user') newTemplate[key] = doc.user.account;
                if(key === 'link') newTemplate[key] = doc.variables.link;
                if(key === 'text') newTemplate[key] = doc.variables.table === "Tickets" 
                ? !doc.owner ? `There was a new message added on ticket# ${doc.variables.id}.<br>User ${this.sender.account} has sent this message:<br>${this.text}`:
                `There was a new message added on your ticket# ${doc.variables.id}.<br>User ${this.sender.account} has sent this message:<br>${this.text}`
                : doc.table === "Messages" 
                ? "This is what you say about messages" : "Can't find?"
        });

        return newTemplate;
        
    }

    async socketNotification(doc, variables) {

        this.promises.push(new Promise(async (resolve, reject) => {

            resolve({
                sockets: doc
            })

        }));

    }

    async emailNotification(doc, other) {
        let name;
        if(doc.owner && doc.templates) {
            name = doc.templates.owner
        } else {
            name = doc.templates.everyone
        }

        let push = Object.assign(doc, other);

        var replace = await this.emailVariables(config.mail.templates[name], push);
    
        this.promises.push(new Promise(async (resolve, reject) => {
            mailer({
                subject: `An update in ${other.variables.table} on item ${other.variables.item} has happened.`,
                from: config.mail.user,
                to: doc.user.email
            }, {
                name,
                replace

            });

            resolve({
                emails: doc
            })

        }));

    }

    schedule() {

    }

    async findNotifications(type) {
        let typeArr = []
        if (type === 'both') {
            typeArr[0] = 'sockets',
                typeArr[1] = 'email';
        }

        if (this.notifications) return this.notifications

        //layer one is global notifications. after this information will be used to look for user notiifcaitons that will overide these.
      
        let layerOne = await Notifications.m_read({
            query: {
                type: 0,
                enabled: true
            },
            populate: "groups",
            deep: {
                groups: 'users'
            }
        }).catch(e => console.log(e));

        let users = {
            variables: {

            },
            sender:this.doc.sender
        };
        let global = [];
        if (layerOne) {

            layerOne.forEach((notification) => {
             
                if (notification.actions[this.model.modelName]) {
                    users.variables.table = this.model.modelName;
     
                    users.variables.id = this.doc._id;
                    // if(!users[this.doc.owner]) users[this.doc.owner] = {owner:true}
                    // users[this.doc.owner] = this.doc.owner !== this.sender ? users[this.doc.owner].status = true :  users[this.doc.owner].status = false;
                    notification.groups.forEach(group => {

                        if (notification.actions[this.route] || notification.actions.all) group.users.forEach(user => users[user._id.toString()] =
                            this.sender._id.toString() !== user._id.toString() &&
                            !users[user._id.toString()] &&
                            notification.actions[typeArr[0]] ||
                            this.sender._id.toString() !== user._id.toString() &&
                            !users[user._id.toString()] &&
                            notification.actions[typeArr[1] ? typeArr[1] : typeArr[0]] ||
                            this.sender._id.toString() !== user._id.toString() &&
                            notification.actions[typeArr[0]] &&
                            users[user.id.toString()].status === true ||
                            this.sender._id.toString() !== user._id.toString() &&
                            notification.actions[typeArr[1] ? typeArr[1] : typeArr[0]] &&
                            users[user._id].status === true ? {
                                user,
                                templates: {
                                    owner: notification.templates.owner,
                                    everyone: notification.templates.everyone
                                },
                                status: notification.status,
                                sockets: notification.actions.sockets,
                                email: notification.actions.email
                            } : {
                                status: false
                            });

                    });
                }

            });
        }

        //This is how it finds secondary notification objects (Certain objects dont have user information attached to them, so the system needs to find the parent to find the owner and anyone else that may have accesss)
        var _id = this.doc.type ? this.doc[this.doc.type] : this.doc._id;      
        let pathName = this.doc.type;
        let modelName, object;
        if (pathName && this.model.schema.paths[pathName]) {
            modelName = this.model.schema.paths[pathName].options.ref;
            object = await mongoose.models[modelName].m_read({
                query: {
                    _id
                },
                type: 'findById',
                populate: 'categories owner',
                deep: {
                    categories: 'groups'
                }
            });
        }

        if (object) {
            users.variables.id = object._id;
            users.variables.msgId = this.doc._id;

            //This is the layerTwo which is the secondary global notification check. Should now be able to do same request as above, but now knowing what the parent object is.
            let layerTwo = await Notifications.m_read({
                query: {
                    type: 0,
                    enabled: true
                },
                populate: "groups",
                deep: {
                    groups: 'users'
                }
            }).catch(e => console.log(e));
            if (layerTwo) {

                layerTwo.forEach((notification) => {

                    if (notification.actions[modelName]) {
                        users.variables.table = modelName;
                        users.variables.item = this.model.modelName;
                        notification.groups.forEach(group => {

                            if (notification.actions[this.route] ||
                                notification.actions.all) group.users.forEach(user => users[user._id.toString()] =
                                    this.sender._id.toString() !== user._id.toString() &&
                                    !users[user._id.toString()] &&
                                    notification.actions[typeArr[0]] ||
                                    this.sender._id.toString() !== user._id.toString() &&
                                    !users[user._id.toString()] &&
                                    notification.actions[typeArr[1] ? typeArr[1] : typeArr[0]] ||
                                    this.sender._id.toString() !== user._id.toString() &&
                                    notification.actions[typeArr[0]] &&
                                    users[user.id.toString()].status === true ||
                                    this.sender._id.toString() !== user._id.toString() &&
                                    notification.actions[typeArr[1] ? typeArr[1] : typeArr[0]] &&
                                    users[user.id.toString()].status === true ? {
                                    user,
                                    templates: {
                                        owner: notification.templates.owner,
                                        everyone: notification.templates.everyone
                                    },
                                    status: notification.status,
                                    sockets: notification.actions.sockets,
                                    email: notification.actions.email
                                } : {
                                    status: false
                                });

                        });
                    }

                });
            }

            //This is the third layer (User layer) any global notiifcations will be replaced with user defaults.

            await Functions.asyncForEach(Object.keys(mongoose.models[modelName].schema.paths), async (key) => {

                let schema = mongoose.models[modelName].schema.paths[key];
                let ref = schema.options.type && schema.options.type[0] ? schema.options.type[0].ref : schema.options.ref;

                //this finds the owner
                let notification = layerOne ? layerOne[0] : layerTwo[0];

                if (ref === 'Users' && this.sender._id.toString() !== object[key]._id.toString()) users[object[key]._id.toString()] = {
                    user: object[key],
                    status: true,
                    owner: true,
                    [type]: true,
                    templates: {
                        owner: notification.templates.owner,
                        everyone: notification.templates.everyone
                    },
                    status: notification.status,
                    sockets: notification.actions.sockets,
                    email: notification.actions.email
                }

                if (ref === 'Categories') object[key].forEach(categories => {
                  //  categories.groups.forEach(group => console.log(group.users))
                });

            });

            if (object.categories) {

            }

        }

        this.notifications = users;
        return users;

    }

    async exec(functions) {

        let notifications = await this.findNotifications('both');
 
        if (notifications) {

            let seperate = {
                sender: notifications.sender,
                variables: notifications.variables
            }

            delete notifications.sender;
            delete notifications.variables;

            Object.keys(notifications).forEach(async (key) => {
                let value = notifications[key];      

                if (value.sockets && functions.includes('socketNotification')) this.socketNotification(value, seperate);
                if (value.email && functions.includes('emailNotification')) this.emailNotification(value, seperate);

            });

        }

        Promise.all(this.promises).then(async (values) => {
            // console.log(this.notifications);
            // console.log(values);
        });
    }

}

module.exports = Notification;