<template>
  <ion-page class="capture-page">
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="custom-header">
        <ion-grid>
          <ion-row>
            <ion-col></ion-col>
            <ion-col size="8"></ion-col>
            <ion-col
              ><ion-button v-if="!streaming && isCameraOn" @click="startServer">
                Stream
              </ion-button>
              <ion-button v-if="streaming" @click="performCleanup"
                >Stop</ion-button
              ></ion-col
            >
          </ion-row>
        </ion-grid>
      </div>
      <camera-control />
      <div class="stream-overlay" id="stream-overlay">
        <canvas class="movement-canvas" id="movement-canvas" ref="canvasRef"></canvas>
        <video id="video" ref="videoRef" muted></video>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import CameraControl from "../components/capture/CameraControl.vue";
import { IonPage, IonContent, IonButton, IonGrid, IonRow, IonCol } from "@ionic/vue";
import { defineComponent, onMounted, ref } from "vue";
import { useHostRTC } from "../composables/useHostRTC";
import { useCreateCamera } from "../composables/useCreateCamera";
import { useDetectMovement } from "../composables/useDetectMovement";

export default defineComponent({
  name: "CapturePage",
  components: {
    IonRow,
    IonCol,
    IonGrid,
    IonPage,
    IonButton,
    IonContent,
    CameraControl,
  },

  setup() {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const videoRef = ref<HTMLVideoElement | null>(null);
    const { streaming, startServer, performCleanup } = useHostRTC();
    const { isCameraOn } = useCreateCamera();
    const { detect } = useDetectMovement();

    onMounted(() => {
      if (videoRef.value && canvasRef.value) {
        detect(canvasRef.value, videoRef.value);
      }
    });
    return {
      canvasRef,
      videoRef,
      isCameraOn,
      streaming,
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
}
</style>
