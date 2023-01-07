/* eslint-disable @typescript-eslint/ban-ts-comment */
import { toast } from "../composables/useToast";
import { getPlatforms, isPlatform } from "@ionic/vue";
import { LocalNotifications } from "@awesome-cordova-plugins/local-notifications";

export function useDisplayNotification(message: any) {
  toast().showInfo(message);

  if (
    ["pwa", "mobileweb", "desktop"].some((platform) => {
      // @ts-ignore
      return getPlatforms().includes(platform);
    })
  ) {
    Notification.requestPermission((status) => {
      if (status === "granted") {
        new Notification(message);
      }
    });

    return;
  }

  if (isPlatform("android")) {
    LocalNotifications.schedule({
      id: 1,
      text: message,
    });

    return;
  }
}
