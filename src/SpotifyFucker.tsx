import React, { useEffect, useState } from "react";
import { useWhyDidYouUpdate } from "use-why-did-you-update";
import { SlapItem } from "./SlapItem";

export const SpotifyFucker = ({
  spotify,
  s,
  onPlay,
  onPause,
  setSegment,
  setPosition,
  onSetText,
  autoplay,
}) => {
  const [track, setTrack] = useState(null);
  const [pointerAt, setPointerAt] = useState(s.from ? s.from : 0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    spotify.api.getTrack(s.trackId).then((track) => {
      console.log("track: ", track);
      setTrack(track);
    });
  }, [s.trackId]);

  useEffect(() => {
    if(s.state == "playing"){
      spotify.onUpdatePlaybackState = playbackState => {
        if(playbackState?.item?.id == s.trackId){
          setPosition(playbackState.progress_ms)
          setPointerAt(playbackState.progress_ms)
        }
      }
    }
  }, [s.state]);


  useEffect(() => {
    console.log('track: ', track);
    if (!track) return;
    if (s.state == "playing") {
      // spotify.target.playVideo();
     
      console.log("start")
      setPlaying(true);
    } else {
      console.log("stop")
      setPlaying(false);
    }
  }, [s.state, track]);

  // useEffect(() => {
  //   if (track) {
  //     const pointerAt = track?.target?.playerInfo?.currentTime * 1000;
  //     if (pointerAt) {
  //       setPointerAt(pointerAt);

  //       if (s.state == "playing") {
  //         const timeUntilStop = s.to - pointerAt;
  // console.log("timeUntilStop: ", timeUntilStop);
  //         const timeout = setTimeout(() => {
  //           onPause();
  //         }, timeUntilStop);
  //         return () => clearTimeout(timeout);
  //       }
  //     }
  //   }
  // }, [s.state, track]);

  const scrub = (to) => {
    console.log("scrubbing to: ", to);
    spotify.api.seek(to);
    // youtubeElement.target.seekTo(to / 1000);
    setPointerAt(to);
  };

  const pause = () => {
    setPosition(pointerAt)
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
      duration={duration}
      pointerAt={pointerAt}
      onPause={pause}
      onPlay={onPlay}
      playing={playing}
      onScrub={scrub}
      segment={{
        from: s.from || 0,
        to: s.to ? s.to : duration,
      }}
      setSegment={setSegment}
      text={s.text}
      onSetText={onSetText}
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
