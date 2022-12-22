<template>
  <ion-page ref="pageRef">
    <!-- <ion-backdrop :visible="joining"> </ion-backdrop> -->
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
            <ion-button @click="presentDrawer" v-html="`${hasJoin ? 'Joined' : 'Join'}`">
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>

      <div class="remote-overlay" id="remote-overlay" v-show="hasJoin">
        <video id="remoteTrack" autoplay></video>
      </div>
    </ion-content>
    <join-pane ref="joinPaneRef" />
  </ion-page>
</template>
<script lang="ts">
import { onIonViewDidEnter } from "@ionic/vue";
import { defineComponent, ref } from "vue";
import {
  IonPage,
  IonContent,
  IonCol,
  IonRow,
  IonGrid,
  IonButton,
  // IonBackdrop,
  IonLabel,
  IonSpinner,
} from "@ionic/vue";
import { useJoinRTC } from "../composables/useJoinRTC";
import { useContentPane } from "../composables/useContentPane";
import JoinPane from "../components/guardian/JoinPane.vue";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonCol,
    IonRow,
    IonGrid,
    JoinPane,
    IonButton,
    // IonBackdrop,
    IonLabel,
    IonSpinner,
  },
  setup() {
    const joinPaneRef = ref<InstanceType<typeof JoinPane> | null>(null);
    const pageRef = ref<InstanceType<typeof IonPage> | null>(null);

    const { joining, hasJoin, joinRTC } = useJoinRTC();
    const { initPane, presentDrawer } = useContentPane();
    onIonViewDidEnter(() => {
      if (joinPaneRef.value && pageRef.value) {
        const pane = joinPaneRef.value.$refs.cupertinoPane;
        const parent = pageRef.value.$refs.ionPage;
        console.log(parent);
        initPane(pane as HTMLElement, parent as HTMLElement);
      }
    });
    return {
      presentDrawer,
      hasJoin,
      joining,
      joinRTC,
      pageRef,
      joinPaneRef,
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
