'use strict';

function objClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
module.exports = objClone;