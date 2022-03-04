const path = require('path');
const connect = require('connect');
const serveStatic = require('serve-static');
const open = require('open');
const ip = require('localip')();
const port = 3000;

connect()
  .use(serveStatic(path.join(__dirname, './dist')))
  .listen(port, function () {
    console.log(`Server running on http://${ip}:${port} ...`);
    open(`http://${ip}:${port}`);
  });
