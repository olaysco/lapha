import { toRefs, reactive } from "vue";
import { toastController } from "@ionic/vue";

const state = reactive({ joining: false, hasJoin: false, port: 9090 });

export function useJoinRTC() {
  let signalChannel: WebSocket | null = null;

  const joinRTC = async () => {
    state.joining = true;
    state.hasJoin = false;
    getSignalChanel();
    const peerConnection = new RTCPeerConnection();
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
      signalChannel.onmessage = async (ev: MessageEvent): Promise<any> => {
        const msg = JSON.parse(ev.data);
        if (msg.offer) {
          try {
            console.log(msg.offer);
            await peerConnection.setRemoteDescription(msg.offer);
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            signalChannel?.send(JSON.stringify({ answer: answer }));
            console.log("local connected " + peerConnection.connectionState);
            peerConnection.ondatachannel = (e) => {
              e.channel.onopen = (e) => console.log("dc opened");
            };
            state.hasJoin = true;
          } catch (error) {
            console.log(error);
            console.log("error answering");
          } finally {
            state.joining = false;
          }
        }

        if (msg.candidate) {
          console.log("receive ice " + msg.candidate);
          peerConnection.addIceCandidate(msg.candidate);
        }
      };
    }

    peerConnection.addEventListener("icecandidate", (e) =>
      handleIceCandidate(peerConnection, e)
    );
  };

  const getSignalChanel = (): WebSocket | null => {
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
