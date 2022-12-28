import { ref, toRefs, reactive } from "vue";

const state = reactive({ joining: false, hasJoin: false, port: 9090 });

export function useJoinRTC() {
  let socket: WebSocket | null = null;

  const joinRTC = async (hostPort: number) => {
    state.joining = true;
    state.hasJoin = false;
    const peerConnection = new RTCPeerConnection();
    peerConnection.onicecandidate = ({ candidate }) => {
      console.log("icecandaidate");
      getSignalChanel().send(JSON.stringify({ candidate: candidate }));
    };
    peerConnection.addEventListener("iceconnectionstatechange", (e) =>
      console.log(e)
    );
    peerConnection.addEventListener("track", (e) => {
      handleRemoteTrack(e);
    });
    getSignalChanel().onmessage = async (ev: MessageEvent): Promise<any> => {
      const msg = JSON.parse(ev.data);
      if (msg.offer) {
        try {
          console.log(msg.offer);
          await peerConnection.setRemoteDescription(msg.offer);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          getSignalChanel().send(JSON.stringify({ answer: answer }));
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

    peerConnection.addEventListener("icecandidate", (e) =>
      handleIceCandidate(peerConnection, e)
    );
  };

  const getSignalChanel = (): WebSocket => {
    if (socket == null) {
      // we will eventually replace providing of custom port with scanning of QR.
      socket = new WebSocket(`ws://localhost:${state.port}`);
    }

    return socket;
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
    if (socket != null) {
      socket.close();
      socket = null;
    }
  };

  return {
    ...toRefs(state),
    joinRTC,
    disconnectRTC,
  };
}
