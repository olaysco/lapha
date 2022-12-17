<template>
  <ion-page>
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

      <div class="remote-overlay" id="remote-overlay">
        <video id="remoteTrack" autoplay></video>
      </div>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { IonPage, IonContent, IonCol, IonRow, IonGrid } from "@ionic/vue";
import { useJoinRTC } from "../composables/useJoinRTC";
import JoinPane from "../components/guardian/JoinPane.vue";

export default defineComponent({
  components: { IonPage, IonContent, IonCol, IonRow, IonGrid, JoinPane },
  setup() {
    const { hasJoin, joinRTC } = useJoinRTC();
    return {
      hasJoin,
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
</style>
