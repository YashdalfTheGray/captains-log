/* global __dirname */
// jshint esversion:6

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var chalk = require('chalk');
var PouchDb = require('pouchdb');

var db = new PouchDb('http://localhost:5984/logs');

var app = express();

app.use(morgan(':remote-addr - ' +
        chalk.cyan('[:date] ') +
        chalk.green('":method :url ') +
        chalk.gray('HTTP/:http-version" ') +
        chalk.yellow(':status ') +
        ':res[content-length] ' +
        'time=:response-time ms'));
app.use(bodyParser.json());

app.get('/api/v1/status', (req, res) => {
    res.status(200).json({ status: 'live' });
});

app.get('/api/v1/logs', (req, res) => {
    db.allDocs({ include_docs: true }).then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json(error);
    });
});

app.post('/api/v1/logs', (req, res) => {
    req.body.date = req.body.date || new Date().toISOString();

    db.post(req.body).then(result => {
        res.status(201).json(result);
    }).catch(error => {
        res.status(500).json(error);
    });
});

app.put('/api/v1/logs/:id', (req, res) => {
    req.body._id = req.params.id;
    db.get(req.params.id).then(result =>{
        req.body._rev = result._rev;
        return db.put(req.body);
    }).then(result => {
        res.status(200).json(result);
    }).catch(error =>{
        if (error.status === 404) {
            res.send(404).json('Document not found');
        }
        else {
            res.send(500).json(error);
        }
    });
})

app.listen(process.argv[2] || 8080);
