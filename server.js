var _ = require('lodash');
var express = require('express');
var app = express();
var env = require('dotenv').load();
var envConfig = require('./lookenv.config');


app.use(express.static('.'));

app.get('/config.json', function(request, response) {
    /*
    Return json object of config variables for the angularjs application.

    First look up which keys should be included from lookenv.config, then set
    its value either from the environment or a .env file (in that order of
    precedence).
    */

    // Get relevant vars from environment or .env.
    var config = {};
    _.each(envConfig, function(v, k) {
        config[k] = process.env[k] || _.get(env, 'parsed' + k);
    });

    // Build application configuration object
    var appConfig = {
        conductorUrl: config.OS_CONDUCTOR_URL || config.OS_BASE_URL,
        explorerUrl: config.OS_EXPLORER_URL || config.OS_BASE_URL,
        viewerUrl: config.OS_VIEWER_URL || config.OS_BASE_URL + '/viewer',
        searchUrl:
            config.OS_SEARCH_URL || config.OS_BASE_URL + '/search/package',
        packagerUrl:
            config.OS_PACKAGER_URL || config.OS_BASE_URL + '/packager'
    };

    // Add present snippet settings to app config object.
    _.each(config, function(v, k) {
      if (_.startsWith(k, 'OS_SNIPPETS_')) {
        var snippetKey = _.toLower(_.replace(k, 'OS_SNIPPETS_', ''));
        _.set(appConfig, 'snippets.' + snippetKey, v);
      }
    });

    response.json(appConfig);
});

app.listen(8000, function() {
  console.log('app listening on port 8000!');
});
