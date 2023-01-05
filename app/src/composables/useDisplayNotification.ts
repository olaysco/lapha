/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getPlatforms, isPlatform, toastController } from "@ionic/vue";
import { LocalNotifications } from "@awesome-cordova-plugins/local-notifications";

export function useDisplayNotification(message: any) {
  console.log(isPlatform("android") + " " + getPlatforms());

  if (
    // @ts-ignore
    ["pwa", "mobileweb"].some((platform) => getPlatforms().includes(platform))
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

  toastController
    .create({
      message: message,
      duration: 1500,
      position: "top",
      color: "danger",
    })
    .then((toast) => toast.present());
}
