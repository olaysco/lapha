import { ref } from "vue";
import { CupertinoPane } from "cupertino-pane";

export function useContentPane() {
  let pane: any;
  const showPane = ref<boolean>(false);

  const initPane = (element: HTMLElement, parent: HTMLElement | null) => {
    if (pane == null || pane == undefined) {
      pane = new CupertinoPane(element, {
        backdrop: true,
        breaks: {
          top: {
            enabled: true,
            height: window.innerHeight - 100,
            bounce: true,
          },
          middle: { enabled: true, height: 300, bounce: true },
          bottom: { enabled: true, height: 80 },
        },
        events: {
          onDrag: () => console.log("Drag event"),
          onBackdropTap: () => hidePane,
        },
      });
    }

    return pane;
  };

  const presentDrawer = async () => {
    showPane.value = true;
    await pane.present({ animate: true });
  };

  const hidePane = async () => {
    await pane.hide();
  };

  const destroyPane = async () => {
    pane.destroy({ animate: true });
  };

  return {
    showPane,
    hidePane,
    initPane,
    destroyPane,
    presentDrawer,
  };
}
