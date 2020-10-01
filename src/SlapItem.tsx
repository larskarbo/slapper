import useHover from "@react-hook/hover";
import React, { useState, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import SegmentView, { msToTime } from "./SegmentView/SegmentView";
import { Entypo } from "@expo/vector-icons";
export const SlapItem = ({
  loading,
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
  text,
  onSetText,
}) => {
  // useEffect(() => {
  //   if (!loading) {
  //     // setSegment({
  //     //   start: from,
  //     //   end: duration
  //     // })
  //   }
  // }, [loading])

  return (
    <View
      style={{
        width: 500 + 200,
        height: 60,
        borderWidth: 2,
        boxSizing: "content-box",
        borderColor: "black",
        backgroundColor: "#e6e6e6",
        display: "flex",
        flexDirection: "row",
        marginBottom: 10,
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          position: "relative",
        }}
      >
        {children}
        <Play
          playing={playing}
          onPress={() => {
            playing ? onPause() : onPlay();
          }}
        />
      </View>

      <View
        style={{
          width: 180,
          height: 60,
          justifyContent: "center",
          padding: 6,
        }}
      >
        <Text
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            fontWeight: "bold",
          }}
        >
          {title}
        </Text>
        <Text>{msToTime(duration)}</Text>
      </View>

      <View
        style={{
          width: 260,
          height: 60,
        }}
      >
        {!loading && (
          <SegmentView
            segment={segment}
            duration={duration}
            onUpdateSegment={setSegment}
            pointerAt={pointerAt}
            playing={playing}
            onScrub={onScrub}
          />
        )}
      </View>

      <View
        style={{
          width: 200,
          height: 60,
        }}
      >
        <textarea
          style={{
            width: 200,
            height: 60,
            backgroundColor: "#ffff88",
          }}
          onChange={(e) => onSetText(e.target.value)}
        >
          {text}
        </textarea>
      </View>
    </View>
  );
};

const Play = ({ onPress, playing }) => {
  const ref = useRef(null);
  const isHover = useHover(ref);
  const show = isHover || !playing;

  return (
    <div
      onClick={onPress}
      ref={ref}
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
        backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent",
        opacity: show ? 1 : 0,
        cursor:"pointer",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {playing ? (
        <Entypo name="controller-paus" size={34} color="white" />
      ) : (
        <Entypo name="controller-play" size={34} color="white" />
      )}
    </div>
  );
};
