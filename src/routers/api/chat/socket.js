module.exports = function (app) {
  const WebSocket = require('ws');
  const Chat = require('../../../models/chat');
  const clients = [];

  const wss = new WebSocket.Server({ port: 3002 });

  wss.on('error', e => console.error(e))

  wss.on('connection', function connection(socket) {
    socket.on('message', function incoming(message) {
      const data = JSON.parse(message);
      switch (data.type) {
        case 'connect': {
          clients.push({
            socket,
            ...data,
          });

          break;
        }

        case 'say': {
          const { sender, recipient, text } = data;
          Chat.create({
            recipient,
            sender,
            text,
          });

          console.log(29, clients)
          clients
            .filter((c) => {
              return (
                c.playerId === data.recipient ||
                c.playerId === data.senderA ||
                c.socket.readyState !== c.socket.CLOSED
              );
            })
            .forEach((client) =>
              client.socket.send(
                JSON.stringify({
                  type: 'say',
                  ...data,
                }),
              ),
            );
          break;
        }
      }
    });


    socket.on('close', function close() {
      const client = clients.find((c) => c.socket === socket);
      if (!client) return;
      console.log('Closing', client);
      clients.splice(clients.indexOf(client), 1);
    });
  });
};