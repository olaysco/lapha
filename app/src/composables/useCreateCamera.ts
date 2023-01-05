import { HTMLVideoElementWithCaptureStream } from "./../types";
import { ref, onUnmounted, reactive, toRefs } from "vue";
import { isPlatform } from "@ionic/vue";
import { toast } from "./useToast";
import { Flashlight } from "@awesome-cordova-plugins/flashlight";
import { AndroidPermissions } from "@awesome-cordova-plugins/android-permissions";

type cameraDevice = {
  id: string;
  label: string;
};

const state = reactive({ isCameraOn: false, isFlashOn: false, isMicOn: false });

export function useCreateCamera() {
  const stream = ref<MediaStream>();
  const constraints = ref<Record<string, unknown>>({
    video: { facingMode: "environment" },
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
    state.isMicOn = true;
    state.isCameraOn = true;
    localVideo.srcObject = stream.value;
    localVideo.play().then(() => (localVideo.muted = true));
  };

  const toggleStream = async () => {
    if (state.isCameraOn) {
      return closeCamera();
    }

    initCamera();
  };

  const closeCamera = async () => {
    state.isCameraOn = false;
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
      state.isMicOn = !state.isMicOn;
      track.enabled = state.isMicOn;
    }
  };

  const toggleFlash = function () {
    Flashlight.available().then((available) => {
      if (available) {
        Flashlight.toggle().then(() => {
          state.isFlashOn = !state.isFlashOn;
        });

        return;
      }
      toast().showInfo("Flash not supported by this device");
    });
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
    ...toRefs(state),
    toggleStream,
    stream,
    toggleFlash,
    toggleMic,
    getCameras,
  };
}
