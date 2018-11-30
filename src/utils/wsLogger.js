// @flow
/* eslint-disable */

// uncomment this
/* const WSClient = require('websocket').w3cwebsocket;

const wslog = (msg: any) => {
  const client = new WSClient('ws://localhost:1337/');
  client.onopen = () => {
    client.send(JSON.stringify(msg));
  };
}; */

// comment this
const wslog = (msg: any) => {};

export { wslog };

/* eslint-enable */

// server
// copy to file and run as separate project (dont forget to add `websocket` lib)
/* 
const WebSockerServer = require("websocket").server;
const http = require("http");

const server = http.createServer((req, res) => {
  //
});
server.listen(1337, () => {});

const wsServer = new WebSockerServer({
  httpServer: server
});

wsServer.on("request", req => {
  const connection = req.accept(null, "*");

  connection.on("message", msg => {
    if (msg.type === "utf8") {
      console.log(JSON.parse(msg.utf8Data));
    }
  });
}); */
