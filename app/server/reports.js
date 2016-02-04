/* global require */
/* global module */
// jshint esversion:6

var Router = require('express').Router;

module.exports = function(config) {
    var reportsRouter = new Router();

    reportsRouter.get('/day', function(req, res) {
        config.db.allDocs({ include_docs: true }).then(result => {
            //console.log(result.rows[0])
            var filtered = [];
            for (var k = 0; k < result.rows.length; ++k) {
                var item = result.rows[k];
                if ((Date.parse(item.doc.date) > new Date().setTime(0,0,0,0)) && (Date.parse(item.doc.date) < new Date().setTime(23,59,59,0))) filtered.push(item);
            }
            res.status(200).json(filtered);
        }).catch(error => {
            res.status(500).json(error);
        });
    });

    reportsRouter.get('/week', function(req, res) {
        // access the db using config.db
    });

    return reportsRouter;
};
