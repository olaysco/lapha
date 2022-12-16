export type Settings = {
  movementDetection: boolean;
  noiseDetection: boolean;
  videoQuality: string;
};
export interface HTMLVideoElementWithCaptureStream extends HTMLVideoElement {
  captureStream(): MediaStream;
}
