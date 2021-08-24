import React, { useEffect, useState } from "react";
import Handle from "./app/Timeline/Bar";
import Segment from "./app/Timeline/Segment";

export const ClipSimpleForLooper = ({ isHovering, duration, parent, clip }) => {
  // const { clipNow } = useClip();
  // const { editClip } = useSlapData();

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
        style={
          {
            // opacity: isHovering ? 0.5 : 0.2,
            // borderRadius: 3,
          }
        }
        duration={duration}
        parent={parent}
        from={localFrom}
        to={localTo}
      >
        <div className="flex items-center">
          <div className="text-xs whitespace-nowrap">{clip.title}</div>
        </div>
        <div
          style={{
            height: 60,
            background: "rgba(196,196,196,0.31)",
            border: "1px solid black",
          }}
        ></div>
        <div
          style={{
            height: 20,
          }}
        ></div>
      </Segment>
      <Handle
        duration={duration}
        value={localFrom}
        parent={parent}
        updateValue={(a) => {
          setLocalFrom(a);
        }}
        onUp={(a) => {
          // editClip(clipNow.slap.id, clipNow.item.id, clipNow.clip.id, {
          //   from: localFrom,
          // });
        }}
        bottomMargin={20}
        isHovering={isHovering}
      />

      <Handle
        duration={duration}
        value={localTo}
        parent={parent}
        updateValue={(a) => {
          setLocalTo(a);
        }}
        onUp={(a) => {
          // editClip(clipNow.slap.id, clipNow.item.id, clipNow.clip.id, {
          //   to: localTo,
          // });
        }}
        bottomMargin={20}
        isHovering={isHovering}
      />
    </>
  );
};
