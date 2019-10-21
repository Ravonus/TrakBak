'use strict';
const mongoose = require('mongoose'),
mailer = require('../mail/mailer');

//The system notification mailer... Not recommended to use vs database notification system. (Users can't turn this off or format it to their needs)  Also requires entry for each model. or else crashes can happen.

//Really should be used for outside account notifications. (Emails that do not reside as users within application)

module.exports = async (modelName, doc) => {

    if (config.mail.notifications && config.mail.notifications[modelName]) {

        let emails = config.mail.notifications[modelName].emails ? config.mail.notifications[modelName].emails : [];
        let users = config.mail.notifications[modelName].users ? config.mail.notifications[modelName].users : 'Admin';

        var object = {
            link: modelName === 'Tickets' ? `${hostname}/ticket/${doc._id}` : modelName === 'Messages' && doc.ticket ? `${hostname}/ticket/${doc.ticket}?mid=${doc._id}?` : `${hostname}/${doc._id}`,
            msg: modelName === 'Tickets' ? doc.messages[0] : modelName === 'Messages' && doc.ticket ? doc.text : doc.text,
            subject: modelName === 'Tickets' ? 'Email contact form' : modelName === 'Messages' && doc.ticket ? 'New message on ticket' : 'Whatevet this subject will be.',
            ticketNumber: modelName === 'Tickets' ? doc._id : modelName === 'Messages' && doc.ticket ? doc.ticket : undefined
        }
        let ticket;
        if (modelName === 'Messages' && doc.ticket) ticket = await mongoose.models.Tickets.m_read({
            query: {
                _id: doc.ticket
            },
            type: 'findById',
            populate: "owner",
            excludes: "-messages -owner.messages"
        }).catch(e => console.log(e));

        object.from = ticket ? ticket.owner.account : doc.owner.account;
        object.email = ticket ? ticket.owner.email : doc.owner.email;
        object.type = ticket ? ticket.type : doc.type;

        mailer({
            sendSeperate: true,
            ratelimit: 120,
            subject: `New ticket generated #${doc._id}`,
            from: config.mail.user,
            to: emails
        }, {
            name: 'newTicket',
            replace: {
                server: "TechnomancyIT",
                link: object.link,
                user: users,
                ticketMessage: object.msg,
                ticketNumber: object.ticketNumber,
                ticketSubject: object.subject,
                fromEmail: object.email,
                fromName: object.from,
                type: object.type
            }

        });
    }

}