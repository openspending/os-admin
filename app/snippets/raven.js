var globalConfig = window.globalConfig || {};
if (globalConfig.snippets && globalConfig.snippets.raven) {
    var Raven = require('raven-js');
    Raven
        .config(globalConfig.snippets.raven, {logger: 'os-admin'})
        .install();
}
