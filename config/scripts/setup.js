'use strict';

const inquirer = require('inquirer'),
  chalk = require('chalk'),
  path = require('path'),
  dir = path.join(__dirname, '../'),
  fs = require('fs'),
  isWin = process.platform === "win32";

let exec, pollTime, minify;

let obj = {};

if (isWin) {
  pollTime = 3000;
  exec = ['DSSearch-server', 'DSGame-server', 'DSConnect-server'];
  minify = [false, false]
} else {
  pollTime = 1500;
  exec = ['dssearch', 'dsgame', 'dsconnect'];
  minify = [false, false];
}

inquirer
  .prompt([
    { type: 'confirm', name: 'dspEnabled', message: chalk.bold.blueBright('Enable DSP management portion?') },
    { type: 'confirm', name: 'mysqlEnabled', message: chalk.bold.blueBright('Enable DSP Mysql access?') }
  ])
  .then(answers => {

    if (answers.dspEnabled) {
      inquirer
        .prompt([
          { type: 'input', name: 'DS-dir', message: chalk.bold.greenBright('DSP directory?') },
        ]).then(answers => {
          let lastAnswers = answers;
          inquirer
            .prompt([
              { type: 'input', name: 'conf-dir', message: chalk.bold.greenBright('DSP Configuration directory?'), default: answers['DS-dir'] + '/conf' },
              { type: 'input', name: 'exec1', message: chalk.bold.greenBright('dsp executable DSSearch'), default: exec[0] },
              { type: 'input', name: 'exec2', message: chalk.bold.greenBright('dsp executable DSGame'), default: exec[1] },
              { type: 'input', name: 'exec3', message: chalk.bold.greenBright('dsp executable DSConnect'), default: exec[2] },
              { type: 'input', name: 'processPollingTime', message: chalk.bold.greenBright('Processing polling time. (How often do you want to check stats of executables?)'), default: pollTime },
              { type: 'confirm', name: 'pull', message: chalk.bold.greenBright('Allow Mog Garden pull?'), default: true },
              { type: 'confirm', name: 'push', message: chalk.bold.greenBright('Allow Mog Garden push?'), default: false }
            ]).then(answers => {
              var exec = [answers.exec1, answers.exec2, answers.exec3];
              answers.exec1 = undefined;
              answers.exec2 = undefined;
              answers.exec3 = undefined;
              answers.executables = exec;
              obj.dsp = Object.assign(lastAnswers, answers);
              mysqlCheck()
            });
        });
    } else {
      mysqlCheck()
    }

    function mysqlCheck() {
      if (answers.mysqlEnabled) {
        inquirer
          .prompt([
            { type: 'input', name: 'mysql-host', message: chalk.bold.yellowBright('mysql-host'), default: 'localhost' },
            { type: 'input', name: 'mysql-db', message: chalk.bold.yellowBright('mysql-db'), default: 'dspdb' },
            { type: 'input', name: 'mysql-user', message: chalk.bold.yellowBright('mysql-user'), default: 'darkstar' },
            { type: 'input', name: 'mysql-password', message: chalk.bold.yellowBright('mysql-password') }
          ]).then(answers => {
            if (obj.dsp) {
              obj.dsp = Object.assign(obj.dsp, answers);
            } else {
              obj.dsp = answers;
            }
            inquirer
              .prompt([
                { type: 'confirm', name: 'disabled', message: chalk.bold.blueBright('Disable Mog Garden Database Sync?'), default: false }
              ])
              .then(answers => {
                if (!answers.disabled) {
                  let lastAnswers = answers;
                  inquirer
                    .prompt([
                      { type: 'input', name: 'server', message: chalk.bold.magentaBright('What is the push server?'), default: 'https://mog.garden' },
                      { type: 'confirm', name: 'secure', message: chalk.bold.magentaBright('Is the push server secured?'), default: true },
                      { type: 'input', name: 'token', message: chalk.bold.magentaBright('What is your Token ID?') },
                      { type: 'input', name: 'timeout', message: chalk.bold.magentaBright('Timeout for when you want app to stop trying to attempt to push server?'), default: 15000 },
                    ])
                    .then(answers => {
                      answers = Object.assign(lastAnswers, answers);
                      obj = Object.assign(obj, { mgSync: answers });
                      fs.writeFileSync(dir + '/dsp.json', JSON.stringify(obj.dsp, null, 4));
                      fs.writeFileSync(dir + '/mgSync.json', JSON.stringify(obj.mgSync, null, 4));
                      enableWeb();
                    });
                } else {
                  fs.writeFileSync(dir + '/dsp.json', JSON.stringify(obj.dsp, null, 4));
                  enableWeb();
                }
              });
          });
      } else {
        fs.writeFileSync(dir + '/dsp.json', JSON.stringify(obj.dsp, null, 4));
        enableWeb();
      }
    }
    function enableWeb() {
      inquirer
        .prompt([
          { type: 'confirm', name: 'express', message: chalk.bold.whiteBright('Enable Web Management?'), default: true },
        ])
        .then(answers => {

          if (answers.express) {
            inquirer
              .prompt([
                { type: 'input', name: 'port', message: chalk.bold.whiteBright('What port would you like to use?'), default: '1337' },
                { type: 'input', name: 'minify', message: chalk.bold.whiteBright('Would you like to minify javascript files?'), default: minify[0] },
                { type: 'input', name: 'cssMinify', message: chalk.bold.whiteBright('Would you like to minify css files?'), default: minify[1] }
              ]).then(answers => {
                if(answers.minify.message === "false") answers.minify.message = false;
                if(answers.cssMinify.message === "false") answers.cssMinify.message = false;
                obj = Object.assign(obj, { express: answers });
                fs.writeFileSync(dir + '/express.json', JSON.stringify(obj.express, null, 4));
              });
          }

        });
    }
  });