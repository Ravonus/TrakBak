const mongoose = require('mongoose');

module.exports = function templateLiterals(obj) {

  Object.keys(obj).forEach(key => {

    if (Array.isArray(obj[key])) {

      if (obj[key][0].type.match(/\${(.*?)\}/g))
        obj[key][0].type = eval(obj[key][0].type.substr(2).slice(0, -1));

      if (obj[key][0].default && obj[key][0].default.match(/\${(.*?)\}/g))
        obj[key][0].default = eval(obj[key][0].default.substr(2).slice(0, -1));

    } else if (typeof obj[key] === 'object') {

      if (obj[key].type.match(/\${(.*?)\}/g))
        obj[key].type = eval(obj[key].type.substr(2).slice(0, -1));

      if (obj[key].default && typeof obj[key].default === 'string' && obj[key].default.match(/\${(.*?)\}/g))
        obj[key].default = eval(obj[key].default.substr(2).slice(0, -1));
    }

  });

  return obj;

};