if (process.env.SENTRY_PUBLIC_DSN) {
    var Raven = require('raven-js');
    Raven
        .config(process.env.SENTRY_PUBLIC_DSN, {logger: 'os-admin'})
        .install();
}
