// src/playingNow-context.js
import * as React from 'react'
import Spotify from '../Spotify';
import { Item } from '../Croaker';
import { NO_DEVICE_ERROR_MESSAGE } from '../Spotify';

type Action = { type: any, [key:string]: any }
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


type PlayingNowProviderProps = { children: React.ReactNode }
const PlayingNowStateContext = React.createContext<State | undefined>(undefined)
const PlayingNowDispatchContext = React.createContext<Dispatch | undefined>(
  undefined,
)

console.log("YOOOOOOO!!!!")
const spotify = new Spotify()

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

async function updatePlaybackState(dispatch: Dispatch) {
  await spotify.api
    .getMyCurrentPlaybackState()
    .catch((e) => {
      console.log('e: ', e);

    })
    .then((playbackState: any) => {
      console.log('playbackState: ', playbackState);
      dispatch({
        type: 'set_playback_state',
        position: {
          ms: playbackState.progress_ms,
          timestamp: Date.now()
        },
        state: playbackState.is_playing ? "playing" : "paused"
      })
      // console.log(playbackState.progress_ms)
      // this.playbackState = playbackState;
      // this.lastUpdatePlaybackState = new Date()
      // this.isPlaying = playbackState?.is_playing;
      // this.currentTrack = playbackState?.item?.id;
      // this.onUpdatePlaybackState(playbackState);
    });
}

export async function playItem(dispatch: Dispatch, item: Item) {
  // dispatch({type: 'start update', updates})
  try {
    const updatedUser = await spotify.play({ uris: ["spotify:track:" + item.trackId] })
    .then(() => {
      dispatch({
        type: 'play_item', item, position: {
          ms: 0,
          timestamp: Date.now()
        }
      })
      updatePlaybackState(dispatch)
    })

  } catch (error) {
    // dispatch({type: 'error'})
    if(error.message == NO_DEVICE_ERROR_MESSAGE){
      console.log("show menu")
      spotify.mustOpenMenu()
    } else {
      alert("error," + error.message)

    }
  }
}

export async function play(dispatch: Dispatch) {
  // dispatch({type: 'start update', updates})
  console.log("going for it")
  try {
    const updatedUser = await spotify.play()
    dispatch({ type: 'play' })
  } catch (error) {
    // dispatch({type: 'error'})
    alert("error," + error.message)
  }
}

export async function pause(dispatch: Dispatch) {
  // dispatch({type: 'start update', updates})
  console.log("going for it")
  try {
    const updatedUser = await spotify.pause()
    dispatch({ type: 'pause' })
  } catch (error) {
    // dispatch({type: 'error'})
    alert("error," + error.message)
  }
}

export async function seek(dispatch: Dispatch, to: number) {
  // dispatch({type: 'start update', updates})
  console.log("going for it")
  try {
    const updatedUser = await spotify.api.seek(to)
    // dispatch({type: 'pause'})
    updatePlaybackState(dispatch)
  } catch (error) {
    // dispatch({type: 'error'})
    alert("error," + error.message)
  }
}


export function PlayingNowProvider({ children }: PlayingNowProviderProps) {
  const [state, dispatch] = React.useReducer(playingNowReducer, { state: "idle" })
  return (
    <PlayingNowStateContext.Provider value={{state, spotify}}>
      <PlayingNowDispatchContext.Provider value={dispatch}>
        {children}
      </PlayingNowDispatchContext.Provider>
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

export function usePlayingNowDispatch() {
  const context = React.useContext(PlayingNowDispatchContext)
  if (context === undefined) {
    throw new Error('usePlayingNowDispatch must be used within a PlayingNowProvider')
  }
  return context
}