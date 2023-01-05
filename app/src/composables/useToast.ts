import { toastController } from "@ionic/vue";

export function toast() {
  const showError = async (message: string) => {
    const toast = await toastController.create({
      message: message,
      duration: 1500,
      position: "top",
      color: "danger",
    });

    await toast.present();
  };

  const showSuccess = async (message: string) => {
    const toast = await toastController.create({
      message: message,
      duration: 1500,
      position: "top",
      color: "success",
    });

    await toast.present();
  };

  const showInfo = async (message: string) => {
    const toast = await toastController.create({
      message: message,
      duration: 1500,
      position: "top",
      color: "primary",
    });

    await toast.present();
  };

  return {
    showInfo,
    showError,
    showSuccess,
  };
}
