import Handle from './Handle'
import Segment from './Segment'
import React, { Component, useEffect, useRef, useState } from "react";
import "./SegmentView.css"
import { Text } from 'react-native';
import niceTicks from 'nice-ticks';
import useHover from '@react-hook/hover';

export const msToTime = ms => {
  return new Date(ms).toISOString().substr(15, 4);
}

export const PADDING_SV = 10

export default function SegmentView({ playing = true, pointerAt, duration, segment, onUpdateSegment, onScrub }) {
  const [pointerAtRolling, setPointerAtRolling] = useState(0)
  const [draggingPointerValue, setDraggingPointerValue] = useState(0)
  const [draggingPointer, setDraggingPointer] = useState(false)
  const lineRef = useRef(null);
  const isHovering = useHover(lineRef)
  

  useEffect(() => {
    
    setPointerAtRolling(pointerAt)
    const INTERVAL = 100
    if(playing){
      const interval = setInterval(() => {
        
        setPointerAtRolling(pointerAt => Math.min(pointerAt + INTERVAL, duration))
      }, INTERVAL)
      return () => clearInterval(interval)
    }
  }, [pointerAt, playing, duration])

  return (
    <div style={{
      position: 'relative',
      height: 60,
      backgroundColor: "#c3c3c3",
      borderLeftStyle: "solid",
      borderLeftColor: "#727272",
      borderLeftWidth: 1
    }}
      ref={lineRef}
    >
      <Text style={{
        top: 5,
        left: 5,
        position: 'absolute'
      }}>{msToTime(pointerAtRolling)}</Text>
      <Text style={{
        top: 5,
        right: 5,
        position: 'absolute'
      }}>{msToTime(duration)}</Text>


      <Segment
        style={{
          opacity: isHovering ? 1 : 0.2
        }}
        duration={duration}
        parent={lineRef.current}
        from={segment.from}
        to={segment.to}
        color="#9595957b"
      />

      <Segment style={{
        height: 2,
      }}
        parent={lineRef.current}
        from={0}
        to={duration}
        duration={duration}
        color="black"
      />

      <Segment style={{
        height: 2,
      }}
        parent={lineRef.current}
        from={0}
        to={pointerAtRolling}
        duration={duration}
        color="red"
      />


      <Handle
        duration={duration}
        value={segment.from}
        parent={lineRef.current}
        updateValue={a => {
          if (segment.to - a < 2000) {
            return
          }
          onUpdateSegment({
            ...segment,
            from: a
          })
        }}
        isHovering={isHovering}
      />

      
      <Handle
        duration={duration}
        value={segment.to}
        parent={lineRef.current}
        updateValue={a => {
          onUpdateSegment({
            ...segment,
            to: a
          })
        }}
        isHovering={isHovering}
      />


      <Handle
        duration={duration}
        value={draggingPointer ? draggingPointerValue : pointerAtRolling}
        parent={lineRef.current}
        color="red"
        updateValue={a => {
          setDraggingPointerValue(a)
        }}
        onDown={a => {
          setDraggingPointer(true)
        }}
        onUp={() => {
          
          onScrub(draggingPointerValue)
          setDraggingPointer(false)
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
  )


}