var functions = {

  reverse: function (str) {
    let reversed = "";
    for (var i = str.length - 1; i >= 0; i--) {
      reversed += str[i];
    }
    return reversed;
  }, 
  
  jwtScramble: function (id, token) {
  
    token = functions.reverse(token);
    var idArr = id.match(/.{0,4}/g);
    var tokenArr = token.match(/.{0,4}/g);
    idArr.forEach(function (split, index) {
  
      console.log(index);
      tokenArr[index] = tokenArr[index] + split;
    })
  
    token = tokenArr.join();
  
    return token.replace(/,/g, '');
  
  },
  
  jwtUnScramble: function (token) {
  
    var tokenArr = token.match(/.{0,8}/g);
    var newToken = '';
    for (i = 0; i < 7; i++) {
      if (i !== 6) {
  
        newToken += tokenArr[i].substring(0, tokenArr[i].length - 4);;
  
      } else {
  
        for (x = 6; x < tokenArr.length; x++) {
          newToken += tokenArr[x];
  
        }
      }
  
    }
  
    return functions.reverse(newToken);
  
  },
  
  encryptString : function(text, salt) {
  
    const crypto = require('crypto'),
      algorithm = 'aes-256-ctr',
      iv = Buffer.from(ivId, 'hex');
  
    let cipher = crypto.createCipheriv(algorithm, salt, iv)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
  },
  
  decryptString : function (text, salt) {
  
    const crypto = require('crypto'),
      algorithm = 'aes-256-ctr',
      iv = Buffer.from(ivId, 'hex');
  
    try {
      var decipher = crypto.createDecipheriv(algorithm, salt, iv)
      var dec = decipher.update(text, 'hex', 'utf8')
      dec += decipher.final('utf8');
      return dec;
    } catch (err) {
      console.log(err);
    }
  
  }
}

module.exports = functions;