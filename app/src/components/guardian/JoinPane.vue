<template>
  <div>
    <content-pane ref="joinContentPane">
      <template #trigger="{ presentDrawer }">
        <ion-button @click="presentDrawer" v-html="`${hasJoin ? 'Joined' : 'Join'}`">
        </ion-button>
      </template>
      <template #content>
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
            <!-- <p>Enter the port showing on the host screen below.</p> -->
            <div>
              <ion-list>
                <ion-item>
                  <ion-label position="stacked"
                    >Enter the port showing on the host screen</ion-label
                  >
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
            <ion-button @click="connectHost" :disabled="!portValid">Connect</ion-button>
          </div>
        </div>
      </template>
    </content-pane>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { IonButton, IonInput, IonItem, IonList, IonLabel } from "@ionic/vue";
import ContentPane from "../ContentPane.vue";
import { useJoinRTC } from "../../composables/useJoinRTC";

export default defineComponent({
  components: {
    IonButton,
    IonInput,
    ContentPane,
    IonItem,
    IonList,
    IonLabel,
  },
  setup() {
    const hostPort = ref(9000);
    const portValid = computed(() => {
      return hostPort.value > 1000 && hostPort.value < 65535;
    });
    const disconnectRTC = () => {
      alert("to disconnect");
    };
    const connectHost = async () => {
      await joinRTC(hostPort.value);
    };

    const { hasJoin, joinRTC } = useJoinRTC();
    return {
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
