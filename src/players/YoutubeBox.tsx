import Authorize from "../Authorize";
import DeviceSelector from "../DeviceSelector";
import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { Item, Clip } from "./Croaker";

export const YoutubeBox = ({
  items,
  onSetMetaInfo,
}: {
  items: Item[];
  [key: string]: any;
}) => {
  const youtubeItems = items.filter((i) => i.videoId);
  // useEffect(() => playPauseWhatever(items), [items]);

  return (
    <div
      style={{
        width: 200,
        height: 100,
        // overflow: "hidden",
        border: "2px solid red",
      }}
    >
      {youtubeItems.map((item) => (
        <YoutubeVideo
          key={item.videoId}
          item={item}
          onSetMetaInfo={(metaInfo) => onSetMetaInfo(item, metaInfo)}
        />
      ))}
    </div>
  );
};

const YoutubeVideo = ({
  item,
  onSetMetaInfo,
}: {
  item: Item;
  [key: string]: any;
}) => {
  console.log("item: ", item);
  const [youtubeElement, setYoutubeElement] = useState(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (youtubeElement) {
      const player = youtubeElement.target;

      // States: 1: playing, 2: paused, 5: stopped
      if ([1, 2, 5].indexOf(player.getPlayerState()) >= 0) {
        const data = player.getVideoData();

        onSetMetaInfo({
          duration: player.getDuration() * 1000,
          title: player.getVideoData().title
        });
        // onSetTitle(player.getDuration() * 1000);
        // onSetSegment({
        //   from: item.from ? item.from : 0,
        //   to: item.to ? item.to : player.getDuration() * 1000,
        // });
        // onSetTitle(player.getVideoData().title);
        // if (item.from) {
        //   youtubeElement.target.seekTo(item.from / 1000);
        //   setPointerAt(item.from);
        //   player.pauseVideo();
        // }
        // setLoading(false);
        // if (autoplay) {
        //   onPlay();
        // }
        // youtubeElement.target.playVideo()
      }
    }
  }, [youtubeElement]);

  useEffect(() => {
    if (!youtubeElement) return;
    if (item.state == "playing") {
      console.log("item: ", item);
      youtubeElement.target.playVideo();
      setPlaying(true);
    } else {
      youtubeElement.target.pauseVideo();
      setPlaying(false);
    }
  }, [item.state, youtubeElement]);

  useEffect(() => {
    if (!youtubeElement) return;
    if (item.state == "playing") {
      youtubeElement.target.seekTo(item.position / 1000);
    }
  }, [item.position, item.state, youtubeElement]);

  return (
    <div
      style={{
        // display: item.state == "playing" ? "block" : "none",
        display: "none",
      }}
    >
      <YouTube
        videoId={item.videoId}
        opts={{
          height: "120",
          width: "240",
          playerVars: {
            controls: 0,
            modestbranding: 1,
          },
        }}
        onReady={setYoutubeElement}
        // onStateChange={func}
      />
    </div>
  );
};

const playPauseWhatever = (allItems) => {
  if (!this.ready) {
    return;
  }
  const items = allItems.filter((i) => i.trackId); // ← only get spotify items

  if (items.every((i) => i.state == "paused")) {
    if (this.playbackState.is_playing) {
      console.log("need to pause");
      this.api.pause();
    }
    return;
  }

  if (items.filter((i) => i.state == "playing").length > 1) {
    throw new Error("You can only play one at the time!");
  }

  const playingItem = items.find((i) => i.state == "playing");

  if (!this.isPlaying) {
    // no playback, start song!
    this.api.play({
      uris: ["spotify:track:" + playingItem.trackId],
      position_ms: playingItem.position,
    });
    this.isPlaying = true;
    this.currentTrack = playingItem.trackId;
  }

  if (this.isPlaying) {
    // is it the same song?
    if (this.currentTrack == playingItem.trackId) {
    } else {
      this.api.play({
        uris: ["spotify:track:" + playingItem.trackId],
        position_ms: playingItem.position,
      });
      this.isPlaying = false;
      this.currentTrack = playingItem.trackId;
    }
  }
};
