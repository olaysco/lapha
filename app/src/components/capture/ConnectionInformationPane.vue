<template>
  <div>
    <div ref="cupertinoPane" class="cupertino-pane ion-padding">
      <div class="content" hide-on-bottom>
        <div class="pane-header">
          <h1>Connection Status</h1>
        </div>
        <div class="pane-body">
          <div class="joined">
            <ion-list>
              <ion-item>
                <ion-label>
                  <h4>IP address and port</h4>
                  <p v-for="ip in listeningAddress" :key="ip">
                    {{ `${ip}:${listeningPort}` }}
                  </p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h4>Browser Access</h4>
                  <p v-for="ip in listeningAddress" :key="ip">
                    {{ `${ip}:${currentWebPort}/guardian` }}
                  </p>
                </ion-label>
              </ion-item>
            </ion-list>
            <div class="ip-info"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { IonItem, IonList, IonLabel } from "@ionic/vue";
import { globalState } from "../../composables/useGlobalState";

export default defineComponent({
  components: {
    IonItem,
    IonList,
    IonLabel,
  },
  setup() {
    const currentWebPort = ref<string | null>(null);
    const { listeningAddress, listeningPort, httpAddress } = globalState();

    watch(httpAddress, (newAddress) => {
      if (newAddress.port) {
        currentWebPort.value = newAddress.port;
      }
    });
    return {
      httpAddress,
      listeningPort,
      currentWebPort,
      listeningAddress,
    };
  },
});
</script>
<style lang="scss">
.ip-info {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  padding: 0 1rem;
  z-index: 100;

  & > p {
    margin: 0.4rem 0;
    font-weight: 200;
  }
}
</style>
