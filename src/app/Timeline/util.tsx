import { PADDING_SV } from "../SegmentViewf/SegmentView";

export function getPosition(e) {
  if (typeof e.touches !== "undefined") {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  } else {
    return {
      x: e.clientX,
      y: e.clientY
    };
  }
}

export function getCoordinates(position, element) {
  var boundingRect = element.getBoundingClientRect();
  // use window.devicePixelRatio because if a retina screen, canvas has more pixels
  // than the getCoordinates
  var dpr = 1// typeof window !== "undefined" ? window.devicePixelRatio : 1;
  return {
    x: (position.x - boundingRect.left) * dpr,
    y: (position.y - boundingRect.top) * dpr
  };
}

export const xToMS = (x, duration, parent) => {
  const width = parent.getBoundingClientRect().width - PADDING_SV * 2;
  const ms = Math.round(((x - PADDING_SV) / width) * duration);
  if (ms < 0) {
    return 0;
  }
  if (ms > duration) {
    return duration;
  }
  return ms;
};