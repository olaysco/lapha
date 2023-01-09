<template>
  <ion-page class="capture-page" ref="capturePageRef">
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="custom-header">
        <ion-grid>
          <ion-row>
            <ion-col size="4"
              ><ion-button
                v-if="!serverOn && isCameraOn"
                @click="startServer"
                :disabled="serverOn"
              >
                {{ "Stream" }}
              </ion-button>
              <ion-button v-if="serverOn" @click="performCleanup"
                >Stop</ion-button
              ></ion-col
            >
            <ion-col size="6"></ion-col>
            <ion-col size="2">
              <ion-button @click="presentDrawer" expand="block">
                <ion-icon :icon="information"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <camera-control />
      <div class="stream-overlay" id="stream-overlay">
        <canvas class="movement-canvas" id="movement-canvas" ref="canvasRef"></canvas>
        <video id="video" ref="videoRef" muted></video>
      </div>
      <connection-information-pane ref="connectionInformationPaneRef" v-show="showPane" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import CameraControl from "../components/capture/CameraControl.vue";
import {
  IonIcon,
  IonPage,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  onIonViewDidEnter,
  onIonViewWillLeave,
} from "@ionic/vue";
import { information } from "ionicons/icons";
import { defineComponent, onMounted, ref } from "vue";
import { useHostRTC } from "../composables/useHostRTC";
import { useCreateCamera } from "../composables/useCreateCamera";
import { useDetectMovement } from "../composables/useDetectMovement";
import { useStorage } from "../composables/useStorage";
import { HTMLVideoElementWithCaptureStream, Settings } from "../types";
import ConnectionInformationPane from "../components/capture/ConnectionInformationPane.vue";
import { useContentPane } from "../composables/useContentPane";
import { useCreateWebServer } from "../composables/useCreateWebServer";

export default defineComponent({
  name: "CapturePage",
  components: {
    IonIcon,
    IonRow,
    IonCol,
    IonGrid,
    IonPage,
    IonButton,
    IonContent,
    CameraControl,
    ConnectionInformationPane,
  },

  setup() {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const videoRef = ref<HTMLVideoElementWithCaptureStream | null>(null);
    const capturePageRef = ref<InstanceType<typeof IonPage> | null>(null);
    const connectionInformationPaneRef = ref<InstanceType<
      typeof ConnectionInformationPane
    > | null>(null);

    const { streaming, startServer, performCleanup, serverOn } = useHostRTC();
    const { isCameraOn } = useCreateCamera();
    const { detect } = useDetectMovement();
    const { get: getSettings } = useStorage();
    const { initPane, showPane, presentDrawer, destroyPane, hidePane } = useContentPane();

    onMounted(() => {
      getSettings("settings").then((val: Settings) => {
        if (val && val.movementDetection && videoRef.value && canvasRef.value) {
          detect(canvasRef.value, videoRef.value, val.detectionSensitivity);
        }
      });

      useCreateWebServer().startWebServer();
    });
    onIonViewDidEnter(() => {
      if (connectionInformationPaneRef.value && capturePageRef.value) {
        const pane = connectionInformationPaneRef.value.$refs.cupertinoPane;
        const parent = capturePageRef.value.$refs.ionPage;
        initPane(pane as HTMLElement, parent as HTMLElement);
      }
    });
    onIonViewWillLeave(() => {
      destroyPane();
    });

    return {
      connectionInformationPaneRef,
      capturePageRef,
      presentDrawer,
      information,
      showPane,
      canvasRef,
      videoRef,
      isCameraOn,
      streaming,
      serverOn,
      startServer,
      performCleanup,
    };
  },
});
</script>

<style lang="scss">
.stream-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: transparent;

  & video {
    display: block;
    width: 100vw;
    height: 100vh;
    object-fit: contain;
  }
}

.capture-page {
  & ion-content {
    --background: transparent;
  }
}

.movement-canvas {
  position: absolute;
  left: 0;
  right: 0;
  visibility: hidden;
}
</style>
