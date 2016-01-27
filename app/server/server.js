/* global __dirname */
// jshint esversion:6

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var chalk = require('chalk');

var app = express();

app.use(morgan(':remote-addr - ' +
        chalk.cyan('[:date] ') +
        chalk.green('":method :url ') +
        chalk.gray('HTTP/:http-version" ') +
        chalk.yellow(':status ') +
        ':res[content-length] ' +
        'time=:response-time ms'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).json({ status: 'live' });
});

app.listen(process.argv[2] || 8080);
