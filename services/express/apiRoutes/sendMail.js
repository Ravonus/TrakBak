'use strict';
const express = require('express'),
    mongoose = require('mongoose'),
    models = mongoose.models,
    systemNotification = require('../../notifications/systemNotifications'),
    server = require('../server').app,
    emailExistence = require('email-existence'),
    randomstring = require("randomstring"),
    mailer = require('../../../services/mail/mailer'),
    swearjar = require('swearjar'),
    Verifier = require("email-verifier"),
    {
        Tickets
    } = require("../../../apiModels/Tickets"),
    cookie = require('cookie'),
    {
        promisify
    } = require("util"),
    jwt = require('jsonwebtoken'),
    {
        Users
    } = require('../../../apiModels/Users'),
    router = express.Router()
const Notification = require('../../notifications/userNotification');

let verifier = new Verifier("at_VLZKJ87dDSp9lQEGjMGPzW71bh4f8");

let hostname;
if (config.express.port) {
    hostname = `${config.express.hostname}:${config.express.port}`
} else {
    hostname = config.express.hostname;
}

verifier.verify = promisify(verifier.verify);
emailExistence.check = promisify(emailExistence.check);

var pathSet = '/';
router.route(pathSet).post(async (req, res) => {

    let verifiedEmail = {};
    let emailExists;
    let error = {};
    let profanity = (swearjar.profane(req.body.email) || swearjar.profane(req.body.message) || swearjar.profane(req.body.name));
    if (!profanity) emailExists = await emailExistence.check(req.body.email).catch(e => console.log(e));
    if (emailExists) {
        verifiedEmail = await verifier.verify(req.body.email).catch(e => e);
        verifiedEmail.smtpCheck = (verifiedEmail.smtpCheck === 'true');
        verifiedEmail.formatCheck = (verifiedEmail.formatCheck === 'true');
        verifiedEmail.dnsCheck = (verifiedEmail.dnsCheck === 'true');
        verifiedEmail.freeCheck = (verifiedEmail.freeCheck === 'true');
        verifiedEmail.disposableCheck = (verifiedEmail.disposableCheck === 'true');
        verifiedEmail.catchAllCheck = (verifiedEmail.catchAllCheck === 'true');

        if (verifiedEmail.formatCheck && verifiedEmail.smtpCheck && verifiedEmail.dnsCheck && !verifiedEmail.disposableCheck && !verifiedEmail.catchAllCheck || verifiedEmail.formatCheck && verifiedEmail.freeCheck && verifiedEmail.dnsCheck && !verifiedEmail.disposableCheck && !verifiedEmail.catchAllCheck) {

            let randomPassword = randomstring.generate(32);
            let user = await models.Users.m_create({
                query: {
                    account: req.body.email,
                    email: req.body.email,
                    status: 2,
                    permissions: 2,
                    password: randomPassword
                }
            }).catch(e => console.log(e));

            let sender = user ? user._id : await models.Users.m_read({
                query: {
                    email: req.body.email
                },
                type: 'findOne'
            }).catch(e => e);

            if (sender && typeof sender === 'object') sender = sender._id
            var ticketID = mongoose.Types.ObjectId();
            var messageID = mongoose.Types.ObjectId();
            let message = models.Messages.m_create({
                query: {
                    type: "ticket",
                    sender,
                    ticket: ticketID,
                    text: req.body.message
                },
                noNotification: true
            }).catch(e => console.log(e));

            let socketInfo = {
                "script": "socketPush",
                "name": "tickets"
            }

            let ticket = await models.Tickets.m_create({
                body: {
                    _id: ticketID,
                    status: 1,
                    categories: "5c93252638d1d421e95defdd",
                    type: req.body.type,
                    owner: sender
                },
                populate: "owner",
                excludes: "-messages",
                socketInfo
            }).catch(e => {
                console.log(e);
                error.err = "Could not create contact ticket"
            });

            if (ticket) {

                systemNotification('Tickets', ticket);
                let notfication = new Notification(ticket, req.body.message, {
                    model: models.Tickets,
                    sender: ticket.owner,
                    route: 'post'
                });

                notfication.exec(['socketNotification', 'emailNotification']);
                switch (req.body.template) {
                    case "general":
                        await mailer({
                            subject: "Recieved your request. You may email back to this",
                            from: config.mail.user,
                            to: req.body.email
                        }, {
                            name: 'emailTicket',
                            replace: {
                                server: "TechnomancyIT",
                                link: `${hostname}/ticket/?vreply=${ticket._id}`,
                                user: req.body.name,
                                id: ticketID,
                                msgId: messageID
                            }
                        });
                        break;

                    default:

                        break;
                }
            }

        } else {

            error.err = profanity ? "Could not send email. Please check profanity inside message, and email address." : "Could not verify your email address to send email."

            error.profanity = profanity;
        }

    }

    if (error.err) {

        return res.status(401).send({
            alert: {
                title: 'Sending email',
                type: "error",
                text: error.err
            }
        });

    }

    return res.status(200).send(JSON.stringify({}));

});

server.post('/mailer', server.policy(true), router);