import Authorize from "../Authorize";
import DeviceSelector from "../DeviceSelector";
import React, { useEffect } from "react";
import { Item, Clip } from "./Croaker";

export const SpotifyBox = ({
  spotify,
  items,
  playingNow,
  playIntent,
  onSetMetaInfo,
  onSetPlayingNow,
  removePlayingNow
}: {
  items: Item[];
  [key: string]: any;
}) => {
  const spotifyItems = items.filter((i) => i.trackId);
  const playingNowTrack = playingNow?.item.trackId && playingNow;
  const spotifyWasPlaying = !!playingNow?.item.trackId
  

  useEffect(() => {
    spotify.onUpdatePlaybackState = (playbackState) => {
      if (
        playingNowTrack
        
      ) {
        console.log('here')
        if(playingNowTrack.item.trackId == playbackState?.item?.id){
          onSetPlayingNow({
            position: playbackState.progress_ms,
          });
        } else  {
          console.log('spotify takeover')
          removePlayingNow();
        }
      }
    };
  }, [spotify, playingNowTrack]);

  useEffect(() => {
    
    if(!playIntent){
      if(spotify.playbackState){
        spotify.pause()
      }
      return
    }
    (async () => {
      if (playIntent.action == "pause") {
        if(spotifyWasPlaying){
          const position = spotify.estimatePosition();
          await spotify.pause();
          onSetPlayingNow({
            state: "paused",
            position,
          });
        }
      } else if (playIntent.action == "play") {
        if(playIntent.item?.videoId){
          if(spotifyWasPlaying){
            await spotify.pause();
          }
          return
        }
        if(playingNow?.item?.videoId && typeof playIntent.item == "undefined"){
          return
        }
        let playObject: any = {
          ...(playIntent.item && {uris: ["spotify:track:" + playIntent.item.trackId]}),
        };
  
        if (playIntent.type == "item") {
          if (!playIntent.position) {
            playObject.position_ms = 0;
          }
        } else if (playIntent.type == "clip") {
          playObject.position_ms = playIntent.clip.from;
        } else {
          // a generic resume, only do if playingNow is spotify!
          if(playingNow.videoId){
            return
          }
          playObject = {}
        }
        try {
          await spotify.play(playObject);
        } catch (e) {
          alert("Error: " + e.message);
          return;
        }
        onSetPlayingNow({
          state: "playing",
          ...(playIntent.type && {type: playIntent.type}),
          ...(playIntent.item && {item: playIntent.item}),
          ...(playIntent.clip && {clip: playIntent.clip}),
          ...(playObject.position_ms && { position: playObject.position_ms }),
        });
      } else if (playIntent.action == "scrub"){
        onSetPlayingNow({
          position: playIntent.to,
        });
        (async () => {
          await spotify.api.seek(playIntent.to);
          onSetPlayingNow({
            position: playIntent.to,
          });
        })();
      }
    })()
  }, [playIntent]);

  return (
    <div style={{}}>
      {spotifyItems.map((item) => (
        <Track
          key={item.trackId}
          spotify={spotify}
          item={item}
          onSetMetaInfo={onSetMetaInfo}
        />
      ))}

      {spotify.credentials && <DeviceSelector spotify={spotify} />}
    </div>
  );
};

const Track = ({ item, onSetMetaInfo, spotify }) => {
  useEffect(() => {
    spotify.api.getTrack(item.trackId).then((track) => {
      
      onSetMetaInfo(item, {
        duration: track.duration_ms,
        title: track.name,
        image: track.album.images[0].url,
        artist: track.artists[0].name,
      });
    });
  }, [item.trackId]);

  return null;
};
