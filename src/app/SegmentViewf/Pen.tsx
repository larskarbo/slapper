import useHover from "@react-hook/hover";
import React, { Component, useEffect, useRef, useState } from "react";
import { PADDING_SV } from "./SegmentView";
import { getCoordinates, getPosition, xToMS } from "../Timeline/util";

let y = 0
let isInsideAClip = false
export default function Pen ({ clips, duration, parent, createClip}) {
  const [mouseMS, setMouseMS] = useState(0);
  

  const onMove = (e) => {
    const coords = getCoordinates(getPosition(e), parent);
    y = coords.y
    const ms = xToMS(coords.x, duration, parent);
    setMouseMS(ms);
  };

  useEffect(() => {
    parent.onmousemove = onMove
  }, [parent, duration])

  // parent.onclick = () => {
  //   if(!isInsideAClip && y > 60){
      
  //   }
  // }

  isInsideAClip = clips.some(c => mouseMS > (c.from - 1000) && mouseMS < (c.to + 1000))

  if(isInsideAClip || y > 30){
    return null
  }
  let w = parent.getBoundingClientRect().width - (PADDING_SV*2)
  const posCalced = PADDING_SV + (mouseMS / duration) * w
  return (
    <>
      <div style={{
        width: 20,
        position: 'absolute',
        top: 0,
        left: posCalced - 10,
        height: 60,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
      onClick={()=>createClip(mouseMS)}
      >
        <div style={{
          height: 30,
          backgroundColor: "#e2e2e2",
          border: "1px solid black",
          textAlign: "center",
          cursor: "default",
          width:"100%",
        }}>

        +
        </div>
        <div style={{
          backgroundColor: "black",
          width: 1,
          height: 30
        }}></div>
        </div>
    </>
  )
}

