import Landmark from "./typeLandmark";

function distance2D(point1: Landmark, point2: Landmark): number {
  const [x1, y1] = point1;
  const [x2, y2] = point2;
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export { distance2D };
