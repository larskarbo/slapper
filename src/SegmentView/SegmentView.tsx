import Handle from "./Handle";
import Segment from "./Segment";
import React, { Component, useEffect, useRef, useState } from "react";
import "./SegmentView.css";
import { Text, View } from "react-native";
import niceTicks from "nice-ticks";
import useHover from "@react-hook/hover";
import Play from "../comp/Play";
import { CleanInput, TText } from "../utils/font";
import CircleButton from "../comp/CircleButton";
import { MdDelete } from "react-icons/md";
import { getCoordinates, getPosition } from "./util";
import Pen from "./Pen";

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
  clips,
  onAddClip,
  onPlay,
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
        setPointerAtRolling((pointerAt) =>
          Math.min(pointerAt + INTERVAL, duration)
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
              parent={lineRef.current}
              onUpdate={(obj) => onUpdateClip(clip, obj)}
              onPlay={onPlay}
            />
          ))}

          <Pen
            duration={duration}
            pos={mouseMS}
            clips={clips}
            parent={lineRef.current}
            createClip={(ms) => {
              onAddClip(item, {from:ms, to:ms+10000})
            }
            }
            // onUpdate={(obj) => onUpdateClip(clip, obj)}
          />

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

const Clip = ({
  isHovering,
  onPlay,
  duration,
  parent,
  clip,
  onUpdate,
  clips,
}) => {
  const [localFrom, setLocalFrom] = useState(clip.from);
  const [localTo, setLocalTo] = useState(clip.to);

  useEffect(() => {
    setLocalFrom(clip.from);
  }, [clip.from]);

  useEffect(() => {
    setLocalTo(clip.to);
  }, [clip.to]);

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
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            height: 40,
          }}
        >
           <View 
          style={{
            flexDirection: "column",
          }}
          >
          <CleanInput
            value={clip.title}
            style={{
              backgroundColor: "transparent",
              fontSize: 10
            }}
            onChange={(value) => {
              onUpdate({
                title: value,
              });
            }}
          ></CleanInput>
          </View>
          <View 
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}>
          <Play
            onPress={() => {
              onPlay(clip);
            }}
            small
            playing={false}
            style={{ paddingRight: 2 }}
          />
          <CircleButton Icon={MdDelete} small />

          </View>
         
        </View>
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
          let thisClipIndex = clips.findIndex((c) => c.id == clip.id);
          let boundaryStart =
            thisClipIndex == 0 ? 0 : clips[thisClipIndex - 1].to;
          if (a - boundaryStart < 1000) {
            setLocalFrom(boundaryStart);
          } else {
            setLocalFrom(a);
          }
        }}
        onUp={(a) => {
          onUpdate({
            from: localFrom,
          });
        }}
        bottomMargin={20}
        isHovering={isHovering}
      />

      <Handle
        duration={duration}
        value={localTo}
        parent={parent}
        updateValue={(a) => {
          let thisClipIndex = clips.findIndex((c) => c.id == clip.id);
          const lastIndex = clips.length - 1;
          let boundaryEnd =
            thisClipIndex == lastIndex
              ? duration
              : clips[thisClipIndex + 1].from;
          if (boundaryEnd - a < 1000) {
            setLocalTo(boundaryEnd);
          } else {
            setLocalTo(a);
          }
        }}
        onUp={(a) => {
          onUpdate({
            to: localTo,
          });
        }}
        bottomMargin={20}
        isHovering={isHovering}
      />
    </>
  );
};
