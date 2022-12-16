<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="custom-header">
        <div></div>
      </div>
      <div id="container">
        <h1 class="app-name"><strong>LAPHA</strong></h1>
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
  IonContent,
  IonPage,
  IonFooter,
  IonToolbar,
  IonTitle,
  isPlatform,
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomePage",
  components: {
    IonPage,
    IonTitle,
    IonFooter,
    IonContent,
    IonToolbar,
  },

  setup() {
    const year = new Date().getFullYear();
    const isMobile = isPlatform("ios") || isPlatform("android");
    return {
      year,
      isMobile,
    };
  },
});
</script>

<style lang="scss" scoped>
ion-content {
  --background: linear-gradient(162deg, rgb(0 0 0 / 80%) 20%, #177e89 100%),
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
    font-size: 20px;
    line-height: 26px;
    color: #fff;
  }
}

#container .mode-btns {
  grid-row: 2;
  row-gap: 1vh;
  display: grid;
}

ion-page,
ion-app {
  background-color: #177e89;
}

ion-footer {
  ion-toolbar {
    --background: #177e89;
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
