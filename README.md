# os-admin

[![Gitter](https://img.shields.io/gitter/room/openspending/chat.svg)](https://gitter.im/openspending/chat)
[![Issues](https://img.shields.io/badge/issue-tracker-orange.svg)](https://github.com/openspending/openspending/issues)

OpenSpending user administration page
   
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
OS_BASE_URL= # e.g. https://openspending.org or http://localhost

# Optional settings
OS_SNIPPETS_GA= # Google Analytics code
OS_SNIPPETS_RAVEN= # Sentry public DSN url

# Each service will use OS_BASE_URL unless overridden by these:
OS_CONDUCTOR_URL=
OS_SEARCH_URL=
OS_VIEWER_URL=
OS_EXPLORER_URL=
OS_PACKAGER_URL=
```

- run the tests
`npm test`

- run the application...
`npm start`

(when working locally you'll need to change the `<base href='admin'>` element in index.html to be `/`.

