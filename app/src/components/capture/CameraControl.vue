<template>
  <div class="ion-padding md capture-control">
    <ion-button @click="toggleFlash" :disabled="!isCameraOn">
      <ion-icon :icon="flash" v-if="isFlashOn"></ion-icon>
      <ion-icon :icon="flashOff" v-else></ion-icon>
    </ion-button>
    <ion-button :class="[isCameraOn ? 'glow' : '']" @click="toggleStream">
      <ion-icon v-if="isCameraOn" :icon="square" size="large" color="danger"></ion-icon>
      <ion-icon
        v-else
        :icon="radioButtonOnOutline"
        size="large"
        color="danger"
      ></ion-icon>
    </ion-button>
    <ion-button @click="toggleMic" :disabled="!isCameraOn">
      <ion-icon :icon="mic" v-if="isMicOn"></ion-icon>
      <ion-icon :icon="micOff" v-else></ion-icon>
    </ion-button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { IonIcon, IonButton } from "@ionic/vue";
import {
  flash,
  reload,
  square,
  mic,
  micOff,
  flashOff,
  radioButtonOnOutline,
} from "ionicons/icons";
import { useCreateCamera } from "../../composables/useCreateCamera";
export default defineComponent({
  components: {
    IonIcon,
    IonButton,
  },

  setup() {
    const {
      isCameraOn,
      isMicOn,
      isFlashOn,
      toggleFlash,
      toggleMic,
      switchCamera,
      toggleStream,
    } = useCreateCamera();
    return {
      toggleMic,
      toggleFlash,
      switchCamera,
      mic,
      micOff,
      isMicOn,
      reload,
      isFlashOn,
      isCameraOn,
      flash,
      square,
      flashOff,
      toggleStream,
      radioButtonOnOutline,
    };
  },
});
</script>
<style lang="scss">
.capture-control {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;

  & > ion-button:not(:nth-child(2)) {
    &,
    &::part(native) {
      border-radius: 50%;
      width: 44px;
      height: 44px;
    }
  }

  & > ion-button:nth-child(2) {
    &,
    &::part(native) {
      border-radius: 50%;
      height: 55px;
      width: 55px;
      background-color: #fff;
    }
    &.glow {
      animation: glow 1s infinite alternate;
    }
    margin: 0px 4px;
  }

  @keyframes glow {
    from {
      box-shadow: 0 0 5px -5px #ff4961;
    }
    to {
      box-shadow: 0 0 5px 3px #ff4961;
    }
  }
}
</style>
