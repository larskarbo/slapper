import React, { Component } from "react";
import { PADDING_SV } from "./SegmentView";

export default function Segment ({ children, from, to, duration, parent, style}) {
  let w = parent.getBoundingClientRect().width - (PADDING_SV*2)

  const startPos = PADDING_SV + (from / duration) * w
  const endPos = PADDING_SV + (to / duration) * w
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

