import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { SlapItem } from "./SlapItem";

export const YoutubeFucker = ({
  s,
  onPlay,
  onPause,
  setSegment,
  onSetText,
  autoplay,
}) => {
  const [youtubeElement, setYoutubeElement] = useState(null);
  const [title, setTitle] = useState(null);
  const [duration, setDuration] = useState(s.duration || null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [pointerAt, setPointerAt] = useState(s.position);

  useEffect(() => {
    if (!youtubeElement) return;
    if (s.state == "playing") {
      youtubeElement.target.playVideo();
      setPlaying(true);
    } else {
      youtubeElement.target.pauseVideo();
      setPlaying(false);
    }
  }, [s.state, youtubeElement]);

  useEffect(() => {
    if (youtubeElement) {
      const player = youtubeElement.target;

      // States: 1: playing, 2: paused, 5: stopped
      if ([1, 2, 5].indexOf(player.getPlayerState()) >= 0) {
        const data = player.getVideoData();

        setDuration(player.getDuration() * 1000);
        setSegment({
          from: s.from ? s.from : 0,
          to: s.to ? s.to : player.getDuration() * 1000,
        });
        setTitle(player.getVideoData().title);
        if (s.from) {
          youtubeElement.target.seekTo(s.from / 1000);
          setPointerAt(s.from);
          player.pauseVideo();
        }
        setLoading(false);
        if (autoplay) {
          onPlay();
        }
        // youtubeElement.target.playVideo()
      }
    }
  }, [youtubeElement]);

  useEffect(() => {
    if (youtubeElement) {
      const pointerAt = youtubeElement?.target?.playerInfo?.currentTime * 1000;
      if (pointerAt) {
        setPointerAt(pointerAt);

        if (s.state == "playing") {
          const timeUntilStop = s.to - pointerAt;
          console.log("timeUntilStop: ", timeUntilStop);
          const timeout = setTimeout(() => {
            onPause();
          }, timeUntilStop);
          return () => clearTimeout(timeout);
        }
      }
    }
  }, [s.state, youtubeElement]);

  const scrub = (to) => {
    console.log("scrubbing to: ", to);
    youtubeElement.target.seekTo(to / 1000);

    setPointerAt(to);
  };

  //

  return (
    <SlapItem
      loading={loading}
      title={title}
      duration={duration}
      pointerAt={pointerAt}
      onPause={onPause}
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
      <YouTube
        videoId={s.videoId}
        opts={{
          height: "60",
          width: "60",
        }}
        onReady={setYoutubeElement}
        // onStateChange={func}
      />
    </SlapItem>
  );
};
