import useHover from '@react-hook/hover';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import SegmentView, { msToTime } from './SegmentView/SegmentView';


export const Splat = ({ loading,
  children,
  title = "...",
  duration = 0,
  pointerAt = 0,
  playing = true,
  onPause,
  onPlay,
  onScrub,
  segment,
  setSegment,
}) => {
  const [text, setText] = useState("")

  
  // useEffect(() => {
  //   if (!loading) {
  //     // setSegment({
  //     //   start: from,
  //     //   end: duration
  //     // })
  //   }
  // }, [loading])

  return (
    <View style={{
      width: 500 + 200,
      height: 60,
      borderWidth: 2,
      boxSizing: "content-box",
      borderColor: "black",
      backgroundColor: "#e6e6e6",
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 10
    }}>
      <View style={{
        width: 60,
        height: 60,
        position: 'relative'
      }}>
        {children}
        <Play onPress={() => { playing ? onPause() : onPlay() }} />
      </View>

      <View style={{
        width: 180,
        height: 60,
        justifyContent: "center",
        padding: 6
      }}>
        <Text style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          fontWeight: "bold"
        }}>{title}</Text>
        <Text>{msToTime(duration)}</Text>
      </View>

      <View style={{
        width: 260,
        height: 60,
      }}>
        {!loading &&
          <SegmentView
            segment={segment}
            duration={duration}
            onUpdateSegment={setSegment}
            pointerAt={pointerAt}
            playing={playing}
            onScrub={onScrub}
          />
        }
      </View>

      <View style={{
        width: 200,
        height: 60,
      }}>
        <textarea style={{
        width: 200,
        height: 60,
        backgroundColor: "#ffff88"
      }}onChange={e => setText(e.target.value)}> text</textarea>
      </View>
    </View>
  )
}


const Play = ({ onPress }) => {
  const ref = useRef(null)
  const isHover = useHover(ref)

  return (
    <div onClick={onPress}
      ref={ref}
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
        backgroundColor: isHover ? "rgba(0,0,0,0.5)" : "transparent",
      }}>
      {isHover && "play"}
    </div>
  )
}