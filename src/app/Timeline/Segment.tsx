import React, { Component } from "react";

export default function Segment({ children, from, to, duration, parent }) {
  let w = parent.getBoundingClientRect().width;

  const startPos = (from / duration) * w;
  const endPos = (to / duration) * w;
  return (
    <>
      <div
        className="absolute top-0"
        style={{
          width: endPos - startPos,
          left: startPos,
        }}
      >
        {children}
      </div>
    </>
  );
}
