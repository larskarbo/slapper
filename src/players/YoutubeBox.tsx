import Authorize from "../Authorize";
import DeviceSelector from "../DeviceSelector";
import React, { useEffect, useMemo, useState } from "react";
import YouTube from "react-youtube";
import { Item, Clip } from "./Croaker";
import { FOOTER_HEIGHT } from "../Croaker";
import { Button, ButtonGroup } from "react-bootstrap";
import { View } from "react-native";

export const YoutubeBox = ({
  items,
  onSetMetaInfo,
  playingNow,
  playIntent,
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
          playIntent={playIntent}
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
  playIntent,
  onToggleSize,
}: {
  item: Item;
  [key: string]: any;
}) => {
  const [youtubeElement, setYoutubeElement] = useState(null);
  const [playbackRates, setPlaybackRates] = useState([]);
  const [playbackRate, setPlaybackRate] = useState(1);
  const playingHere = playingNow?.item.id == item.id && playingNow;
  const playIntentVideo =
    (playIntent?.item?.id == item.id || playingHere) && playIntent;

  useEffect(() => {
    // SET METAINFO
    if (youtubeElement) {
      onSetMetaInfo({
        duration: youtubeElement.target.getDuration() * 1000,
        title: youtubeElement.target.getVideoData().title,
      });

      setPlaybackRates(youtubeElement.target.getAvailablePlaybackRates());
    }
  }, [youtubeElement]);

  useEffect(() => {
    if (!youtubeElement) return;
    if (!playIntentVideo) {
      youtubeElement.target.pauseVideo();
      return;
    }

    if (playIntentVideo.action == "pause") {
      youtubeElement.target.pauseVideo();
    } else if (playIntentVideo.action == "play") {
      if (!(playIntentVideo.item?.id == item.id)) {
        youtubeElement.target.pauseVideo();
      }

      if (playIntentVideo.type == "item") {
        youtubeElement.target.seekTo(0);
        youtubeElement.target.playVideo();
        onSetPlayingNow({
          item: playIntentVideo.item,
          type: "item",
        });
      } else if (playIntentVideo.type == "clip") {
        youtubeElement.target.seekTo(playIntentVideo.clip.from / 1000);
        youtubeElement.target.playVideo();

        onSetPlayingNow({
          item: playIntentVideo.item,
          clip: playIntentVideo.clip,
          type: "clip",
        });
      } else {
        youtubeElement.target.playVideo();
      }
    } else if (playIntentVideo.action == "scrub") {
      youtubeElement.target.seekTo(playIntentVideo.to / 1000);
      onSetPlayingNow({
        position: playIntentVideo.to,
      });
    }
  }, [playIntentVideo, youtubeElement]);

  const onStateChange = ({ data }) => {
    if (data == 1) {
      // playing
      onSetPlayingNow({
        state: "playing",
        position: youtubeElement.target.getCurrentTime() * 1000,
      });
    } else if (data == 2) {
      // paused

      if (playingNow.item.videoId) {
        onSetPlayingNow({
          state: "paused",
          position: youtubeElement.target.getCurrentTime() * 1000,
        });
      }
    }
  };

  return (
    <div
      style={{
        // display: playing ? "block" : "none",
        display: visible ? "block" : "none",
        // display: "none",
      }}
    >
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <div></div>
        <ButtonGroup size="sm" aria-label="Basic example">
          {playbackRates.map((rate) => (
            <Button
              key={rate}
              variant={playbackRate == rate ? "secondary" : "light"}
              onClick={() => youtubeElement.target.setPlaybackRate(rate)}
            >
              {rate}
            </Button>
          ))}
        </ButtonGroup>
      </View>
      <div
        style={{
          borderRadius: 10,
          background: "black",
          overflow: "hidden",
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
          onPlaybackRateChange={({ data }) => {
            setPlaybackRate(data);
          }}
        />
      </div>
    </div>
  );
};
