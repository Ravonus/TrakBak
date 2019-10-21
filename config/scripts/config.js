'use strict';

const { promisify } = require('util'),
  fs = require('fs');


fs.readdir = promisify(fs.readdir);
let files = fs.readdirSync('./config/');

global.Functions = {};

let bash = new Promise(async (resolve) => {
  let bash;
  if (!files.includes('bash.json')) {
    bash= require('../../setup/bash.json');
    fs.writeFileSync('./config/bash.json', JSON.stringify(bash, null, 4));
  } else {
    bash = require('../bash.json'); 
  }

  //This sets up threading for the application (Auto will setup max cpu threads+hyperthreading)(softwareOff turns hyperthreading off)
  if (bash.threads === 'auto') {
    process.env.UV_THREADPOOL_SIZE = Math.ceil(Math.max(4, require('os').cpus().length * 1));
  } else if (typeof (bash.threads) === 'number') {
    process.env.UV_THREADPOOL_SIZE = environmentToExport.threads;
  } else if (bash.threads === 'softwareOff') {
    process.env.UV_THREADPOOL_SIZE = Math.ceil(Math.max(4, require('os').cpus().length * 1) / 2);

  }

  resolve(bash);
});

let functionDir = fs.readdir('./functions/');
let functionsDone = new Promise(async (resolve) => {
  functionDir.then((functions) => {

    functions.forEach(async (func, index) => {
      var extension = func.match(/(?:\.([^.]+))?$/)[0];
      if (extension === '.js') {
        var name = func.slice(0, -3);
        global.Functions[name] = await require(`../../functions/${func}`);
      }

      if (index === functions.length - 1) {
        resolve(true);
        functionsDone = true;
      }

    });
  }).catch(err => console.log(err));
});


let mail = new Promise(async (resolve) => {
  let mail;
  if (!files.includes('mail.json')) {
    mail = require('../../setup/mail.json');
    fs.writeFileSync('./config/mail.json', JSON.stringify(mail, null, 4));
  } else {
    mail = require('../mail.json');
  }
  resolve(mail);
});

let express = new Promise(async (resolve) => {
  let express;
  if (!files.includes('express.json')) {
    express = require('../../setup/express.json');
    fs.writeFileSync('./config/express.json', JSON.stringify(express, null, 4));
  } else {
    express = require('../express.json');
  }
  resolve(express);
});

let mongo = new Promise(async (resolve) => {
  let mongo;
  if (!files.includes('mongo.json')) {
    mongo = require('../../setup/mongo.json');
    fs.writeFileSync('./config/mongo.json', JSON.stringify(mongo, null, 4));
  } else {
    mongo = require('../mongo.json');
  }
  resolve(mongo);
});

let vimeo = require('../vimeo.json');

let doneArray = [bash, functionsDone, mail, express, mongo, vimeo];

module.exports = {
  bash,
  mail,
  express,
  mongo,
  vimeo,
  functionsDone,
  doneArray
};

