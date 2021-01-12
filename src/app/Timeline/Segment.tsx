import React, { Component } from "react";
import { PADDING_SV } from "../SegmentViewf/SegmentView";

export default function Segment ({ children, from, to, duration, parent, style}) {
  let w = parent.getBoundingClientRect().width

  const startPos = (from / duration) * w
  const endPos = (to / duration) * w
  return (
    <>
      <div style={{
        width: endPos - startPos,
        position: 'absolute',
        top: 0,
        left: startPos,
        ...style
      }}
      >
        {children}
        
        </div>
    </>
  )
}

