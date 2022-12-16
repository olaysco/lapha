import { HTMLVideoElementWithCaptureStream } from "./../types";
import { ref, onUnmounted } from "vue";
import { isPlatform } from "@ionic/vue";
import { AndroidPermissions } from "@awesome-cordova-plugins/android-permissions";

type cameraDevice = {
  id: string;
  label: string;
};

export function useCreateCamera() {
  const isMicOn = ref<boolean>(false);
  const isCameraOn = ref<boolean>(false);
  const isFlashOn = ref<boolean>(false);
  const stream = ref<MediaStream>();
  const constraints = ref<Record<string, unknown>>({
    video: true,
    audio: true,
  });

  const initCamera = async () => {
    if (isPlatform("android")) {
      await getPermission([AndroidPermissions.PERMISSION.CAMERA]);
    }
    const localVideo = <HTMLVideoElementWithCaptureStream>(
      document.getElementById("video")
    );
    stream.value = await navigator.mediaDevices.getUserMedia(constraints.value);
    isMicOn.value = true;
    isCameraOn.value = true;
    localVideo.srcObject = stream.value;
    localVideo.play();
  };

  const toggleStream = async () => {
    if (isCameraOn.value) {
      return closeCamera();
    }

    initCamera();
  };

  const closeCamera = async () => {
    isCameraOn.value = false;
    stream.value?.getTracks().forEach((track) => {
      track.readyState == "live" && track.stop();
    });
  };

  const getCameras = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameraDevices: Array<cameraDevice> = [];
    devices.forEach((device) => {
      switch (device.kind) {
        case "videoinput":
          cameraDevices.push({
            label: device.label || `Camera ${cameraDevices.length + 1}`,
            id: device.deviceId,
          });
          break;
      }
    });

    return cameraDevices;
  };

  const toggleMic = function () {
    const track = stream.value?.getAudioTracks()[0];
    if (track) {
      isMicOn.value = !isMicOn.value;
      track.enabled = isMicOn.value;
    }
  };
  const toggleFlash = function () {
    //not yet implemented
    isFlashOn.value = !isFlashOn.value;
  };

  const performCleanup = () => {
    closeCamera();
  };

  const getPermission = (permissionName: Array<string>) => {
    return new Promise((resolve, reject) => {
      AndroidPermissions.checkPermission(permissionName[0]).then((result) => {
        if (!result.hasPermission) {
          AndroidPermissions.requestPermissions(permissionName)
            .then(() => {
              alert("PERMISSION-GIVEN");
              resolve(true);
            })
            .catch((err) => {
              reject(false);
            });
        } else {
          resolve(true);
        }
      });
    });
  };

  onUnmounted(performCleanup);

  return {
    toggleStream,
    isCameraOn,
    isFlashOn,
    isMicOn,
    stream,
    toggleFlash,
    toggleMic,
    getCameras,
  };
}
