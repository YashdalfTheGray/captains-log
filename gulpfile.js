var gulp = require('gulp'),
    gutil = require('gulp-util'),
    nodemon = require('gulp-nodemon'),
    chalk = require('chalk'),
    del = require('del'),
    file = require('gulp-file'),
    os = require('os'),
    exec = require('child_process').exec;

var commandBuilder = function(command) {
    "use strict";

    var cmd = {};
    var cmdArr = command.split(' ');
    cmd.exec = cmdArr.shift();
    cmd.args = cmdArr;
    return cmd;
};

var runCommand = function(command, description, cb) {
    "use strict";

    if (typeof command.exec === 'undefined') {
        command = commandBuilder(command);
    }

    var child = exec(command.exec, command.args);
    child.stdout.on('data', function(data) {
        process.stdout.write(data);
    });
    child.stderr.on('data', function(data) {
        process.stdout.write(chalk.red(data));
    });
    child.on('error', function(error) {
        console.log(error);
    });

    return child;
};

gulp.task('default', ['usage']);

gulp.task('usage', function() {
    "use strict";

    var usageLines = [
        '',
        '',
        chalk.green('usage'),
        '\tdisplay this help page.',
        '',
        '',
        chalk.green('init'),
        '\tinitializes the db directory for PouchDB.',
        '',
        chalk.green('start:nodeserver'),
        '\tstarts the node server at port 8000.',
        '',
        chalk.green('start:pouchdb'),
        '\tstarts the pouchdb server at port 5984.',
        '',
        chalk.green('clean:modules'),
        '\tdeletes the node_modules directory.',
        '\t' + chalk.magenta('NOTE:') + ' ' + chalk.green('npm install') +
        ' will be required before running anything else.',
        '',
        chalk.green('clean:db'),
        '\tdeletes the db directory, deleting the database and logs',
        '\t' + chalk.magenta('NOTE:') + ' pouchdb server cannot ' +
        'be running when this command is run.',
        '\t' + chalk.magenta('NOTE:') + ' ' + chalk.green('gulp init') +
        ' will be required before running the pouchdb server.',
        ''
    ];

    gutil.log(usageLines.join(os.EOL));
});

gulp.task('init', function() {
    "use strict";
    return file('log.txt', '')
        .pipe(gulp.dest('db'));
});

gulp.task('start:nodeserver', function() {
    "use strict";
    nodemon({
        script: 'app/server/server.js',
        watch: 'app/server/*.js'
    });
});

gulp.task('start:pouchdb', function(cb) {
    "use strict";
    var command = 'pouchdb-server c';
    runCommand(command, 'PouchDB server', cb);
    gutil.log('PouchDB server is now ' + chalk.green('running') + ' on port ' + chalk.cyan('5984') + '. ');
});

gulp.task('clean:modules', function() {
    return del('node_modules');
});

gulp.task('clean:db', function() {
    return del('db');
});
