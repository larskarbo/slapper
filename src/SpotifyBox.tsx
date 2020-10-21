import Authorize from "./Authorize";
import DeviceSelector from "./DeviceSelector";
import React from "react";


export const SpotifyBox = ({ spotify }) => {
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
