import { distance2D } from "./calculateDistance2D";
import Landmark from "./typeLandmark";

function checkPaper(landmarks: Landmark[]): boolean {
  const palmBase = landmarks[0];
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  const threshold = 120;

  const isThumbRaised = distance2D(palmBase, thumbTip) > threshold;
  const isIndexRaised = distance2D(palmBase, indexTip) > threshold;
  const isMiddleRaised = distance2D(palmBase, middleTip) > threshold;
  const isRingRaised = distance2D(palmBase, ringTip) > threshold;
  const isPinkyRaised = distance2D(palmBase, pinkyTip) > threshold;

  return (
    isThumbRaised &&
    isIndexRaised &&
    isMiddleRaised &&
    isRingRaised &&
    isPinkyRaised
  );
}

function checkScissors(landmarks: Landmark[]): boolean {
  const palmBase = landmarks[0];
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  const thresholdClosed = 120;
  const thresholdOpen = 120;

  const isIndexRaised = distance2D(palmBase, indexTip) > thresholdOpen;
  const isMiddleRaised = distance2D(palmBase, middleTip) > thresholdOpen;
  const isThumbClosed = distance2D(palmBase, thumbTip) < thresholdClosed;
  const isRingClosed = distance2D(palmBase, ringTip) < thresholdClosed;
  const isPinkyClosed = distance2D(palmBase, pinkyTip) < thresholdClosed;

  return (
    isIndexRaised &&
    isMiddleRaised &&
    isThumbClosed &&
    isRingClosed &&
    isPinkyClosed
  );
}

function checkFist(landmarks: Landmark[]): boolean {
  const palmBase = landmarks[0];
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  const threshold = 120;

  const isThumbClosed = distance2D(palmBase, thumbTip) < threshold;
  const isIndexClosed = distance2D(palmBase, indexTip) < threshold;
  const isMiddleClosed = distance2D(palmBase, middleTip) < threshold;
  const isRingClosed = distance2D(palmBase, ringTip) < threshold;
  const isPinkyClosed = distance2D(palmBase, pinkyTip) < threshold;

  return (
    isThumbClosed &&
    isIndexClosed &&
    isMiddleClosed &&
    isRingClosed &&
    isPinkyClosed
  );
}
export { checkPaper, checkScissors, checkFist };
