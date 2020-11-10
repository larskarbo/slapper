import Handle from "./Handle";
import Segment from "./Segment";
import React, { Component, useEffect, useRef, useState } from "react";
import "./SegmentView.css";
import { Text } from "react-native";
import niceTicks from "nice-ticks";
import useHover from "@react-hook/hover";
import Play from "../comp/Play";
import { TText } from "../utils/font";

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
  clips,
}) {
  const [pointerAtRolling, setPointerAtRolling] = useState(0);
  const [draggingPointerValue, setDraggingPointerValue] = useState(0);
  const [draggingPointer, setDraggingPointer] = useState(false);
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
          backgroundColor: "#9B9B9B"
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
          backgroundColor: "#606060"
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
        />
      ))}

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

      {/* <Handle
              duration={duration}
              value={this.state.progress}
              parent={lineRef.current}
              updateValue={a => {
                this.setState({
                  progress: a
                })
              }}
              onDown={() => {
                this.setState({
                  seeking: true
                })
              }}
              onUp={() => {
                this.setState({
                  seeking: false
                })
                spotify.seek(this.state.progress)
              }}
              color={isInside ? "#009F06" : "#34ff34"}
            /> */}
    </div>
  );
}

const Clip = ({ isHovering, duration, parent, clip, onUpdate, clips }) => {
  const [localFrom, setLocalFrom] = useState(clip.from);
  const [localTo, setLocalTo] = useState(clip.to);

  return (
    <>
      <Segment
        style={{
          // opacity: isHovering ? 0.5 : 0.2,
          // borderRadius: 3,
        }}
        duration={duration}
        parent={parent}
        from={localFrom}
        to={localTo}
      >
        <div style={{
          height: 20,
        }}>
        <TText>{clip.title}</TText>

        </div>
        <div style={{
          height: 60,
          background: "rgba(196,196,196,0.31)",
          border: "1px solid black"
        }}>
          </div>
        <div style={{
          height: 20,
        }}>
          <Play small playing={false} />
        </div>

      </Segment>
      <Handle
        duration={duration}
        value={localFrom}
        parent={parent}
        updateValue={(a) => {
          if (localTo - a < 2000) {
            return;
          }
          setLocalFrom(a);
          // onUpdate({
          //   from: a,
          // });
        }}
        topMargin={20}
        isHovering={isHovering}
      />

      <Handle
        duration={duration}
        value={localTo}
        parent={parent}
        updateValue={(a) => {
          setLocalTo(a);
          // onUpdate({
          //   to: a,
          // });
        }}
        topMargin={20}
        isHovering={isHovering}
      />
    </>
  );
};
