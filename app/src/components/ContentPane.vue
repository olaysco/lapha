<template>
  <div>
    <slot name="trigger" :presentDrawer="presentDrawer"></slot>
    <div class="cupertino-pane ion-padding">
      <div class="content" hide-on-bottom>
        <slot name="content" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { CupertinoPane } from "cupertino-pane";

export default defineComponent({
  setup() {
    let pane: any;

    onMounted(() => {
      pane = new CupertinoPane(".cupertino-pane", {
        parentElement: "ion-content",
        backdrop: true,
        breaks: {
          top: { enabled: true, height: window.innerHeight - 100, bounce: true },
          middle: { enabled: true, height: 300, bounce: true },
          bottom: { enabled: true, height: 80 },
        },
        events: {
          onDrag: () => console.log("Drag event"),
          onBackdropTap: () => hidePanel,
        },
      });
    });

    const presentDrawer = async () => {
      await pane.present({ animate: true });
    };

    const hidePanel = async () => {
      await pane.hide();
    };

    return {
      presentDrawer,
    };
  },
});
</script>
<style lang="scss"></style>
