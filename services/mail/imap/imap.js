'use strict';

const Imap = require('imap'),
  systemNotification = require('../../notifications/systemNotifications'),
  mongoose = require('mongoose'),
  models = mongoose.models;

async function extractJSON(str) {
  var firstOpen, firstClose, candidate;
  firstOpen = str.indexOf('{', firstOpen + 1);
  do {
    firstClose = str.lastIndexOf('}');

    if (firstClose <= firstOpen) {
      return null;
    }
    do {
      candidate = str.substring(firstOpen, firstClose + 1);

      try {
        var res = JSON.parse(candidate);

        return [res, firstOpen, firstClose + 1];
      } catch (e) {

      }
      firstClose = str.substr(0, firstClose).lastIndexOf('}');
    } while (firstClose > firstOpen);
    firstOpen = str.indexOf('{', firstOpen + 1);
  } while (firstOpen != -1);
}

module.exports = (auth, options) => {
  if (!options) options = {};
  let imap = new Imap({
    user: auth.user,
    password: auth.password,
    host: auth.host,
    port: auth.port,
    tls: auth.tls ? auth.tls : false
  });


  imap.once("ready", execute);
  imap.once("error", function (err) {
    console.error("Connection error: " + err.stack);
  });

  imap.connect();

  function execute() {

    const Notification = require('../../notifications/userNotification');

    imap.openBox(options.folder ? options.folder : 'INBOX', false, function (err, mailBox) {
      if (err) {
        console.error(err);
        return;
      }
      imap.search(["ALL"], function (err, results) {
        if (!results || !results.length) {
          imap.end();
          return;
        }

        var f = imap.fetch(results, {
          bodies: ['HEADER.FIELDS (TO FROM SUBJECT DATE)', 'TEXT'],
          struct: true
        });

        let x = 1
        f.on('message', function (msg, seqno) {

          let header;
          let actualText;
          let objects = [];
          var message;
          var prefix = '(#' + seqno + ') ';
          msg.on('body', function (stream, info) {
            if (info.which === 'TEXT') var buffer = '';
            stream.on('data', function (chunk) {
              buffer += chunk.toString('utf8');
              if (!message) message = chunk
              else message += chunk;
            });
            stream.once('end', async function () {

              if (info.which !== 'TEXT')

                header = Imap.parseHeader(buffer);

              else {
                var text = buffer;
                let reg = new RegExp(`Content-Transfer-Encoding([\\s\\S]*?)${auth.user}`, 'i');

                let findText = text.match(reg);
                let jsonText = await text.replace(/=|\r?\n|\r|/g, '')


                let object = await extractJSON(jsonText);

                object = object && object.length > 0 ? object[0] : undefined;

                if (findText) {
                  let text = findText[0].split('\n');
                  findText = findText[0].split('\r');
                  text[findText.length - 1] = undefined;
                  text[0] = undefined;
                  actualText = text.join('\n');
                  actualText = actualText.replace(/=[a-zA-Z]?[0-9]*=[a-zA-Z]?[0-9]*=[a-zA-Z]?[0-9]*/g, '').replace(/Content-Disposition:(.*)/g, '').replace(/=3D/g, '=');;
                  objects.push(object);

                }

              }

            });
          });

          msg.once('attributes', function (attrs) {});
          msg.once('end', async function () {
            var email = header.undefinedfrom ? header.undefinedfrom[0].match(/<(.*?)>/)[0].substring(1, header.undefinedfrom[0].match(/<(.*?)>/)[0].length - 1) : header.from[0].match(/<(.*?)>/)[0].substring(1, header.from[0].match(/<(.*?)>/)[0].length - 1);

            let user = await models.Users.m_read({
              query: {
                email
              },
              type: "findOne"
            }).catch(e => console.log(e));

            if (user && objects && objects.length > 0) {
              var message = {
                "type": "ticket",
                "ticket": objects[0].id,
                "sender": user._id,
                "text": actualText
              };

              let socketInfo = {
                "script": "socketPush",
                "object": "ticket"
              };

              let messageDoc = await models.Messages.m_create({
                client: true,
                body: message,
                socketInfo,
                populate: 'sender'
              }).catch(e => {

                console.log(e);

              });

              if (messageDoc) {
                systemNotification('Messages', messageDoc.data);

                let notification = new Notification(messageDoc.data, message.text, {
                  model: models.Messages,
                  sender: user,
                  route: 'post'
                });
                // notfication.socketNotification()
                // notfication.emailNotification()
                notification.exec(['socketNotification', 'emailNotification']);

              }

            } else {

              //log here what went wrong
            }

            imap.seq.move(seqno, 'processed', (err, data) => {

              if (x === results.length) {

                imap.end();
              }
              x++;
            });

          });

        });
        f.once('error', function (err) {
          console.log('Fetch error: ' + err);
        });
        f.once('end', function () {

          //  imap.end();
        });
      });
    });
  }

}