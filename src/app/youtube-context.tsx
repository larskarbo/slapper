// src/playingNow-context.js
import * as React from 'react'
import Spotify from '../Spotify';
import { Item } from '../Croaker';
import { useState, useEffect } from 'react';
import { usePlayingNowState } from './players/player-context';
import { request } from './utils/request';
import { useUser } from './user-context';
import update from 'immutability-helper';

import { v4 as uuidv4 } from "uuid";
import YouTube from 'react-youtube';

const YoutubeContext = React.createContext(undefined)

// const spotifyOriginal = new Spotify()


export function YoutubeProvider({ children }) {
  const [youtubeElement, setYoutubeElement] = useState(null);

  useEffect(() => {
  }, []);

  const getMetaInfo = (videoId) => {
  }


  return (
    <YoutubeContext.Provider value={{ youtubeElement, setYoutubeElement }}>
      {children}
    </YoutubeContext.Provider>
  )
}

export function useYoutube() {
  const context = React.useContext(YoutubeContext)
  if (context === undefined) {
    throw new Error('usePlayingNowState must be used within a PlayingNowProvider')
  }
  return context
}