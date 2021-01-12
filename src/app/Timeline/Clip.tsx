import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import CircleButton from "../comp/CircleButton";
import Play from "../comp/Play";
import { CleanInput } from "../utils/font";
import Handle from "./Handle";
import Segment from "./Segment";
import { IoPlaySharp } from 'react-icons/io5';
import { FaCross } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";
import { useClip } from "../clip-context";
import { useSlapData } from "../slapdata-context";

export const Clip = ({
  isHovering,
  duration,
  parent,
}) => {
  const {clipNow} = useClip()
  const {editClip} = useSlapData()
  const clip = clipNow.clip

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
        <div
          className="flex items-center"
        >
          
          <div className="text-xs whitespace-nowrap"
          >{clip.title}</div>
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
          // let thisClipIndex = clips.findIndex((c) => c.id == clip.id);
          // const lastIndex = clips.length - 1;
          // let boundaryStart = thisClipIndex == 0 ? 0 : clips[thisClipIndex - 1].to;
          // let boundaryEnd = clip.to;
          // console.log('boundaryStart: ', boundaryStart);
          // if (a - boundaryStart < 1000) {
          //   setLocalFrom(boundaryStart);
          // } else if (boundaryEnd - a < 1000) {
          //   setLocalFrom(boundaryEnd - 1000);

          // } else {
          // }
        }}
        onUp={(a) => {
          editClip(clipNow.slap.id, clipNow.item.id, clipNow.clip.id, {
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
          setLocalTo(a);
          // let thisClipIndex = clips.findIndex((c) => c.id == clip.id);
          // const lastIndex = clips.length - 1;
          // let boundaryStart = clip.from;
          // let boundaryEnd =
          //   thisClipIndex == lastIndex
          //     ? duration
          //     : clips[thisClipIndex + 1].from;
          // console.log("boundaryEnd: ", boundaryEnd);
          // if (boundaryEnd - a < 1000) {
          //   setLocalTo(boundaryEnd);
          // } else if (a - boundaryStart < 1000) {
          //   setLocalFrom(boundaryStart + 1000);
          // } else {
          // }
        }}
        onUp={(a) => {
          editClip(clipNow.slap.id, clipNow.item.id, clipNow.clip.id, {
            to: localTo,
          });
        }}
        bottomMargin={20}
        isHovering={isHovering}
      />
    </>
  );
};
