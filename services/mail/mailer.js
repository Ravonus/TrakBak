'use strict';

"use strict";
const nodemailer = require("nodemailer"),
  asyncForEach = require('../../functions/asyncForEach'),
  fs = require('fs');

let config = {
  mail: require('../../config/mail.json')
}
class MailOptions {

  constructor(obj) {
    this.from = obj.from;
    this.to = obj.to;
    this.subject = obj.subject;
    this.text = obj.text;
    this.html = obj.html;
    this.attachments = obj.attachments;
  }

  async sendMail(transporter, obj) {
    let object = this;
    if (obj) object = obj
    let info = await transporter.sendMail(object).catch(e => e);

    if(info.messageId) console.log("Message sent: %s", info.messageId);
  }

}

//function for template building

async function templateBuild(templateName, template, count) {



  if (!count) count = 0;
  let attachments = [];
  let contents = await fs.readFileSync(`${__dirname}/templates/${templateName}/template.html`, "utf8");
  let regEx = [];
  let replaceValues = {};
  if (typeof template === "object") {

    await asyncForEach(Object.keys(template.replace), (key) => {
      let obj = {[key]:[template.replace[key]]}
      regEx.push(`{{${Object.keys(obj)}}}`);
      if (!Array.isArray(obj[Object.keys(obj)])) obj[Object.keys(obj)] = [obj[Object.keys(obj)]];
      replaceValues[`{{${Object.keys(obj)}}}`] = obj[Object.keys(obj)][count];
    });
  }
  contents = await contents.replace(new RegExp(regEx.join('|'), 'g'), (matched) => {
    return replaceValues[matched];
  });

  //Grab img tags and convert into base64. Plan to eventually check base64 variable and let people decide between hosting and or base64. (This way will send much more data via email.);
  let imgs = contents.match(/(<img \S([^>]+)>)/g);
  let matches = []
  if (Array.isArray(imgs)) {
    await Functions.asyncForEach(imgs, async img => {
      let src = await img.match(/src=[\"|\'](?!https?:\/\/)([^\/].+?)[\"|\']/);
      if(!src) return;

      src = src[0];
      src = src.substring(5, src.length - 1);
      let filename = src;
      let path = `${__dirname}/templates/${templateName}/${src}`;
      matches.push({
        tag: img,
        filename,
        path,
        src
      });
    });
    let array = [];
    await asyncForEach(matches, async (img, index) => {

      matches[index].cid = img.tag.replace(/src=[\"|\'](?!https?:\/\/)([^\/].+?)[\"|\']/, `src="cid:email-${index}"`);
      attachments.push({
        filename: matches[index].filename,
        path: matches[index].path,
        cid: `email-${index}`
      });

      array.push(matches[index].cid);

    });

    let mapObj = {};
    let mapArr = contents.match(/(<img \S([^>]+)>)/g);

    await Functions.asyncForEach(array, (value, index) => {
      mapObj[mapArr[index]] = value;
    });

    let newContent = contents.replace(/(<img \S([^>]+)>)/g, (matched) => {
      return mapObj[matched];
    });


    let newTemplate = newContent;

    return {
      template: newTemplate,
      attachments
    };

  }
}

// async..await is not allowed in global scope, must use a wrapper
async function mailer(options, template) {
  let count = 0;
  let templateName;

  if (template && typeof template === "string") {
    templateName = template;
  } else {
    templateName = template.name;
  }

  let ratelimit = options.ratelimit ? options.ratelimit : 60;
  let contents;
  let attachments = []



  // create reusable transporter object using the default SMTP transport
  let auth;
  if (config.mail.user) {
    auth = {
      user: config.mail.user,
      pass: config.mail.pass
    }
  }
  let transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    ignoreTLS: config.mail.ignoreTLS,
    secure: config.mail.secure, // true for 465, false for other ports
    auth
  });


  let mailOptions;

  let newTemplate = await templateBuild(templateName, template);



  options = Object.assign(options, {
    html: newTemplate.template ? newTemplate.template : contents,
    attachments: newTemplate.attachments
  });

  if (options.sendSeperate) {


    let object = options;


    let timeout = 0;
    if (typeof object.to === 'string') object.to = [object.to];

    await Functions.asyncForEach(object.to, async (to) => {



      let newObj = await templateBuild(templateName, template, count);
      count++;
      object.html = newObj.template;
      object.attachments = newObj.attachments;

      object.to = to;

      mailOptions = new MailOptions(object);


      // setup email data with unicode symbols
      timeout += 1000 / (ratelimit / 60);

      // mailOptions.sendMail(transporter);
      setTimeout(mailOptions.sendMail, timeout, transporter, mailOptions);


    })

  } else {
    mailOptions = new MailOptions(options);
    mailOptions.sendMail(transporter);
  }


  // let mailOptions = {
  //   from: options.from, // sender address
  //   to: options.to, // list of receivers
  //   subject: options.from, // Subject line
  //   text: options.text,
  //   html: newTemplate ? newTemplate : contents, // html body
  //   attachments
  // };

  // send mail with defined transport object
  // let info = await transporter.sendMail(mailOptions)

  // console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main().catch(console.error);

module.exports = mailer;