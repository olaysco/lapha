import { NOTIFICATIONS } from "./../types";
import { toRefs, reactive } from "vue";
import { toastController } from "@ionic/vue";
import { useDisplayNotification } from "../composables/useDisplayNotification";

const state = reactive({ joining: false, hasJoin: false, port: 9090 });

export function useJoinRTC() {
  let signalChannel: WebSocket | null = null;
  let peerConnection: RTCPeerConnection | null;
  let dataChannel: RTCDataChannel;

  const joinRTC = async () => {
    state.joining = true;
    state.hasJoin = false;
    initSignalChanel();
    peerConnection = new RTCPeerConnection();
    peerConnection.ondatachannel = dataChannelOpen;
    peerConnection.onicecandidate = ({ candidate }) => {
      console.log("icecandaidate");
      signalChannel?.send(JSON.stringify({ candidate: candidate }));
    };
    peerConnection.addEventListener("iceconnectionstatechange", (e) =>
      console.log(e)
    );
    peerConnection.addEventListener("track", (e) => {
      handleRemoteTrack(e);
    });

    if (signalChannel != null) {
      signalChannel.onmessage = handleSignalMessage;
    }
    peerConnection.addEventListener("icecandidate", (e) =>
      handleIceCandidate(<RTCPeerConnection>peerConnection, e)
    );
  };

  const initSignalChanel = (): WebSocket | null => {
    if (signalChannel == null) {
      // we will eventually replace providing of custom port with scanning of QR.
      signalChannel = new WebSocket(`ws://localhost:${state.port}`);
      signalChannel.onerror = (e) => {
        console.log(e);
        if (signalChannel?.readyState == WebSocket.CLOSED) {
          state.joining = false;
          signalChannel = null;
          showError("Unable to establish connection with host, check port.");
        }
      };
    }

    return signalChannel;
  };

  const handleSignalMessage = async (ev: MessageEvent): Promise<any> => {
    const msg = JSON.parse(ev.data);
    if (msg.offer && peerConnection != null) {
      try {
        await peerConnection.setRemoteDescription(msg.offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        signalChannel?.send(JSON.stringify({ answer: answer }));
        console.log("local connected " + peerConnection.connectionState);
        state.hasJoin = true;
      } catch (error) {
        console.log(error);
        console.log("error answering");
      } finally {
        state.joining = false;
      }
    }

    if (msg.candidate) {
      try {
        console.log("receive ice " + msg.candidate);
        peerConnection?.addIceCandidate(msg.candidate);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const dataChannelOpen = (event: RTCDataChannelEvent) => {
    console.log("dc channel ", event.channel.label);
    dataChannel = event.channel;
    dataChannel.onopen = handleDataChannelOpen;
    dataChannel.onmessage = handleDataChannelMessage;
  };

  const handleDataChannelOpen = (event: Event) => {
    console.log(event);
  };

  const handleDataChannelMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log(" new message " + data.type);
    if (data.type && data.type == NOTIFICATIONS.MOVEMENT) {
      useDisplayNotification("Alert: A movement detected!!!");
    }
  };

  const handleIceCandidate = (
    peer: RTCPeerConnection,
    event: RTCPeerConnectionIceEvent
  ) => {
    console.log("new ice");
  };

  const handleRemoteTrack = (track: RTCTrackEvent) => {
    const vid = <HTMLVideoElement>document.getElementById("remoteTrack");
    console.log("receive remote track");
    console.log(vid);
    console.log(track.streams);
    if (vid && vid.srcObject !== track.streams[0]) {
      console.log("setting remote track");
      vid.srcObject = track.streams[0];
    }
  };

  const disconnectRTC = () => {
    state.hasJoin = false;
    if (signalChannel != null) {
      signalChannel.close();
      signalChannel = null;
    }
  };

  const showError = async (message: string) => {
    const toast = await toastController.create({
      message: message,
      duration: 1500,
      position: "top",
      color: "danger",
    });

    await toast.present();
  };

  return {
    ...toRefs(state),
    joinRTC,
    disconnectRTC,
  };
}
