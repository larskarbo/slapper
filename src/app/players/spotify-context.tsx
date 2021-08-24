// src/playingNow-context.js
import * as React from "react";
import { useEffect, useState } from "react";
import { usePlayingNowState } from "./player-context";

const SpotifyContext = React.createContext(undefined);

// const spotifyOriginal = new Spotify()

export function SpotifyProvider({ children }) {
  const [devices, setDevices] = useState([]);
  const { spotify } = usePlayingNowState();

  useEffect(() => {
    // spotifyOriginal.onUpdateDevices = (devices) => {
    // 	setSpotify(spotifyOriginal)
    // }
    console.log("spotifyYOOOO: ", spotify);
  }, [spotify]);

  return (
    <SpotifyContext.Provider value={spotify}>
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotify() {
  const context = React.useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error(
      "usePlayingNowState must be used within a PlayingNowProvider"
    );
  }
  return context;
}
