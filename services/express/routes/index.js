'use strict';

const fs = require('fs'),
    path = require('path');

let page = 'index';
let models = {};

if (config.express.signUp) {
    //let dirs = fs.readdirSync(path.join(__dirname, '../../../models/mgSync'));
    // async function asyncCheck() {
    //     await Functions.asyncForEach(dirs, (dir, index) => {
    //         if (dir.substring(dir.length - 3) === '.js') {
    //             models[dir.slice(0, -3)] = require(path.join(__dirname, '../../../models/mgSync', dir));
    //         }
    //     });

    //     let users = await models.Users.read({}).catch(e => {});

    //     if(users) {
    //         page = 'index';
    //     } else {  
    //         page = 'pages/setupAdmin';
    //     }


    // }
    //asyncCheck();
}



function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}


var pathSet = config.express.signUp ? '/' : '/';



module.exports = {
    route: (req, res) => {
        res.render(page, {socketRequest:false, data:[]});
    },
    path: pathSet,
    type: 'get'
};

// require('./mongooseAutomationRoutes');