'use strict';

var _ = require('lodash');

module.exports = {
  themes: {
    default: require('./default')
  },

  get: function get(themeName) {
    var themes = module.exports.themes;

    if (themeName !== undefined && !themes.hasOwnProperty(themeName)) {
      // eslint-disable-next-line max-len
      console.error('Unknown theme name (' + themeName + '). Using default theme.');
      themeName = undefined;
    }

    return _.merge(
      {},
      themes.default,
      themes[themeName] || {}
    );
  }
};
