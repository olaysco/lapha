<template>
  <div>
    <div ref="cupertinoPane" class="cupertino-pane ion-padding">
      <div class="content" hide-on-bottom>
        <div class="pane-header">
          <h1>Manage Connection</h1>
        </div>
        <div class="pane-body">
          <div v-if="hasJoin" class="joined">
            <p>
              Currently connected to a host on <code>{{ hostPort }}</code
              >, click the button below to disconnect from the host.
            </p>
            <ion-button color="danger" @click="disconnectRTC">Disconnect</ion-button>
          </div>
          <div class="not-joined" v-else>
            <div>
              <ion-list>
                <ion-item>
                  <ion-label position="stacked">Enter the host IP</ion-label>
                  <ion-input
                    :clearOnEdit="true"
                    placeholder="Enter the Host IP"
                    required
                    type="text"
                    v-model="hostIP"
                    pattern="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                  ></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Enter the host port</ion-label>
                  <ion-input
                    :clearOnEdit="true"
                    placeholder="Enter the Host IP"
                    min="1000"
                    max="65535"
                    type="number"
                    v-model="hostPort"
                  ></ion-input>
                </ion-item>
              </ion-list>
            </div>
            <ion-button @click="connectHost" :disabled="!portValid || !ipValid"
              >Connect</ion-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useJoinRTC } from "../../composables/useJoinRTC";
import { useStorage } from "../../composables/useStorage";
import { IonButton, IonInput, IonItem, IonList, IonLabel } from "@ionic/vue";
import { ConnectionParams } from "../../types";

export default defineComponent({
  components: {
    IonButton,
    IonInput,
    IonItem,
    IonList,
    IonLabel,
  },
  setup() {
    const portValid = computed(() => {
      return hostPort.value > 1000 && hostPort.value < 65535;
    });
    const ipValid = computed(() => {
      return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        hostIP.value
      );
    });
    const connectHost = async () => {
      setStorage("connectionParams", { hostIP: hostIP.value, hostPort: hostPort.value });
      await joinRTC();
    };

    const { get: getStorage, set: setStorage } = useStorage();

    onMounted(() => {
      getStorage("connectionParams").then((val: ConnectionParams) => {
        if (!val) {
          return;
        }
        if (val.hostIP) {
          hostIP.value = val.hostIP;
        }

        if (val.hostPort) {
          hostPort.value = val.hostPort;
        }
      });
    });

    const { hasJoin, joinRTC, disconnectRTC, port: hostPort, ip: hostIP } = useJoinRTC();
    return {
      ipValid,
      hostIP,
      hostPort,
      hasJoin,
      joinRTC,
      portValid,
      connectHost,
      disconnectRTC,
    };
  },
});
</script>
<style lang="scss">
.pane-body {
  & > .joined {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-top: 2em;
    & > p {
      text-align: center;
      padding: 1em 0em;
    }
  }
  & > .not-joined {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-top: 2em;
    & ion-button {
      margin: 1em 0em;
    }
  }
}
</style>
