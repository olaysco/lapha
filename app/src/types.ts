export type Settings = {
  movementDetection: boolean;
  noiseDetection: boolean;
  videoQuality: string;
  detectionSensitivity: number;
};
export interface HTMLVideoElementWithCaptureStream extends HTMLVideoElement {
  captureStream(): MediaStream;
}
