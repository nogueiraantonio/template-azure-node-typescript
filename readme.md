# Template

Azure Deployment for basic NodeJS (12.18.0) Express (4.17.1) web server and Typescript (4.4.4)

## web.config

Modified to point to dist/server/server.js

## package.json

Typescript is included as production dependency (rather than development dependency) so that Azure installs it for transpilation on the server.

Contains typescript transpilation and static file copy scripts
