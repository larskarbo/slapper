import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { SpotifyBox } from "./SpotifyBox";
import { YoutubeBox } from "./YoutubeBox";
import { Item, Clip } from "../Croaker";

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

let timer = setTimeout(()=>{})
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
  useEffect(() => {
    if(playingNow?.state !== "playing"){
      clearTimeout(timer);
      return
    }
    if(playingNow?.position){
      if (playingNow.type == "clip") {
        const realClip = items.find((i) => playingNow.item.id == i.id)?.clips.find(c => playingNow.clip.id == c.id)
        const timeUntilPause =
          realClip.to - playingNow.position;
        clearTimeout(timer);
        if(timeUntilPause > 0){
          timer = setTimeout(() => {
            if (clipRepeat) {
              const playable = {
                type: "clip",
                item: playingNow.item,
                clip: realClip,
              };
              onPlay(playable);
            } else {
              
              onPause()
            }
          }, timeUntilPause);
        }
      }
    }
  }, [playingNow?.position, playingNow?.state]);

  return (
    <View
      style={
        {
          // paddingTop: 200,
        }
      }
    >
      <div>Players:</div>
      <div style={{ display: "flex" }}>
        <SpotifyBox playingNow={playingNow} items={items} spotify={spotify} {...props} />
        <YoutubeBox playingNow={playingNow} items={items} {...props} />
      </div>
    </View>
  );
}
