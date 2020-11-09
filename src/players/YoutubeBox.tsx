import Authorize from "../Authorize";
import DeviceSelector from "../DeviceSelector";
import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { Item, Clip } from "./Croaker";
import { FOOTER_HEIGHT } from "../Croaker";

export const YoutubeBox = ({
  items,
  onSetMetaInfo,
  playingNow,
  onSetPlayingNow,
}: {
  items: Item[];
  [key: string]: any;
}) => {
  const youtubeItems = items.filter((i) => i.videoId);
  const [lastActive, setLastActive] = useState(null);
  const [sizeBig, setSizeBig] = useState(true);

  useEffect(() => {
    if (playingNow) {
      setLastActive(playingNow.item);
    }
  }, [playingNow?.item.id]);

  return (
    <div
      style={{
        position: "absolute",
        right: 10,
        bottom: FOOTER_HEIGHT + 10,
        borderRadius: 10,
        background: "black",
        overflow: "hidden",

        transformOrigin: "right bottom",
        transform: sizeBig ? "scale(1)" : "scale(0.3)",
        transition: "transform 0.4s ease",
      }}
    >
      {youtubeItems.map((item) => (
        <YoutubeVideo
          onToggleSize={() => setSizeBig(!sizeBig)}
          sizeBig={sizeBig}
          key={item.videoId}
          item={item}
          onSetMetaInfo={(metaInfo) => onSetMetaInfo(item, metaInfo)}
          visible={item.videoId == lastActive?.videoId}
          playingNow={playingNow}
          onSetPlayingNow={onSetPlayingNow}
        />
      ))}
    </div>
  );
};

const YoutubeVideo = ({
  item,
  onSetMetaInfo,
  visible,
  playingNow,
  onSetPlayingNow,
  onToggleSize,
}: {
  item: Item;
  [key: string]: any;
}) => {
  const [youtubeElement, setYoutubeElement] = useState(null);
  const playingInfo = playingNow?.item.id == item.id ? playingNow : null;
  const playing = playingNow?.item.id == item.id && playingNow?.type == "item";

  useEffect(() => {
    // SET METAINFO
    if (youtubeElement) {
      onSetMetaInfo({
        duration: youtubeElement.target.getDuration() * 1000,
        title: youtubeElement.target.getVideoData().title,
      });
    }
  }, [youtubeElement]);

  useEffect(() => {
    if (!youtubeElement) return;
    if (!playingInfo) {
      youtubeElement.target.pauseVideo();
      return;
    }

    if (playingInfo.action == "wantToPause") {
      youtubeElement.target.pauseVideo();
    } else if (playingInfo.action == "wantToPlay") {
      if (playingInfo.type == "item") {
        if (!playingInfo.position) {
          youtubeElement.target.seekTo(0);
        }
        youtubeElement.target.playVideo();
      } else if (playingInfo.type == "clip") {
        youtubeElement.target.seekTo(playingInfo.clip.from / 1000);
        youtubeElement.target.playVideo();
      }
    }
  }, [playingInfo?.clientUpdate, youtubeElement]);

  const onStateChange = ({ data }) => {
    if (data == 1) {
      // playing
      onSetPlayingNow({
        state: "playing",
        position: youtubeElement.target.getCurrentTime() * 1000,
      });
    } else if (data == 2) {
      // paused
      console.log("paused");
      onSetPlayingNow({
        state: "paused",
        position: youtubeElement.target.getCurrentTime() * 1000,
      });
    }
  };

  // seeking
  useEffect(() => {
    if (playingInfo?.scrub) {
      youtubeElement.target.seekTo(playingInfo.scrub / 1000);
      onSetPlayingNow({
        position: playingInfo.scrub,
      });
    }
  }, [playingInfo?.scrub]);

  return (
    <div
      style={{
        // display: playing ? "block" : "none",
        display: visible ? "block" : "none",
        // display: "none",
        position: "relative",
      }}
      onClick={onToggleSize}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      ></div>
      <YouTube
        videoId={item.videoId}
        opts={{
          height: "300",
          width: "600",
          playerVars: {
            controls: 0,
            modestbranding: 1,
          },
        }}
        onReady={setYoutubeElement}
        onStateChange={onStateChange}
      />
    </div>
  );
};
