<template>
  <div>
    <content-pane ref="joinContentPane">
      <template #trigger="{ presentDrawer }">
        <ion-button @click="presentDrawer" v-html="`${!hasJoin ? 'Joined' : 'Join'}`">
        </ion-button>
      </template>
      <template #content>
        <div class="pane-header">
          <h1>Manage Connection</h1>
        </div>
        <div class="pane-body">
          <div v-if="!hasJoin" class="joined">
            <p>
              Currently connected to a host on {{ hostIp }}, click the button below to
              disconnect from the host
            </p>
            <ion-button color="danger" @click="disconnectRTC">Disconnect</ion-button>
          </div>
          <div class="not-joined" v-else></div>
        </div>
      </template>
    </content-pane>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { IonButton } from "@ionic/vue";
import ContentPane from "../ContentPane.vue";
import { useJoinRTC } from "../../composables/useJoinRTC";

export default defineComponent({
  components: { IonButton, ContentPane },
  setup() {
    const hostIp = ref("6566");
    const disconnectRTC = () => {
      alert("to disconnect");
    };
    const { hasJoin, joinRTC } = useJoinRTC();
    return {
      hostIp,
      hasJoin,
      joinRTC,
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
}
</style>
