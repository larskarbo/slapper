
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { View } from "react-native";
import CircleButton from "../comp/CircleButton";
import Play from "../comp/Play";
import { CleanInput } from "../utils/font";
import Handle from "./Handle";
import Segment from "./Segment";

export const Clip = ({
  isHovering,
  onPlay,
  onPause,
  onDeleteClip,
  playing,
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
              playing ? onPause() : onPlay(clip);
            }}
            small
            playing={playing}
            style={{ paddingRight: 2 }}
          />
          <CircleButton onPress={onDeleteClip} Icon={MdDelete} small />

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
