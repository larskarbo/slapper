import React, { useEffect, useRef, useState } from "react";
import { request } from "../utils/request";
import { Link } from 'gatsby';
import { useSpotify } from "../players/spotify-context";
import { Box } from "./Home"
import { useSlapData } from "../slapdata-context";

export default function ({ user }) {
  const {slaps, spotifyLists} = useSlapData()

  return (
    <div>
      <h1 className="text-4xl font-black mb-12">Home</h1>
      <h2 className="text-xl font-medium mb-4">My Slapper Lists</h2>
      <div className="flex flex-row flex-wrap">
        {slaps.map(slap => (
          <Box key={slap.id || slap.trackId} slap={slap} />
        ))}
      </div>
      <h2 className="text-xl font-medium mb-4">Spotify Playlists</h2>
      <div className="flex flex-row flex-wrap">
        {spotifyLists.map(slap => (
          <Box key={slap.id || slap.trackId} slap={slap} />
        ))}
      </div>
    </div>
  );
}

