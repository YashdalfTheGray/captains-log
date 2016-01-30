/* global require */
/* global module */
// jshint esversion:6

var Router = require('express').Router;

module.exports = function(config) {
    var reportsRouter = new Router();

    reportsRouter.get('/day', function(req, res) {
        // access the db using config.db
    });

    reportsRouter.get('/week', function(req, res) {
        // access the db using config.db
    });

    return reportsRouter;
};
