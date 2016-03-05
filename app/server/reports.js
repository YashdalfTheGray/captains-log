/* global require */
/* global module */
// jshint esversion:6

var Router = require('express').Router;
var _ = require('lodash');

module.exports = function(config) {
    var reportsRouter = new Router();

    reportsRouter.get('/day', function(req, res) {
        var now = new Date();
        var start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0, 0, 0
        );
        var end = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23, 59, 59
        );
        config.db.allDocs({ include_docs: true }).then(results => {
            console.log(results);
            var docs = [];
            _.forEach(results.rows, doc => {
                var time = new Date(parseInt(doc.id.split('_')[1]));
                console.log(time);
                if (time.getTime() >= start.getTime() && time.getTime() <= end.getTime()) {
                    docs.push(doc);
                }
            });
            res.status(200).json({
                start: start.toString(),
                end: end.toString(),
                entries: docs
            });
        }).catch(error => {
            res.status(error.status).json(error);
        });
    });

    reportsRouter.get('/week', function(req, res) {

    });

    return reportsRouter;
};
