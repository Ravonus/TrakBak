const crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  config = require('../../config/config'),
  iv = Buffer.from(config.ivId, 'hex');

module.exports = (text, salt) => {

  try {
    var decipher = crypto.createDecipheriv(algorithm, salt, iv)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
  } catch (err) {
    console.log(err);
  }

}

/*
 * Project: trakbak
 * File Created: Tuesday, 13th November 2018 8:50:14 pm
 * Author: Chad Koslovsky (chad@technomancyIT.com)
 * -----
 * Last Modified: Tuesday, 13th November 2018 9:58:51 pm
 * Modified By: Chad Koslovsky (chad@technomancyIT.com>)
 * -----
 * Copyright 2018 - 2018 - TechnomancyIT
 */
