import { HTMLVideoElementWithCaptureStream, NOTIFICATIONS } from "./../types";
import { ref, onUnmounted, onMounted, reactive } from "vue";
import { globalState } from "./useGlobalState";
import eventBus from "../events/bus";
declare let cordova: any;

export function useHostRTC() {
  const serverOn = ref<boolean>(false);
  const streaming = ref<boolean>(false);
  const wsserver = cordova.plugins.wsserver;
  const isDataChannelOpen = ref<boolean>(false);
  let dataChannel: RTCDataChannel;
  const peerConnections = ref<Map<string, RTCPeerConnection>>(new Map());
  let peer: RTCPeerConnection;

  const startServer = () => {
    wsserver.start(
      globalState().listeningPort,
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
        globalState().listeningAddress = [];
        console.log("Start Listening on", addr, ":", port);
        wsserver.getInterfaces(function (result: any) {
          for (const networkInterface in result) {
            if (
              Object.prototype.hasOwnProperty.call(result, networkInterface)
            ) {
              console.log("networkInterface", networkInterface);
              const ipv4 = result[networkInterface].ipv4Addresses;
              if (ipv4) {
                globalState().listeningAddress.push(ipv4);
              }
            }
          }
        });
      },
      function onDidNotStart(reason: string) {
        console.log("Did not start. Reason: %s", reason);
      }
    );
  };

  const sendRTCOffer = async (conn: any) => {
    peer = new RTCPeerConnection();
    dataChannel = peer.createDataChannel("channel");
    dataChannel.addEventListener("open", handleDataChannelopen);
    dataChannel.addEventListener("close", handleDataChannelclose);
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
      console.log("dremote connected");
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

  const handleDataChannelopen = () => {
    isDataChannelOpen.value = true;
    console.log("data channel opened");
  };

  const handleDataChannelclose = () => {
    isDataChannelOpen.value = false;
    console.log("data channel close");
  };

  const performCleanup = () => {
    if (serverOn.value) {
      wsserver.stop();
      serverOn.value = false;
    }

    if (streaming.value) {
      dataChannel.close();
      isDataChannelOpen.value = false;
      streaming.value = false;
    }
    peerConnections.value = new Map();
    globalState().listeningAddress.splice(
      0,
      globalState().listeningAddress.length
    );
  };

  const setup = () => {
    eventBus.on(NOTIFICATIONS.MOVEMENT, handleMovementAlert);
  };

  const handleMovementAlert = (event: any) => {
    if (
      streaming.value &&
      dataChannel != null &&
      dataChannel.readyState == "open"
    ) {
      console.log("sending alert");
      dataChannel.send(
        JSON.stringify({ type: NOTIFICATIONS.MOVEMENT, snapshot: event?.data })
      );
    }
  };

  onUnmounted(performCleanup);
  onMounted(setup);

  return {
    streaming,
    serverOn,
    startServer,
    sendMessage,
    performCleanup,
  };
}
