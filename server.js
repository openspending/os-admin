var _ = require('lodash');
var express = require('express');
var app = express();
var env = require('dotenv').load();
var envConfig = require('./lookenv.config');


app.use(express.static('.'));

app.get('/config', function(request, response) {
    /*
    Return json object of config variables for the angularjs application.

    First looks up which keys should be included from lookenv.config, then sets
    its value either from the environment or a .env file (in that order of
    precedence).
    */
    var config = {};
    _.each(envConfig, function(v, k) {
        config[k] = process.env[k] || _.get(env, 'parsed' + k);
    });
    response.json(config);
});

app.listen(8000, function() {
  console.log('app listening on port 8000!');
});
