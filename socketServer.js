const http = require('http');
const ws = require('ws');

const wss = new ws.Server({noServer: true});

function accept(req, res) {
  // all incoming requests must be websockets
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket') {
    res.end()
    return
  }

  // can be Connection: keep-alive, Upgrade
  if (!req.headers.connection.match(/\bupgrade\b/i)) {
    res.end()
    return
  }

  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect)
}

function onConnect(ws) {
  ws.on('message', function (message) {
    let name = 'raspberry pi'
    ws.send(`Connection established @ ${name}`)
    console.log(message)
  });
}

if (!module.parent) {
  http.createServer(accept).listen(7070);
  console.log('\nWebSocket Server Running @ ws://192.168.137.37:7070\n')
} else {
  exports.accept = accept
  console.log('WebSocket Server Failed')
}