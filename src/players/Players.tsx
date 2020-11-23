import React, { useState, useEffect, useMemo } from "react";
import { View } from "react-native";
import { SpotifyBox } from "./SpotifyBox";
import { YoutubeBox } from "./YoutubeBox";
import { Item, Clip } from "../Croaker";
import { TimerMan } from "./TimerMan";

export interface PlayingNow {
  type: "item" | "clip";
  item: Item;
  position: number;
  state: "playing" | "paused";
  clip?: Clip;
}

export interface PlayIntent {
  action: "pause" | "scrub" | "play";
  item?: Item;
  clip?: Clip;
  type?: "item" | "clip";
  to?: number;
}

export default function Players({
  spotify,
  items,
  playingNow,
  onEndOfClip,
  onPlay,
  clipRepeat,
  onPause,
  ...props
}: {
  items: Item[];
  [key: string]: any;
}) {
  const [timerState, setTimerState] = useState("")
  const timerMan = useMemo(() => new TimerMan(clipRepeat, onPlay, onPause), []);

  useEffect(() => {
    timerMan.clipRepeat = clipRepeat
  }, [clipRepeat])
  
  useEffect(() => {
    console.log('playingNow: ', playingNow?.position);
    timerMan.whatToDo(playingNow, items)
  }, [playingNow, items]);

  return (
    <View
      style={
        {
          // paddingTop: 200,
        }
      }
    >
      <div>Players:</div>
      {timerState}
      <div style={{ display: "flex" }}>
        <SpotifyBox
          playingNow={playingNow}
          items={items}
          spotify={spotify}
          {...props}
        />
        <YoutubeBox playingNow={playingNow} items={items} {...props} />
      </div>
    </View>
  );
}
