import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { SlapItem } from "./SlapItem";

export const YoutubeFucker = ({
  item,
  onPlay,
  onPause,
  onSetSegment,
  onSetTitle,
  autoplay,
  ...props
}) => {
  const [youtubeElement, setYoutubeElement] = useState(null);
  const [duration, setDuration] = useState(item.duration || null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [pointerAt, setPointerAt] = useState(item.position);

  useEffect(() => {
    if (!youtubeElement) return;
    if (item.state == "playing") {
      youtubeElement.target.playVideo();
      setPlaying(true);
    } else {
      youtubeElement.target.pauseVideo();
      setPlaying(false);
    }
  }, [item.state, youtubeElement]);

  useEffect(() => {
    if (youtubeElement) {
      const player = youtubeElement.target;

      // States: 1: playing, 2: paused, 5: stopped
      if ([1, 2, 5].indexOf(player.getPlayerState()) >= 0) {
        const data = player.getVideoData();

        setDuration(player.getDuration() * 1000);
        onSetSegment({
          from: item.from ? item.from : 0,
          to: item.to ? item.to : player.getDuration() * 1000,
        });
        onSetTitle(player.getVideoData().title);
        if (item.from) {
          youtubeElement.target.seekTo(item.from / 1000);
          setPointerAt(item.from);
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

        if (item.state == "playing") {
          const timeUntilStop = item.to - pointerAt;
          console.log("timeUntilStop: ", timeUntilStop);
          const timeout = setTimeout(() => {
            onPause();
          }, timeUntilStop);
          return () => clearTimeout(timeout);
        }
      }
    }
  }, [item.state, youtubeElement]);

  const scrub = (to) => {
    console.log("scrubbing to: ", to);
    youtubeElement.target.seekTo(to / 1000);

    setPointerAt(to);
  };

  //

  return (
    <SlapItem
      loading={loading}
      item={item}
      title={item.title}
      duration={duration}
      pointerAt={pointerAt}
      onPause={onPause}
      onPlay={onPlay}
      playing={playing}
      onScrub={scrub}
      segment={{
        from: item.from || 0,
        to: item.to ? item.to : duration,
      }}
      text={item.text}
      {...props}
    >
      <YouTube
        videoId={item.videoId}
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
