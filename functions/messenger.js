'use strict';

const chalk = require('chalk'),
    objClone = require('./objClone'),
    fs = require('fs'),
    {promisify} = require('util'),
    messages = require('../config/messages.json');

let color,
    close = false,
    l = console.log,
    openedLogs = {},
    c = process.exit;

fs.mkdir = promisify(fs.mkdir);
fs.readFile = promisify(fs.readFile);
fs.writeFile = promisify(fs.writeFile);

//type, close, log
let messenger = async (options, values, extras) => {

    new Promise(async (resolve) => {

        if (values && !Array.isArray(values)) extras = values;
        var dt = new Date();
        var ts = dt.toLocaleString()

        if (typeof options === 'string') {
            options = objClone(messages[options]);

            let template = options;
            let configVars = options.msg.match(/\${(.*?)}/g);

            if (configVars) {
                configVars.forEach((v) => {
                    let str = v.substring(2).slice(0, -1);
                    var seperate = str.split('.');
                    options.msg = options.msg.replace(/\${(.*?)}/, config[seperate[0]][seperate[1]])
                });
            }

            let configValues = options.msg.match(/\[(val.*?)\]/g);
            if (configValues) {
                configValues.forEach((v, index) => {
                    options.msg = options.msg.replace(/\[(val.*?)\]/, values[index]);
                    options = template;
                });
            }

        }

        switch (options.type) {
            case 'success':
                color = 'green';
                break;
            case 'info':
                color = 'blue';
                break;
            case 'error':
                color = 'redBright';
                break;
            default:
                color = 'yellowBright';
                break;
        }

        if (extras) {
            var obj = {
                [Date.now()]: {
                    timestamp: ts,
                    msg: options.msg,
                    extras
                }
            }
        } else {
            var obj = {
                [Date.now()]: {
                    timestamp: ts,
                    msg: options.msg
                }
            };
        }

        function fileCheck(path) {
            return fs.existsSync(path);
        }

        let fullPath;
        let logName;
        if (options.path) {
            let dir = await fs.readdir(options.path).catch(e => {});
            if (!dir) await fs.mkdir(options.path);
            logName = options.path + options.type;
            fullPath = `${options.path}${options.type}.json`;
        } else {
            let dir = await fs.readdir('./logs').catch(e => {});
            if (!dir) {
                await fs.mkdir('./logs');
            }
            logName = options.type;
            fullPath = `./logs/${options.type}.json`;
        }

        switch (options.log) {
            case 3:

                if (fileCheck(fullPath)) {
                    if (!openedLogs[logName]) {
                        var file = await fs.readFileSync(fullPath, 'utf8')
                        openedLogs[logName] = file;
                    } else {
                        var file = openedLogs[logName];
                    }


                    try {
                        file = JSON.parse(file.trim());

                        file = Object.assign(file, obj);

                        file = JSON.stringify(file, null, 4);
                        await fs.writeFileSync(fullPath, file);
                    } catch (e) {
                        l(chalk.bold.redBright(`${chalk.grey(`[ ${ts} ]`)} Issue with json log file: ${fullPath} ${e}`));
                    }
                    resolve(true)
                } else {
                    var json = JSON.stringify(obj, null, 4);
                    await fs.writeFileSync(fullPath, json);
                    resolve(true)
                }

                l(chalk.bold[color](`${chalk.grey(`[ ${ts} ]`)} ${options.msg}`));
                break;
            case 2:

                if (fileCheck(fullPath)) {
                    var file = await fs.readFile(fullPath, 'utf8').catch(e => console.log(e));

                    file = JSON.parse(file);

                    file[Object.keys(obj)[0]] = obj[Object.keys(obj)]

                    file = JSON.stringify(file, null, 4);
                    await fs.writeFileSync(fullPath, file);
                    resolve(true)
                } else {
                    var json = JSON.stringify(obj, null, 4);
                    await fs.writeFileSync(fullPath, json);
                    resolve(true)
                }
                break;
            case 1:
                l(chalk.bold[color](`${chalk.grey(`[ ${ts} ]`)} ${options.msg}`));
                break;
            default:
                break;
        }

        if (options.close) c();
    })
}

module.exports = messenger;
