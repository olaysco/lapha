<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Preferences</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <form action="">
        <ion-list>
          <ion-list-header>
            <ion-label>Capture Settings</ion-label>
          </ion-list-header>
          <ion-item>
            <ion-label>Noise Detection</ion-label>
            <ion-toggle slot="end" v-model="settings.noiseDetection"></ion-toggle>
          </ion-item>

          <ion-item>
            <ion-label>Movement Detection</ion-label>
            <ion-toggle slot="end" v-model="settings.movementDetection"></ion-toggle>
          </ion-item>

          <ion-item v-if="settings.movementDetection">
            <ion-label>Sensitivity</ion-label>
            <ion-range
              :pin="true"
              :pin-formatter="pinFormatter"
              v-model="settings.detectionSensitivity"
            ></ion-range>
          </ion-item>
          <ion-item>
            <ion-label>Video Quality</ion-label>
            <ion-select
              :interface-options="imageQualitySelect"
              interface="action-sheet"
              placeholder="Select One"
              v-model="settings.videoQuality"
            >
              <ion-select-option value="128">128</ion-select-option>
              <ion-select-option value="256">256</ion-select-option>
              <ion-select-option value="1024">1024</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>
      </form>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { Settings } from "../types";
import { defineComponent, ref, watch, reactive, onMounted, toRaw } from "vue";
import { useStorage } from "../composables/useStorage";
import {
  IonList,
  IonPage,
  IonItem,
  IonTitle,
  IonRange,
  IonLabel,
  IonToggle,
  IonHeader,
  IonContent,
  IonToolbar,
  IonButtons,
  IonSelect,
  IonBackButton,
  IonSelectOption,
} from "@ionic/vue";
export default defineComponent({
  name: "SettingsPage",
  components: {
    IonList,
    IonPage,
    IonItem,
    IonTitle,
    IonRange,
    IonLabel,
    IonSelect,
    IonToggle,
    IonHeader,
    IonContent,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonSelectOption,
  },

  setup() {
    let settings: Settings = reactive({
      movementDetection: false,
      noiseDetection: false,
      videoQuality: "256",
      detectionSensitivity: 50,
    });

    onMounted(() =>
      useStorage()
        .get("settings")
        .then((value) => {
          if (value) {
            settings.movementDetection = value.movementDetection;
            settings.noiseDetection = value.noiseDetection;
            settings.videoQuality = value.videoQuality;
            settings.detectionSensitivity = value.detectionSensitivity;
          }
        })
        .catch((e) => console.log(e))
    );
    const imageQualitySelect = {
      header: "Default Bandwidth",
      subHeader:
        "Select the video quality, higher quality coauld affect battery and CPU usage",
    };
    watch(settings, (value) => {
      useStorage().set("settings", toRaw(value));
    });
    return {
      settings,
      useStorage,
      imageQualitySelect,
      pinFormatter: (value: number) => `${value}%`,
    };
  },
});
</script>
