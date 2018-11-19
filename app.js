var ws = require('nodejs-websocket');

var server = ws.createServer(function(conn) {
  console.log('New connection');

  conn.on('close', function() {
    boardcast(JSON.stringify({
      name: 'Server',
      text: conn.nickname + '离开了房间'
    }));
  })
  
  conn.on('text', function(str) {
    console.log(str)
    // boardcast(str);
    var data = JSON.parse(str);

    switch(data.type) {
      case 'setname':
        conn.nickname = data.name;
        boardcast(JSON.stringify({
          name: 'Server',
          text: data.name + '加入了房间'
        }));
        break;
      case 'chat':
        boardcast(JSON.stringify({
          name: conn.nickname,
          text: data.text
        }));
        break;
      default:
        break;
    }
  });

  conn.on('error', function(err) {
    console.log(err);
  });
}).listen(2333);

function boardcast(str) {
  server.connections.forEach(function(conn) {
    conn.sendText(str);
  })
}