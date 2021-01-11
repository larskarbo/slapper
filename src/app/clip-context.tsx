// src/playingNow-context.js
import * as React from 'react'
import Spotify from '../Spotify';
import { Item } from '../Croaker';
import { useState, useEffect } from 'react';
import { usePlayingNowState } from './players/player-context';
import { request } from './utils/request';
import { useUser } from './user-context';


const ClipContext = React.createContext(undefined)

// const spotifyOriginal = new Spotify()


export function ClipProvider({ children }) {
  const [clipNow, setClipNow] = useState(null)

  const focusClip = (clip) => {
    console.log('clip: ', clip);
    setClipNow({
      clip
    })

  }
  
  return (
    <ClipContext.Provider value={{clipNow, focusClip}}>
        {children}
    </ClipContext.Provider>
  )
}

export function useClip() {
  const context = React.useContext(ClipContext)
  if (context === undefined) {
    throw new Error('useClip must be used within a ClipProvider')
  }
  return context
}