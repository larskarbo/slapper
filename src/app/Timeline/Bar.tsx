import React, { useCallback, useEffect, useRef, useState } from 'react';

function useDragElement(parent) {
  // const [isOnline, setIsOnline] = useState(null);
  const [dragPercentage, setDragPercentage] = useState(0);
  const [hoverPercentage, setHoverPercentage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isReleased, setIsReleased] = useState(false);

  const onHitterDown = (e) => {
    setIsDragging(true)

    const coords = getCoordinates(getPosition(e), parent)
    const ms = xToPercentage(coords.x, parent)
    setDragPercentage(ms)

    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)
    setIsReleased(false)
  }

  const onDown = (e) => {
    setIsDragging(true)

    const coords = getCoordinates(getPosition(e), parent)
    const ms = xToPercentage(coords.x, parent)
    setDragPercentage(ms)

    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)
    setIsReleased(false)
  }

  const up = (e) => {
    window.removeEventListener("mousemove", move)
    window.removeEventListener("mouseup", up)
    const coords = getCoordinates(getPosition(e), parent)
    const ms = xToPercentage(coords.x, parent)

    setDragPercentage(ms)
    setIsDragging(false)
    setIsReleased(true)

  }

  const move = (e) => {
    e.preventDefault()
    const coords = getCoordinates(getPosition(e), parent)
    const ms = xToPercentage(coords.x, parent)
    setDragPercentage(ms)
  }

  const onMouseMove = (e) => {
    e.preventDefault()
    const coords = getCoordinates(getPosition(e), parent)
    const ms = xToPercentage(coords.x, parent)
    setHoverPercentage(ms)
  }

  const elementProps = {
    onMouseDown: onDown
  }

  const backgroundHitterProps = {
    onMouseDown: onHitterDown,
    onMouseMove: onMouseMove
  }

  return { elementProps, backgroundHitterProps, isDragging, isReleased, dragPercentage, hoverPercentage }
}

function Handle({ value, duration, parent, onUp, isPlaying }) {
  const [pointerAtRolling, setPointerAtRolling] = useState(0);
  const { elementProps, backgroundHitterProps, isDragging, isReleased, dragPercentage,
    hoverPercentage
  } = useDragElement(parent)
  const draggingPointerValue = Math.round(duration * (dragPercentage))
  const hoverValue = Math.round(duration * (hoverPercentage))
  const [isUsingDragValue, setIsUsingDragValue] = useState(false)

  useEffect(() => {
    if (isReleased) {
      onUp(draggingPointerValue)
    }
  }, [isReleased])

  useEffect(() => {
    if (isDragging) {
      setIsUsingDragValue(true)
    }
  }, [isDragging])

  useEffect(() => {
    if (isUsingDragValue) {
      setIsUsingDragValue(false)
    }
  }, [value])


  useEffect(() => {
    setPointerAtRolling(value);
    const INTERVAL = 200;
    if (isPlaying) {
      const interval = setInterval(() => {
        setPointerAtRolling((pointerAt) => {
          return Math.min(pointerAt + INTERVAL, duration)
        }
        );
      }, INTERVAL);
      return () => clearInterval(interval);
    }
  }, [value, isPlaying, duration]);


  const val = isUsingDragValue ? draggingPointerValue : pointerAtRolling
  return (
    <div {...backgroundHitterProps} className="cursor-pointer group flex items-center h-8 w-full">
      asdf
      <div className="bg-gray-500 absolute w-full h-xs h-0.5 group-hover:h-1"></div>
      <div className={" absolute h-0.5 group-hover:h-1 " + (isUsingDragValue ? "bg-green-300" : "bg-red-300")} style={{
        width: (val / duration) * 100 + "%"
      }}></div>
      <div
        // {...elementProps}
        className={"rounded-full absolute h-3 w-3 opacity-0 group-hover:opacity-100 " + (isUsingDragValue ? "bg-green-300" : "bg-red-300")} style={{
          marginLeft: `calc(${(val / duration) * 100}% - ${14 / 2}px`
        }}
      >
      </div>
      <div className="absolute group-hover:opacity-100 opacity-0 top-4 bg-gray-700 text-xs p-1 whitespace-nowrap text-white rounded" style={{
        left: (hoverValue / duration) * 100 + "%"
      }}>
        {Math.round(hoverValue / 1000)} s
      </div>

    </div>
  );
}

export default Handle;


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

export const xToPercentage = (x, parent) => {
  const width = parent.getBoundingClientRect().width;
  const percentage = (x) / width
  if (percentage < 0) {
    return 0;
  }
  if (percentage > 1) {
    return 1;
  }
  return percentage;
};