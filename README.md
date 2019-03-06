# os-admin

[![Build Status](https://travis-ci.org/openspending/os-admin.svg?branch=master)](https://travis-ci.org/openspending/os-admin)
[![Gitter](https://img.shields.io/gitter/room/openspending/chat.svg)](https://gitter.im/openspending/chat)
[![Issues](https://img.shields.io/badge/issue-tracker-orange.svg)](https://github.com/openspending/openspending/issues)

Provides a web interface for users to administer packages hosted on Openspending; links to edit, delete, open in [os-viewer](https://github.com/openspending/os-viewer).

- [AngularJS](https://angularjs.org/)
- [ExpressJS](https://expressjs.com/)

## Quick start

- get the code
`git clone https://github.com/openspending/os-admin.git`

- install dependencies
`npm install`

- build the frontend assets
`npm run build`

- configure .env

For local development, add an `.env` file with the following settings:
```ini
# Required settings
# e.g. https://openspending.org or http://localhost
OS_BASE_URL=

# Optional settings
# Google Analytics code
OS_SNIPPETS_GA=
# Sentry public DSN url
OS_SNIPPETS_RAVEN=

# Each service will use OS_BASE_URL unless overridden by these:
OS_CONDUCTOR_URL=
OS_VIEWER_URL=
OS_EXPLORER_URL=
OS_PACKAGER_URL=
```

- run the tests
`npm test`

- run the application...
`npm start`

When working locally you'll need to change the `<base href='/admin/'>` element in index.html to `/`.
