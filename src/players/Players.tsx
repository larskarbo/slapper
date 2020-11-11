import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { SpotifyBox } from "./SpotifyBox";
import { YoutubeBox } from "./YoutubeBox";
import { Item, Clip } from "../Croaker";

export interface PlayingNow {
  type: "item" | "clip"
  item: Item
  position: number
  state: "playing" | "paused"
  clip?: Clip
}

export interface PlayIntent {
  action: "pause" | "scrub" | "play"
  item?: Item
  clip?: Clip
  type?: "item" | "clip"
  to?: number
}

export default function Players({
  spotify,
  items,
  ...props
}: {
  items: Item[];
  [key: string]: any;
}) {
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
        <SpotifyBox items={items} spotify={spotify} {...props} />
        <YoutubeBox items={items} {...props} />
      </div>
    </View>
  );
}
