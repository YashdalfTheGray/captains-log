/* global require */
// jshint esversion:6

var path = require('path');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var chalk = require('chalk');
var PouchDb = require('pouchdb');

var logs = require('./logs');
var reports = require('./reports');
var sap = require('./sap');

var db = new PouchDb('http://localhost:5984/logs');

var app = express();
var apiRouter = new express.Router();

morgan.token('color_status', (req, res) => {
    if (res.statusCode < 300) {
        return chalk.green(res.statusCode);
    }
    else if (res.statusCode >= 300 && res.statusCode < 400) {
        return chalk.yellow(res.statusCode);
    }
    else if (res.statusCode > 400) {
        return chalk.red(res.statusCode);
    }
});

app.use(morgan(':remote-addr - ' +
        '[:date] ' +
        chalk.cyan('":method :url ') +
        chalk.gray('HTTP/:http-version" ') +
        ':color_status ' +
        ':res[content-length] ' +
        'time=:response-time ms'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/../client')));

apiRouter.get('/status', (req, res) => {
    res.status(200).json({ status: 'live' });
});

apiRouter.use('/logs', logs({ db: db }));
apiRouter.use('/reports', reports({ db: db }));
apiRouter.use('/sap', sap());

app.use('/api/v1', apiRouter);

app.listen(process.argv[2] || 8080);
