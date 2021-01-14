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

const SlapDataContext = React.createContext(undefined)

// const spotifyOriginal = new Spotify()


export function SlapDataProvider({ children }) {
  const [slaps, setSlaps] = useState([])
  const [reloadSlapsUpdateInt, setReloadSlapsUpdateInt] = useState(0)
  const [dirtySlaps, setDirtySlaps] = useState({})
  const [slapsLoaded, setSlapsLoaded] = useState(false)
  const [spotifyLists, setSpotifyLists] = useState([])
  const { spotify } = usePlayingNowState()
  const { user } = useUser()

  useEffect(() => {

    if (user) {
      request("GET", "fauna/myCollections").then((res: any) => {

        setSlaps(
          res.map((r) => ({
            ...r.data,
            id: r.ref["@ref"].id,
            items: r.data.items.map(item => {
              if (item.videoId) {
                return (
                  {
                    ...item,
                    type: "youtube"
                  }
                )
              } else if (item.trackId) {
                return (
                  {
                    ...item,
                    type: "spotify"
                  }
                )
              }
            }),
            link: "/app/slap/" + r.ref["@ref"].id
          }))
        );
        setSlapsLoaded(true)
        // setActiveSlap(279439751993360901);
      }).catch((error) => {
        console["error"]('error: ', error);

      })
    }
  }, [user, reloadSlapsUpdateInt]);

  const addItem = (slapId, newItem) => {
    const index = slaps.findIndex(s => s.id == slapId)
    setSlaps(slaps => update(slaps, {
      [index]: {
        items: {
          $push: [newItem]
        }
      }
    }));
    setDirtySlaps(update(dirtySlaps, { $merge: { [slapId]: true } }))
  }

  const moveItem = (slapId, itemIndex, item, newIndex) => {
    const index = slaps.findIndex(s => s.id == slapId)

    let newIndexAdjusted = newIndex;
    if (itemIndex < newIndex) {
      newIndexAdjusted -= 1;
    }
    setSlaps(slaps => update(slaps, {
      [index]: {
        items: {
          $splice: [
            [itemIndex, 1],
            [newIndexAdjusted, 0, item],
          ],
        }
      }
    }));
    setDirtySlaps(update(dirtySlaps, { $merge: { [slapId]: true } }))

  }

  const editItemText = (slapId, itemIndex, text) => {
    const index = slaps.findIndex(s => s.id == slapId)
    setSlaps(slaps => update(slaps, {
      [index]: {
        items: {
          [itemIndex]: {
            $merge: {
              text: text
            }
          }
        }
      }
    }));
    setDirtySlaps(update(dirtySlaps, { $merge: { [slapId]: true } }))
  }

  const setMetaInfo = (slapId, itemId, metaInfo) => {
    const index = slaps.findIndex(s => s.id == slapId)
    const slap = slaps.find(s => s.id == slapId)
    const itemIndex = slap.items.findIndex(i => i.id == itemId)

    setSlaps(slaps => update(slaps, {
      [index]: {
        items: {
          [itemIndex]: {
            $merge: {
              metaInfo: metaInfo
            }
          }
        }
      }
    }));
    setDirtySlaps(update(dirtySlaps, { $merge: { [slapId]: true } }))
  }

  const setListInfo = (slapId, listInfo) => {
    const index = slaps.findIndex(s => s.id == slapId)

    setSlaps(slaps => update(slaps, {
      [index]: {
        $merge: {
          ...listInfo
        }
      }
    }));
    setDirtySlaps(update(dirtySlaps, { $merge: { [slapId]: true } }))
  }

  const deleteSlap = (slapId) => {
    const index = slaps.findIndex(s => s.id == slapId)
    // const slap = slaps.find(s => s.id == slapId)
    // if (user?.id != slapUserId) {
    //   
    //   return;
    // }
    request("POST", "fauna/deleteCollection/" + slapId).then((res: any) => {
      alert("deleted!")
    });
  };

  const addClip = (slapId, itemIndex, clip) => {
    const index = slaps.findIndex(s => s.id == slapId)
    setSlaps(slaps => update(slaps, {
      [index]: {
        items: {
          [itemIndex]: {
            clips: {
              $push: [{
                id: uuidv4(),
                title: "Clip",
                ...clip
              }]
            }
          }
        }
      }
    }));
    setDirtySlaps(update(dirtySlaps, { $merge: { [slapId]: true } }))

  };

  const editClip = (slapId, itemId, clipId, clip) => {
    const index = slaps.findIndex(s => s.id == slapId)
    const slap = slaps.find(s => s.id == slapId)
    const itemIndex = slap.items.findIndex(i => i.id == itemId)
    const item = slap.items.find(i => i.id == itemId)
    const clipIndex = item.clips.findIndex(c => c.id == clipId)
    setSlaps(slaps => update(slaps, {
      [index]: {
        items: {
          [itemIndex]: {
            clips: {
              [clipIndex]: {
                $merge: clip
              }
            }
          }
        }
      }
    }));
    setDirtySlaps(update(dirtySlaps, { $merge: { [slapId]: true } }))

  }

  const saveSlap = (slapId) => {
    // if (user?.id != slapUserId) {
    //   
    //   return;
    // }
    const slap = slaps.find(s => s.id == slapId)

    request("PUT", "fauna/collection/" + slapId, {
      title: slap.title,
      description: slap.description,
      coverImage: slap.coverImage,
      items: slap.items,
      user: user.id,
      visibility: slap.visibility,
    }).then((res: any) => {

      setDirtySlaps(update(dirtySlaps, { $merge: { [slapId]: false } }))
    });
  };


  useEffect(() => {
    if (spotify.me && slapsLoaded) {
      spotify.api.getUserPlaylists(spotify.me.id).then((res: any) => {

        setSpotifyLists(
          res.items
            .filter((spotifyList) => {
              if (slaps.find(s => s.spotifyLinked == spotifyList.id)) {
                return false
              }
              return true
            })
            .map((r) => ({
              ...r,
              title: r.name,
              type: "spotify",
              coverImage: r.images[0].url,
              link: "/app/spotify/playlist/" + r.id
            }))
        );
        // setActiveSlap(279439751993360901);
      }).catch((error) => {
        console["error"]('error: ', error);

      })
    }
  }, [spotify?.me, slapsLoaded])

  return (
    <SlapDataContext.Provider value={{ slaps, dirtySlaps, saveSlap, spotifyLists, addItem, moveItem,
     editItemText, deleteSlap, addClip, editClip, setMetaInfo, setListInfo, setReloadSlapsUpdateInt}}>
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