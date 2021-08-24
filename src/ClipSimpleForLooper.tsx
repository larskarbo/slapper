import React, { useEffect, useState } from "react";
import Handle from "./app/Timeline/Handle";
import Segment from "./app/Timeline/Segment";
import clsx from "clsx";
export const ClipSimpleForLooper = ({
  isHovering,
  active,
  duration,
  parent,
  clip,
  onUpdateClip,
}) => {
  const [localFrom, setLocalFrom] = useState(clip?.from);
  const [localTo, setLocalTo] = useState(clip?.to);

  useEffect(() => {
    setLocalFrom(clip.from);
  }, [clip.from]);

  useEffect(() => {
    setLocalTo(clip.to);
  }, [clip.to]);

  if (!clip) {
    return null;
  }

  return (
    <>
      <Segment
        duration={duration}
        parent={parent}
        from={localFrom}
        to={localTo}
      >
        <div
          className={clsx(
            "h-16 border bg-opacity-20",
            active
              ? "border-red-500 bg-red-500"
              : "border-gray-900 bg-gray-500 "
          )}
        ></div>
      </Segment>
      <Handle
        color={active ? "red" : "gray"}
        duration={duration}
        value={localFrom}
        parent={parent}
        updateValue={(a) => {
          setLocalFrom(a);
        }}
        onUp={() => {
          onUpdateClip({
            from: localFrom,
            to: localTo,
          });
        }}
        bottomMargin={16}
        isHovering={isHovering}
      />

      <Handle
        color={active ? "red" : "gray"}
        duration={duration}
        value={localTo}
        parent={parent}
        updateValue={(a) => {
          setLocalTo(a);
        }}
        onUp={() => {
          onUpdateClip({
            to: localTo,
            from: localFrom,
          });
        }}
        bottomMargin={16}
        isHovering={isHovering}
      />
    </>
  );
};
