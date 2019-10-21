'use strict';

module.exports = {
    route: (req, res) => {
        res.render('characters', { title: 'title' });
    },
    path: '/characters',
    permissions: 1,
    groups: ['administrators']
}