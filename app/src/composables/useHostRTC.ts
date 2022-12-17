declare let cordova: any;

export function useHostRTC() {
  const wsserver = cordova.plugins.wsserver;

  const startServer = () => {
    wsserver.start(
      9090,
      {
        onFailure: function (addr: string, port: string, reason: string) {
          console.log(
            "Stopped listening on %s:%d. Reason: %s",
            addr,
            port,
            reason
          );
        },
        onOpen: (conn: any) => {
          console.log(conn);
        },
        onMessage: function (conn: any, msg: string) {
          handleMessage(conn, msg);
        },
        onClose: function (
          conn: any,
          code: string,
          reason: string,
          wasClean: string
        ) {
          console.log("A user disconnected from %s", conn.remoteAddr);
        },
        tcpNoDelay: true,
      },
      function onStart(addr: string, port: string) {
        console.log("Start Listening on", addr, ":", port);
      },
      function onDidNotStart(reason: string) {
        console.log("Did not start. Reason: %s", reason);
      }
    );
  };

  const handleMessage = async (conn: any, msg: string) => {
    console.log(`Received message ${msg} from ${conn.uuid}`);
    const msgObject = JSON.parse(msg);
  };

  const sendMessage = (to: string, message: string) => {
    if (wsserver == null) {
      return;
    }
    wsserver.send({ uuid: to }, message);
  };

  return {
    sendMessage,
  };
}
