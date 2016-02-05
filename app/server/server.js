/* global require */
// jshint esversion:6

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var chalk = require('chalk');
var PouchDb = require('pouchdb');

var logs = require('./logs');
var reports = require('./reports');

var db = new PouchDb('http://localhost:5984/logs');

var app = express();
var apiRouter = new express.Router();

app.use(morgan(':remote-addr - ' +
        chalk.cyan('[:date] ') +
        chalk.green('":method :url ') +
        chalk.gray('HTTP/:http-version" ') +
        chalk.yellow(':status ') +
        ':res[content-length] ' +
        'time=:response-time ms'));
app.use(bodyParser.json());

apiRouter.get('/status', (req, res) => {
    res.status(200).json({ status: 'live' });
});

apiRouter.use('/logs', logs({ db: db }));
apiRouter.use('/reports', reports({ db: db }));

app.use('/api/v1', apiRouter);

app.listen(process.argv[2] || 8080);
