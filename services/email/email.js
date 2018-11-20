'use strict';

/**
 * Email.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const _ = require('lodash');
const nodemailer = require('nodemailer');

module.exports = {

  send: async (options) => {
    
    return new Promise((resolve, reject) => {

      if(config.email.domain && config.email.account && config.email.account.indexOf('@') === -1 ) {
          config.email.account = `${config.email.account}@${config.email.domain}`
      }
      // create reusable transporter object using the default SMTP transport
      let secure = config.email.port === 465 ? true : false;
      let transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: secure , // true for 465, false for other ports
        auth: {
            user: config.email.account, 
            pass: config.email.pw || config.email.password
        }
    });

      // setup e-mail data with unicode symbols
      let mailOptions = {
        from: options.from ? options.from : config.email.from, // sender address
        to: options.to ? options.to : config.email.to, // list of receivers
        subject: options.subject ? options.subject : config.email.subject,
        html: options.template ? options.template : config.email.template
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
          reject([{ messages: [{ id: 'Auth.form.error.email.invalid' }] }]);
        }
       
        resolve(options.text);
      });
    });
  }
};