/**
 * Movement detection in a video stream is impemented by
 * capturing still images from each video as a frame, and comparing
 * the current video frame, to the previous video frame.
 *
 * each frame is represented as a sequence of pixels, and a pixel of made of
 * four elements red,green,blue and alpha channels.
 *   r,  g,  b,  a,  r,  g,  b, a,
 * [255,255,255,255, 255,255,255,255,...]
 *
 * if previousFrame = [47,111,39,255,   108,33,94,255 ...]
 * and currentFrame = [100,125,135,255, 87,45,100,255,...]
 * computing the difference between these two frames, at the same index,
 * we can see that a movement as occured.
 *
 * Though, the movement can be as small as an eye wink, or passing insect.
 * we can control the detection sensitivity by specifying the minimum difference
 * we want to see between the channels.
 *
 * we can also optimize the difference sensitivity, by specifying the number of pixel
 * difference beteeen frames.
 */

import { onUnmounted, ref } from "vue";

export function useDetectMovement() {
  const previousPixels: { red: number; green: number; blue: number }[] = [];
  const canvas = ref<HTMLCanvasElement>();
  const video = ref<HTMLVideoElement>();
  const timeoutID = ref<number>(0);

  const startDetection = () => {
    if (video.value && canvas.value) {
      const canvasContext = canvas.value?.getContext("2d", {
        willReadFrequently: true,
      });

      const canvasWidth = Math.floor(canvas.value.clientWidth);
      const canvasHeight = Math.floor(canvas.value.clientHeight);
      canvas.value.width = canvasWidth;
      canvas.value.height = canvasHeight;

      video.value.addEventListener(
        "play",
        () => {
          watchCanvas(canvasContext, canvasWidth, canvasHeight);
        },
        false
      );
    }
  };

  const watchCanvas = (
    canvasContext: CanvasRenderingContext2D | null,
    width: number,
    height: number
  ) => {
    if (
      video.value != undefined &&
      !video.value.ended &&
      !video.value.paused &&
      canvasContext
    ) {
      canvasContext?.drawImage(video.value, 0, 0, width, height);
      const data = canvasContext?.getImageData(0, 0, width, height).data;
      let pixelDifference = 0;
      if (data) {
        let movementDetected = false;
        // each pixel is represented by four element, r, g, b & a.
        for (let i = 0; i < data.length; i += 4) {
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];
          if (
            previousPixels[i] &&
            Math.abs(previousPixels[i].red - red) > 50 &&
            Math.abs(previousPixels[i].green - green) > 50 &&
            Math.abs(previousPixels[i].blue - blue) > 50
          ) {
            pixelDifference++;
          }
          previousPixels[i] = { red, green, blue };
        }

        if (pixelDifference > 1000) {
          movementDetected = true;
        }
      }
    }

    timeoutID.value = setTimeout(
      () =>
        window.requestAnimationFrame(() =>
          watchCanvas(canvasContext, width, height)
        ),
      60
    );
  };

  const detect = (
    canvasElement: HTMLCanvasElement,
    videoElement: HTMLVideoElement
  ) => {
    videoElement.height = window.innerHeight;
    videoElement.width = window.innerWidth;

    canvas.value = canvasElement;
    video.value = videoElement;
    window.requestAnimationFrame(startDetection);
  };

  onUnmounted(() => {
    if (timeoutID.value) {
      clearInterval(timeoutID.value);
    }
  });

  return {
    detect,
    startDetection,
  };
}
