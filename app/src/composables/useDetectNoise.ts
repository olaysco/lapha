import { HTMLVideoElementWithCaptureStream } from "./../types";
import { ref } from "vue";
export function useDetectNoise() {
  const video = ref<HTMLVideoElementWithCaptureStream>();
  let averageDecibels: number[] = [];

  const startDetection = () => {
    if (video.value) {
      video.value.addEventListener("play", () => {
        if (video.value) {
          const audioCtx = new AudioContext();
          const source = audioCtx.createMediaStreamSource(
            video.value.captureStream()
          );
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 2048;

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteFrequencyData(dataArray);
          source.connect(analyser);

          const canvas = <HTMLCanvasElement>(
            document.getElementById("oscilloscope")
          );
          const canvasCtx = canvas.getContext("2d");

          if (canvasCtx) {
            draw(canvas, canvasCtx, dataArray, analyser, bufferLength);
          }
        }
      });
    }
  };
  const detect = (videoElement: HTMLVideoElementWithCaptureStream) => {
    video.value = videoElement;
    startDetection();
  };

  function draw(
    canvas: HTMLCanvasElement,
    canvasCtx: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    analyser: AnalyserNode,
    bufferLength: number
  ) {
    setInterval(
      () =>
        requestAnimationFrame(() =>
          draw(canvas, canvasCtx, dataArray, analyser, bufferLength)
        ),
      600
    );

    analyser.getByteFrequencyData(dataArray);

    const values = dataArray.reduce((a, b) => a + b);

    const average = 20 * Math.log10(values / dataArray.length);

    if (isFinite(average) && average > 0) {
      averageDecibels.push(average);
      const totalAverage = Math.round(
        averageDecibels.reduce((a, b) => a + b) / averageDecibels.length
      );
      if (average > 4) {
        console.log(totalAverage, average);
      }
    }

    // keep array at a reasonable length.
    if (averageDecibels.length >= 2048) {
      averageDecibels = [];
    }
  }
  return {
    detectNoise: detect,
  };
}
