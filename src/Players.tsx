import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { SpotifyBox } from "./players/SpotifyBox";
import { YoutubeBox } from "./players/YoutubeBox";
import { Item, Clip } from "./Croaker"

export default function Players(
  { spotify, items, ...props } : {
    items:Item[]
    [key: string]: any
  }) {
  return (
    <View
      style={{
        // paddingTop: 200,
      }}
    >
      <div>Players:</div>
      <div style={{ display: "flex" }}>
        <SpotifyBox items={items} spotify={spotify} {...props} />
        <YoutubeBox items={items} {...props} />
      </div>
    </View>
  );
}
