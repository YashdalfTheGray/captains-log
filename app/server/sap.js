/* global require */
/* global module */
// jshint esversion:6

var Router = require('express').Router;
var chalk = require('chalk');

module.exports = function() {
    var sapCodes;

    try {
        sapCodes = require('./sap-codes.json');
        console.log(chalk.green('sap-codes.json') + ' found.');
    }
    catch (error) {
        console.log('No ' + chalk.green('sap-codes.json') + ' file found. Please create the file if you want to add charge codes to the application.');
        sapCodes = {
            error: 'file not found',
            message: 'to use sap codes, please create an sap-codes.json in the server folder'
        };
    }

    var sapCodesRouter = new Router();

    sapCodesRouter.get('/codes', (req, res) => {
        res.status(200).json(sapCodes);
    });

    return sapCodesRouter;
};
