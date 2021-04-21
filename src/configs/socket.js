const server = require('http').createServer();
const io = require('socket.io')(server);
io.on('connection', client => {
  client.on('disconnect', () => { /* … */ });
});

module.exports = io
server.listen(3001);