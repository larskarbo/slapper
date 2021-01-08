import Handle from "./Handle";
import Segment from "./Segment";
import React, { Component, useEffect, useRef, useState } from "react";
import "./SegmentView.css";
import niceTicks from "nice-ticks";
import useHover from "@react-hook/hover";
import Play from "../comp/Play";
import { CleanInput, TText } from "../utils/font";
import CircleButton from "../comp/CircleButton";
import { MdDelete } from "react-icons/md";
import { getCoordinates, getPosition } from "./util";
import Pen from "./Pen";
import { Clip } from "./Clip";
import { isClipPlaying } from "../utils/helpers";

export const msToTime = (ms) => {
  return new Date(ms).toISOString().substr(15, 4);
};

export const PADDING_SV = 10;

export default function SegmentView({
  playing = true,
  pointerAt,
  duration,
  onScrub,
  onUpdateClip,
  item,
  clips,playingNow,
  onAddClip,
  onDeleteClip,
  onPlay,
  onPause,
}) {
  const [pointerAtRolling, setPointerAtRolling] = useState(0);
  const [draggingPointerValue, setDraggingPointerValue] = useState(0);
  const [draggingPointer, setDraggingPointer] = useState(false);
  const [mouseMS, setMouseMS] = useState(0);
  const lineRef = useRef(null);
  const isHovering = useHover(lineRef);

  useEffect(() => {
    setPointerAtRolling(pointerAt);
    const INTERVAL = 100;
    if (playing) {
      const interval = setInterval(() => {
        setPointerAtRolling((pointerAt) =>{
          window.guessingPosition = Math.min(pointerAt + INTERVAL, duration)
         return Math.min(pointerAt + INTERVAL, duration)
        }
        );
      }, INTERVAL);
      return () => clearInterval(interval);
    }
  }, [pointerAt, playing, duration]);

  

  return (
    <div
      style={{
        position: "relative",
        height: 50,
        borderLeftStyle: "solid",
        borderLeftColor: "#727272",
        borderLeftWidth: 1,
        display: "flex",
        flexGrow: 1,
      }}
      ref={lineRef}
    >
      {lineRef.current && (
        <>
          <TText
            style={{
              top: 5,
              left: 5,
              position: "absolute",
            }}
          >
            {msToTime(pointerAtRolling)}
          </TText>
          <TText
            style={{
              top: 5,
              right: 5,
              position: "absolute",
            }}
          >
            {msToTime(duration)}
          </TText>

          <Segment
            style={{
              height: 4,
              transform: "translateY(-50%)",
              top: "50%",
              backgroundColor: "#9B9B9B",
            }}
            parent={lineRef.current}
            from={0}
            to={duration}
            duration={duration}
          />

          <Segment
            style={{
              height: 4,
              transform: "translateY(-50%)",
              top: "50%",
              backgroundColor: "#606060",
            }}
            parent={lineRef.current}
            from={0}
            to={pointerAtRolling}
            duration={duration}
          />

          {clips.map((clip) => (
            <Clip
              key={clip.id}
              isHovering={isHovering}
              duration={duration}
              clip={clip}
              clips={clips}
              onDeleteClip={() => onDeleteClip(item, clip)}
              parent={lineRef.current}
              onUpdate={(obj) => onUpdateClip(clip, obj)}
              onPlay={onPlay}
              onPause={onPause}
              playing={isClipPlaying(playingNow,clip)}
            />
          ))}

          {/* <Pen
            duration={duration}
            pos={mouseMS}
            clips={clips}
            parent={lineRef.current}
            createClip={(ms) => {
              onAddClip(item, {from:ms, to:ms+10000})
            }
            }
            // onUpdate={(obj) => onUpdateClip(clip, obj)}
          /> */}

          <Handle
            duration={duration}
            value={draggingPointer ? draggingPointerValue : pointerAtRolling}
            parent={lineRef.current}
            color="#606060"
            style={{
              transform: "translateY(-50%)",
              top: "50%",
            }}
            updateValue={(a) => {
              setDraggingPointerValue(a);
            }}
            onDown={(a) => {
              setDraggingPointer(true);
            }}
            onUp={() => {
              onScrub(draggingPointerValue);
              setDraggingPointer(false);
            }}
            isHovering={isHovering}
          />
        </>
      )}
    </div>
  );
}
