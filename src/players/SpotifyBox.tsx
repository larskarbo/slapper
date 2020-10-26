import Authorize from "../Authorize";
import DeviceSelector from "../DeviceSelector";
import React, { useEffect } from "react";
import { Item, Clip } from "./Croaker"


export const SpotifyBox = ({ spotify, items } : {
  items:Item[]
  [key: string]: any
}) => {
  useEffect(() => spotify.playPauseWhatever(items), [items]);
  
  return (
    <div style={{
      width:200,
      height: 100,
      // overflow: "hidden",
      border: "2px solid green"
    }}>
      <Authorize spotify={spotify} />

      {spotify.credentials && <DeviceSelector spotify={spotify} />}
    </div>
  );
};
