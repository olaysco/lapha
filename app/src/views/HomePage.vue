<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="custom-header">
        <div></div>
        <ion-nav-link router-direction="forward" :component="SettingsPage">
          <ion-button router-link="/settings" fill="clear">
            <ion-icon :icon="settings" size="medium"></ion-icon>
          </ion-button>
        </ion-nav-link>
      </div>
      <div id="container">
        <h1 class="app-name"><strong>LAPHA</strong></h1>

        <div class="mode-btns">
          <ion-nav-link router-direction="forward" :component="CapturePage">
            <ion-button router-link="/capture" expand="full" v-if="isMobile">
              Capture Mode
              <ion-icon slot="end" :icon="videocam"></ion-icon>
            </ion-button>
          </ion-nav-link>
          <ion-button router-link="/guardian" expand="block" :component="GuardianPage"
            >Guardian Mode <ion-icon slot="end" :icon="eye"></ion-icon>
          </ion-button>
        </div>
      </div>
    </ion-content>
    <ion-footer class="footer ion-no-border ion-no-padding">
      <ion-toolbar>
        <ion-title class="ion-text-center ion-text-sm">
          Lapha &copy; {{ year }}
        </ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import {
  IonIcon,
  IonContent,
  IonNavLink,
  IonButton,
  IonPage,
  IonFooter,
  IonToolbar,
  IonTitle,
  isPlatform,
} from "@ionic/vue";
import { videocam, eye, settings } from "ionicons/icons";
import { defineComponent } from "vue";
import SettingsPage from "./SettingsPage.vue";
import CapturePage from "./CapturePage.vue";
import GuardianPage from "./GuardianPage.vue";

export default defineComponent({
  name: "HomePage",
  components: {
    IonPage,
    IonIcon,
    IonTitle,
    IonButton,
    IonFooter,
    IonContent,
    IonNavLink,
    IonToolbar,
  },

  setup() {
    const year = new Date().getFullYear();
    const isMobile = isPlatform("ios") || isPlatform("android");
    return {
      eye,
      year,
      settings,
      isMobile,
      videocam,
      CapturePage,
      GuardianPage,
      SettingsPage,
    };
  },
});
</script>

<style lang="scss" scoped>
ion-content {
  --background: linear-gradient(
      162deg,
      rgba(0, 0, 0, 0.15) 20%,
      var(--ion-color-primary) 100%
    ),
    url("../assets/images/home.svg") no-repeat 100% 100%;
}

#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);

  display: grid;
  grid-row: 3;
  grid-column: 1;
  row-gap: 8vh;

  padding: 0px 16px;

  .app-name {
    line-height: 1em;
    color: var(--ion-text-color);
  }
}

#container .mode-btns {
  grid-row: 2;
  row-gap: 1vh;
  display: grid;
}

ion-page,
ion-app {
  background-color: var(--ion-color-primary);
}

ion-footer {
  ion-toolbar {
    --background: var(--ion-color-primary);
  }
  ion-title {
    height: 100%;
    font-size: small;
  }
}

.custom-header {
  display: flex;
  justify-content: space-between;
}
</style>
