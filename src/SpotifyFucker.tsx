import React, { useEffect, useState } from "react";
import { useWhyDidYouUpdate } from "use-why-did-you-update";
import { SlapItem } from "./SlapItem";

export const SpotifyFucker = ({
  spotify,
  item,
  onPause,
  onSetPosition,
  ...props
}) => {
  const [track, setTrack] = useState(null);
  const [pointerAt, setPointerAt] = useState(item.position);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    spotify.api.getTrack(item.trackId).then((track) => {
      console.log("track: ", track);
      setTrack(track);
    });
  }, [item.trackId]);

  useEffect(() => {
    if(item.state == "playing"){
      spotify.onUpdatePlaybackState = playbackState => {
        if(playbackState?.item?.id == item.trackId){
          onSetPosition(playbackState.progress_ms)
          setPointerAt(playbackState.progress_ms)
        }
      }
    }
  }, [item.state]);


  useEffect(() => {
    console.log('track: ', track);
    if (!track) return;
    if (item.state == "playing") {
      // spotify.target.playVideo();
     
      console.log("start")
      setPlaying(true);
    } else {
      console.log("stop")
      setPlaying(false);
    }
  }, [item.state, track]);

  // useEffect(() => {
  //   if (track) {
  //     const pointerAt = track?.target?.playerInfo?.currentTime * 1000;
  //     if (pointerAt) {
  //       setPointerAt(pointerAt);

  //       if (item.state == "playing") {
  //         const timeUntilStop = item.to - pointerAt;
  // console.log("timeUntilStop: ", timeUntilStop);
  //         const timeout = setTimeout(() => {
  //           onPause();
  //         }, timeUntilStop);
  //         return () => clearTimeout(timeout);
  //       }
  //     }
  //   }
  // }, [item.state, track]);

  const scrub = (to) => {
    console.log("scrubbing to: ", to);
    spotify.api.seek(to);
    // youtubeElement.target.seekTo(to / 1000);
    setPointerAt(to);
  };

  const pause = () => {
    onSetPosition(pointerAt)
    onPause()
  };

  if(!track){
    return null
  }

  const duration = track?.duration_ms
  return (
    <SlapItem
      loading={!track}
      title={track.name}
      item={item}
      duration={duration}
      pointerAt={pointerAt}
      playing={playing}
      onScrub={scrub}
      onPause={onPause}
      segment={{
        from: item.from || 0,
        to: item.to ? item.to : duration,
      }}
      text={item.text}
      {...props}
    >
      <img
        src={track.album.images[2].url}
        style={{
          width: 64,
        }}
      />
    </SlapItem>
  );

};
