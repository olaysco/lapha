<template>
  <ion-page class="capture-page">
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="custom-header">
        <ion-grid>
          <ion-row>
            <ion-col></ion-col>
            <ion-col size="8"></ion-col>
            <ion-col
              ><ion-button router-link="/">
                <ion-icon :icon="infinite"></ion-icon></ion-button
            ></ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <camera-control />
      <div class="stream-overlay" id="stream-overlay">
        <video id="video"></video>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import CameraControl from "../components/capture/CameraControl.vue";
import {
  IonPage,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
} from "@ionic/vue";
import { infinite } from "ionicons/icons";
import { defineComponent } from "vue";

export default defineComponent({
  name: "CapturePage",
  components: {
    IonRow,
    IonCol,
    IonIcon,
    IonGrid,
    IonPage,
    IonButton,
    IonContent,
    CameraControl,
  },

  setup() {
    return {
      infinite,
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
    object-fit: cover;
  }
}

.capture-page {
  & ion-content {
    --background: transparent;
  }
}
</style>
