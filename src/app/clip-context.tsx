// src/playingNow-context.js
import * as React from 'react'
import Spotify from '../Spotify';
import { Item } from '../Croaker';
import { useState, useEffect } from 'react';
import { usePlayingNowState } from './players/player-context';
import { request } from './utils/request';
import { useUser } from './user-context';
import { useSlapData } from './slapdata-context';


const ClipContext = React.createContext(undefined)

// const spotifyOriginal = new Spotify()


export function ClipProvider({ children }) {
  const [focusedClip, setFocusedClip] = useState(null)
  const {slaps} = useSlapData()

  const focusClip = (clipId, itemId, slapId) => {
    console.log('clipId, itemId, slapId: ', clipId, itemId, slapId);
    return
    setFocusedClip({
      clipId,
      itemId,
      slapId
    })
  }

  const defocus = () => {
    setFocusedClip(null)
  }

  let clipNow = null
  
  if(focusedClip){
    const slap = slaps.find(s => s.id == focusedClip.slapId)
    
    
    const item = slap.items.find(i => i.id == focusedClip.itemId)
    const clip = item.clips.find(c => c.id == focusedClip.clipId)

    clipNow = {
      slap, item, clip
    }
  }
  
  return (
    <ClipContext.Provider value={{clipNow, focusClip, defocus}}>
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