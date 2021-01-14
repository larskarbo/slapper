// src/playingNow-context.js
import * as React from 'react'
import Spotify from '../Spotify';
import { Item } from '../Croaker';
import { NO_DEVICE_ERROR_MESSAGE } from '../Spotify';
import { useState, useEffect } from 'react';
import { useYoutube } from '../youtube-context';

type Action = { type: any, [key: string]: any }
type Dispatch = (action: Action) => void

type State = {
  // type: "item" | "clip";
  item?: Item;
  position?: {
    ms: number;
    timestamp: number;
  };
  state: "playing" | "paused" | "idle";
  // clip?: Clip;
}

function playingNowReducer(state, action) {
  switch (action.type) {
    case 'play_item': {
      return {
        item: action.item,
        position: action.position,
        state: "playing"
      }
    }
    case 'set_playback_state': {
      return {
        ...state,
        position: action.position,
        state: action.state
      }
    }
    case 'pause': {
      return {
        ...state,
        state: "paused"
      }
    }
    case 'play': {
      return {
        ...state,
        state: "playing"
      }
    }
    // case 'pause': {
    //   return {
    //     item: state.item,
    //     state: "paused"
    //   }
    // }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}


type PlayingNowProviderProps = { children: React.ReactNode }
const PlayingNowStateContext = React.createContext<State | undefined>(undefined)


const spotify = new Spotify()

export function PlayingNowProvider({ children }: PlayingNowProviderProps) {
  const [playingNow, setPlayingNow] = useState({
    state: "idle"
  })
  const [playingType, setPlayingType] = useState("spotify")

  const youtube = useYoutube()

  async function playItem(item: Item) {
    if (item.type == "youtube") {
      // youtube
      console.log('youtube: ', youtube);
      // youtube.playVideo(item.videoId)
      setPlayingType("youtube")
      setPlayingNow({
        item: item,
        state: "loading"
      })
      youtube.youtubeElement.target.cueVideoById(item.videoId, 0)
      youtube.youtubeElement.target.seekTo(0)
      youtube.youtubeElement.target.playVideo()
      spotify.pause()
    } else {
      try {

        setPlayingType("spotify")
        await spotify.play({ uris: ["spotify:track:" + item.trackId] })
          .then(() => {
            setPlayingNow({
              item: item,
              position: {
                ms: 0,
                timestamp: Date.now()
              },
              state: "playing"
            })
            // updatePlaybackState()
          })

      } catch (error) {
        if (error.message == NO_DEVICE_ERROR_MESSAGE) {

          spotify.mustOpenMenu()
        } else {
          alert("error," + error.message)

        }
      }
    }
  }

  async function playClip(item: Item, clip) {
    if (item.type == "youtube") {
      // youtube
      console.log('youtube: ', youtube);
      // youtube.playVideo(item.videoId)
      setPlayingType("youtube")
      setPlayingNow({
        item: item,
        clip: clip,
        state: "loading"
      })
      console.log('clip: ', clip);
      if (youtube.youtubeElement.target.getVideoData()['video_id'] != item.videoId) {
        youtube.youtubeElement.target.cueVideoById(item.videoId, clip.from / 1000)
        youtube.youtubeElement.target.playVideo()
      }
      youtube.youtubeElement.target.seekTo(clip.from / 1000)
      spotify.pause()
    } else {
      await spotify.play({ uris: ["spotify:track:" + item.trackId], position_ms: clip.from })
        .then(() => {
          setPlayingNow({
            item: item,
            clip: clip,
            position: {
              ms: clip.from,
              timestamp: Date.now()
            },
            state: "playing"
          })
          // updatePlaybackState()
        })
    }
  }

  useEffect(() => {
    spotify.onUpdatePlaybackState = (playbackState) => {
      if (playingType != "spotify") {
        return
      }
      if (!playbackState) {
        setPlayingNow(playingNow => ({
          ...playingNow,
          state: "paused"
        }))
      }
      setPlayingNow(playingNow => ({
        ...playingNow,
        position: playbackState ? {
          ms: playbackState.progress_ms,
          timestamp: Date.now()
        } : undefined,
        state: playbackState.is_playing ? "playing" : "paused"
      }))
    }
  }, [spotify, playingType])

  async function seek(to) {
    if (playingType == "spotify") {
      const updatedUser = await spotify.api.seek(to)
    } else {
      youtube.youtubeElement.target.seekTo(to / 1000)
    }
    // updatePlaybackState()
  }

  async function pause() {
    if (playingType == "spotify") {
      await spotify.api.pause()
        .then(() => {
          setPlayingNow({
            ...playingNow,
            state: "paused"
          })
          // updatePlaybackState(dispatch)
        })
    } else {
      youtube.youtubeElement.target.pauseVideo()
      setPlayingNow({
        ...playingNow,
        state: "paused"
      })
    }

  }

  async function play() {
    if (playingType == "spotify") {
      await spotify.api.play()
        .then(() => {
          // setPlayingNow({
          //   ...playingNow,
          //   state: "playing"
          // })
          // updatePlaybackState(dispatch)
        })
    } else {
      youtube.youtubeElement.target.playVideo()
      // setPlayingNow({
      //   ...playingNow,
      //   state: "playing"
      // })
    }
  }

  return (
    <PlayingNowStateContext.Provider value={{
      playingNow, playItem, playClip, pause, play, seek, spotify, setPlayingNow
    }}>
      {/* <PlayingNowDispatchContext.Provider value={dispatch}> */}
      {children}
      {/* </PlayingNowDispatchContext.Provider> */}
    </PlayingNowStateContext.Provider>
  )
}

export function usePlayingNowState() {
  const context = React.useContext(PlayingNowStateContext)
  if (context === undefined) {
    throw new Error('usePlayingNowState must be used within a PlayingNowProvider')
  }
  return context
}

// export function usePlayingNowDispatch() {
//   const context = React.useContext(PlayingNowDispatchContext)
//   if (context === undefined) {
//     throw new Error('usePlayingNowDispatch must be used within a PlayingNowProvider')
//   }
//   return context
// }