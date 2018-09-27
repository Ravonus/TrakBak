const User = require('../../models/User');

let update = {

    find: () => {

        User.find((err, obj) => {
            // Note that this error doesn't mean nothing was found,
            // it means the database had an error while searching, hence the 500 status
            if (err) return res.status(500).send(err)
            // send the list of all people
            return res.status(200).send(obj);
        });

    },
    findOne: () => {

    },
    where: () => {

    }

}

module.exports = update;