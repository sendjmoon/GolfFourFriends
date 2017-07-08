'use strict';

const app = require('../app');
const http = require('http');

const port = process.env.port || 3000;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => { console.log('server up on ' + port); });