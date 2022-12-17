<template>
  <ion-page>
    <ion-backdrop :visible="joining"> </ion-backdrop>
    <div class="backdrop-content" v-if="joining">
      <div class="loader">
        <ion-label>Establishing Connection</ion-label>
        <ion-spinner name="crescent"></ion-spinner>
      </div>
    </div>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col></ion-col>
          <ion-col size="8"></ion-col>
          <ion-col>
            <join-pane />
          </ion-col>
        </ion-row>
      </ion-grid>

      <div class="remote-overlay" id="remote-overlay" v-show="hasJoin">
        <video id="remoteTrack" autoplay></video>
      </div>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {
  IonPage,
  IonContent,
  IonCol,
  IonRow,
  IonGrid,
  IonBackdrop,
  IonLabel,
  IonSpinner,
} from "@ionic/vue";
import { useJoinRTC } from "../composables/useJoinRTC";
import JoinPane from "../components/guardian/JoinPane.vue";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonCol,
    IonRow,
    IonGrid,
    JoinPane,
    IonBackdrop,
    IonLabel,
    IonSpinner,
  },
  setup() {
    const { joining, hasJoin, joinRTC } = useJoinRTC();
    return {
      hasJoin,
      joining,
      joinRTC,
    };
  },
});
</script>
<style lang="scss">
.remote-overlay {
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
ion-backdrop {
  opacity: 0.9;
  &.backdrop-hide {
    display: none;
  }
  &.backdrop-show {
    display: block;
  }
}
.backdrop-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  height: 100px;
  border-radius: 10px;

  & > .loader {
    display: flex;
    align-items: center;

    & > ion-label {
      margin-right: 0.4em;
    }
  }
}
</style>
