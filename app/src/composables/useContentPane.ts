import { CupertinoPane } from "cupertino-pane";

export function useContentPane() {
  let pane: any;

  const initPane = (element: HTMLElement, parent: HTMLElement | null) => {
    if (pane == null || pane == undefined) {
      console.log(element, pane);
      pane = new CupertinoPane(element, {
        // parentElement: parent ?? "ion-content",
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
          onBackdropTap: () => hidePanel,
        },
      });
    }

    return pane;
  };

  const presentDrawer = async () => {
    // console.log("killed");
    // console.log(document.getElementsByClassName("cupertino-pane").length);
    await pane.present({ animate: true });
  };

  const hidePanel = async () => {
    await pane.hide();
  };

  return {
    initPane,
    presentDrawer,
  };
}
