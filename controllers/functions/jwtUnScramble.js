const config = require('../../config/config');


module.exports =  (token) => {

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

    return global.reverse(newToken);

  }