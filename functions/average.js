'use strict';

async function average(arr) {

    let total = 0;

    for (var i = 0; i < arr.length; i++) {
        total += arr[i];
    }
    return total / arr.length;

}

module.exports = average;