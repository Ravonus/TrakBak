  
    const crypto = require('crypto'),
    config = require('../../config/config'),
    algorithm = 'aes-256-ctr',
    iv = Buffer.from(config.ivId, 'hex');
  
  module.exports =  (text, salt) => {

    let cipher = crypto.createCipheriv(algorithm, salt, iv)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
  }