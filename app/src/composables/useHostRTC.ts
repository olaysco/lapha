import { HTMLVideoElementWithCaptureStream } from "./../types";
import { ref, onUnmounted } from "vue";
declare let cordova: any;

export function useHostRTC() {
  const serverOn = ref<boolean>(false);
  const streaming = ref<boolean>(false);
  const listeningPort = ref<number>(9090);
  const wsserver = cordova.plugins.wsserver;
  const isDataChannelOpen = ref<boolean>(false);
  let dataChannel: RTCDataChannel;
  const peerConnections = ref<Map<string, RTCPeerConnection>>(new Map());
  let peer: RTCPeerConnection;

  const startServer = () => {
    wsserver.start(
      listeningPort.value,
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
          sendRTCOffer(conn);
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
        serverOn.value = true;
        console.log("Start Listening on", addr, ":", port);
      },
      function onDidNotStart(reason: string) {
        console.log("Did not start. Reason: %s", reason);
      }
    );
  };

  const sendRTCOffer = async (conn: any) => {
    peer = new RTCPeerConnection();
    dataChannel = peer.createDataChannel("channel");
    dataChannel.addEventListener("open", dataChannelopen);
    peer.onicecandidate = ({ candidate }) => {
      console.log("icecandaidate");
      sendMessage(conn.uuid, JSON.stringify({ candidate: candidate }));
    };

    const localVideo = <HTMLVideoElementWithCaptureStream>(
      document.getElementById("video")
    );
    const stream = localVideo.captureStream();
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      sendMessage(conn.uuid, JSON.stringify({ offer: offer }));
    } catch (error) {
      console.log("error creating offer");
      console.log(error);
    }
  };

  const handleMessage = async (conn: any, msg: string) => {
    console.log(`Received message ${msg} from ${conn.uuid}`);
    const msgObject = JSON.parse(msg);

    if (msgObject.answer && peer) {
      console.log(msgObject.answer);
      await peer.setRemoteDescription(msgObject.answer);
      streaming.value = true;
      console.log("cremote connected");
    }
  };

  const sendMessage = (to: string, message: string) => {
    if (wsserver == null) {
      return;
    }

    wsserver.send({ uuid: to }, message);
  };

  const setLocalStream = () => {
    const localVideo = <HTMLVideoElementWithCaptureStream>(
      document.getElementById("video")
    );
    console.log("attempting to capture local stream");
    console.log(
      "attempting to capture local stream",
      document.getElementById("stream-overlay")?.innerHTML
    );

    if (!localVideo) {
      console.log("locals stream invalid");
      return;
    }

    localVideo.onplay = () => {
      console.log("locals stream captured");
      console.log("count => " + peerConnections.value.size ?? 0);
    };
  };

  const dataChannelopen = () => {
    isDataChannelOpen.value = true;
    console.log("data channel opened");
  };

  const performCleanup = () => {
    wsserver.stop();
    dataChannel.close();
    isDataChannelOpen.value = false;
    serverOn.value = false;
    streaming.value = false;
    peerConnections.value = new Map();
  };

  onUnmounted(performCleanup);

  return {
    streaming,
    serverOn,
    startServer,
    sendMessage,
    performCleanup,
  };
}
