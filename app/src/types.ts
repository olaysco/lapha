export type Settings = {
  movementDetection: boolean;
  noiseDetection: boolean;
  videoQuality: string;
  detectionSensitivity: number;
};

export type ConnectionParams = {
  hostIP: string;
  hostPort: number;
};
export interface HTMLVideoElementWithCaptureStream extends HTMLVideoElement {
  captureStream(): MediaStream;
}

export const NOTIFICATIONS = {
  MOVEMENT: "movement_detection_alert",
  NOISE: "sound_detection_alert",
};
