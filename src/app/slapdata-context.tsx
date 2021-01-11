// src/playingNow-context.js
import * as React from 'react'
import Spotify from '../Spotify';
import { Item } from '../Croaker';
import { useState, useEffect } from 'react';
import { usePlayingNowState } from './players/player-context';
import { request } from './utils/request';
import { useUser } from './user-context';


const SlapDataContext = React.createContext(undefined)

// const spotifyOriginal = new Spotify()


export function SlapDataProvider({ children }) {
  const [slaps, setSlaps] = useState([])
  const [slapsLoaded, setSlapsLoaded] = useState(false)
  const [spotifyLists, setSpotifyLists] = useState([])
  const {spotify} = usePlayingNowState()
  const {user} = useUser()

  useEffect(() => {
    console.log("here!")
    if(user){
      request("GET", "fauna/myCollections").then((res: any) => {
        console.log('res: ', res);
        setSlaps(
          res.map((r) => ({
            ...r.data,
            id: r.ref["@ref"].id,
            link: "/app/slap/" + r.ref["@ref"].id
          }))
        );
        setSlapsLoaded(true)
        // setActiveSlap(279439751993360901);
      }).catch((error) => {
        console["error"]('error: ', error);
  
      })
    }

  }, [user]);

  useEffect(() => {
    if(spotify.me && slapsLoaded){
      spotify.api.getUserPlaylists(spotify.me.id).then((res:any) => {
          console.log('res: ', res);
          setSpotifyLists(
            res.items
            .filter((spotifyList) => {
              if(slaps.find(s => s.spotifyLinked == spotifyList.id)){
                return false
              }
              return true
            })
            .map((r) => ({
              ...r,
              title: r.name,
              img: r.images[0].url,
              link: "/app/spotify/playlist/" + r.id
            }))
          );
          // setActiveSlap(279439751993360901);
        }).catch((error) => {
          console["error"]('error: ', error);
    
        })
    }
  },[spotify?.me, slapsLoaded])
  
  return (
    <SlapDataContext.Provider value={{slaps, spotifyLists}}>
        {children}
    </SlapDataContext.Provider>
  )
}

export function useSlapData() {
  const context = React.useContext(SlapDataContext)
  if (context === undefined) {
    throw new Error('usePlayingNowState must be used within a PlayingNowProvider')
  }
  return context
}