const uWS = require('uWebSockets.js');

const port = 9001;

const app = uWS./*SSL*/App({
  //   key_file_name: 'misc/key.pem',
  //   cert_file_name: 'misc/cert.pem',
  //   passphrase: '1234'
}).ws('/*', {
  /* Options */
  //   compression: uWS.SHARED_COMPRESSOR,
  //   maxPayloadLength: 16 * 1024 * 1024,
  //   idleTimeout: 10,
  /* Handlers */
  open: (ws) => {
    console.log('A WebSocket connected!');
    ws.subscribe("word");
  },
  message: (ws, messageBuffer, isBinary) => {
    const message = JSON.parse(new TextDecoder().decode(messageBuffer))
    if (!("type" in message)) {
      console.error("[message] missing type field")
      return
    }
    switch (message.type) {
      case "input": {
        if ("value" in message) {
          ws.publish("word", JSON.stringify(message))
        } else {
          console.error("[message:input] missing value field")
          return
        }
      } break;
      case "submit": {
        ws.publish("word", { type: "success" })
      } break;
      default: {
        console.log("[message] unexpected message type")
      }
    }
    /* Ok is false if backpressure was built up, wait for drain */
    // let ok = ws.send(message, isBinary);
  },
  drain: (ws) => {
    console.log('WebSocket backpressure: ' + ws.getBufferedAmount());
  },
  close: (ws, code, message) => {
    console.log('WebSocket closed');
  }
}).any('/*', (res, req) => {
  res.end('Nothing to see here!');
}).listen(port, (token) => {
  if (token) {
    console.log('Listening to port ' + port);
  } else {
    console.log('Failed to listen to port ' + port);
  }
});