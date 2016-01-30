/* global require */
// jshint esversion:6

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var chalk = require('chalk');
var PouchDb = require('pouchdb');

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

apiRouter.get('/logs', (req, res) => {
    db.allDocs({ include_docs: true }).then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json(error);
    });
});

apiRouter.post('/logs', (req, res) => {
    req.body.date = req.body.date || new Date().toISOString();

    db.post(req.body).then(result => {
        res.status(201).json(result);
    }).catch(error => {
        res.status(500).json(error);
    });
});

apiRouter.put('/logs/:id', (req, res) => {
    req.body._id = req.params.id;
    db.get(req.params.id).then(result => {
        req.body._rev = result._rev;
        return db.put(req.body);
    }).then(result => {
        res.status(200).json(result);
    }).catch(error =>{
        if (error.status === 404) {
            res.status(404).json('Document not found');
        }
        else {
            res.status(500).json(error);
        }
    });
});

apiRouter.delete('/logs/:id', (req, res) => {
    req.body._id = req.params.id;
    db.get(req.params.id).then(result =>{
        req.body._rev = result._rev;
        return db.remove(req.body);
    }).then(result => {
        res.status(200).json(result);
    }).catch(error =>{
        if (error.status === 404) {
            res.status(404).json('Document not found');
        }
        else {
            res.status(500).json(error);
        }
    });
});

apiRouter.use('/reports', reports({ db: db }));
app.use('/api/v1', apiRouter);

app.listen(process.argv[2] || 8080);
