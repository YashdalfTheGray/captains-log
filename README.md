# captains-log
Logging time through REST API with a React/Material-UI front end.

## Getting started

Once the repository is cloned, run `npm install` to install all the dependencies for the project.

Outside of the dependencies installed by `npm`, this project also depends on `gulp-cli` and `babel-cli`. Another recommendation is to install `pouchdb-server` globally. These can be done by running `npm install -g gulp-cli babel-cli pouchdb-server`.

Lastly, run a `gulp init` to initialize the database directory for PouchDB.

## Running

Running this project will require 2 terminal windows. One to run the PouchDB server and one to run the node server. The PouchDB server can be started using `gulp start:pouchdb`. PouchDB server will then start listening at port 5984.

A good debug tool for PoucDB is Fauxton which can be accessed by going to http://localhost:5984/_utils.

The node server can be started (in another terminal window) by using `gulp start:nodeserver`. This will build the project, put the built files in the `dist/` folder and run the server on port 8080.

Running `gulp` from the terminal will list out the supported `gulp` commands.

## Cleaning

Running `gulp clean:dist` will remove the `dist` folder from the project root. Similarly, running `gulp clean:modules` will remove the `node_modules` folder. Cleaning the `node_modules` folder will require an `npm install` before running the app.

Since cleaning out the `dist` folder could be a common activity, `gulp clean` is aliased to `gulp clean:dist`.

The contents and the logs for the database can be deleted using `gulp clean:db`. This is going to require the pouch server to be shut down and also a `gulp init` before running again.

Running `gulp clean:all` will remove both the `dist` and the `node_modules` folder from the project root.

## Server API

A listing of the server API is included in the `app/server/captains-log-api.md` document. 

## Useful links
* [React Docs](https://facebook.github.io/react/docs/getting-started.html)
* [Material UI Docs](http://www.material-ui.com/#/)
* [Express Docs](http://expressjs.com/en/4x/api.html)
* [PouchDB Docs](http://pouchdb.com/api.html)
* [ES2015 syntax](https://babeljs.io/docs/learn-es2015/)
* [browserify Docs](https://github.com/substack/node-browserify#usage)
* [Babel Options](https://babeljs.io/docs/usage/options/)
