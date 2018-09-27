const modelName = require("../../models/modelName");

let read = {

    find: (query, done) => {


        modelName.find(query, (err, obj) => {
            // Note that this error doesn't mean nothing was found,
            // it means the database had an error while searching, hence the 500 status
            if (err) done({error: err});
            // send the list of all people
            done(obj)
        });

    },
    findOne: () => {

    },
    where: () => {

    }

}

module.exports = read;



