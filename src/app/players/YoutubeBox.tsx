import Authorize from "../Authorize";
import DeviceSelector from "../DeviceSelector";
import React, { useEffect, useMemo, useState } from "react";
import YouTube from "react-youtube";
import { Item, Clip } from "./Croaker";
import { FOOTER_HEIGHT } from "../Croaker";
import { Button, ButtonGroup } from "react-bootstrap";
import { useYoutube } from "../youtube-context";
import { usePlayingNowState } from "./player-context";
import { IoResize } from "react-icons/io5";

// export const YoutubeBox = ({}) => {
//   // const youtubeItems = items.filter((i) => i.videoId);
//   // const [lastActive, setLastActive] = useState(null);
//   const [sizeBig, setSizeBig] = useState(true);

//   return (
// <div
//   style={{
//     position: "absolute",
//     right: 10,
//     bottom: FOOTER_HEIGHT + 10,

//     transformOrigin: "right bottom",
//     transform: sizeBig ? "scale(1)" : "scale(0.3)",
//     transition: "transform 0.4s ease",
//   }}
// >
//   {youtubeItems.map((item) => (
//     <YoutubeVideo
//       onToggleSize={() => setSizeBig(!sizeBig)}
//       sizeBig={sizeBig}
//       key={item.videoId}
//       item={item}
//       onSetMetaInfo={(metaInfo) => onSetMetaInfo(item, metaInfo)}
//       visible={item.videoId == lastActive?.videoId}
//       playingNow={playingNow}
//       playIntent={playIntent}
//       onSetPlayingNow={onSetPlayingNow}
//     />
//   ))}
// </div>
//   );
// };

export const YoutubeBox = ({
  item,
  onSetMetaInfo,
  videoId,
  visible,
  onSetPlayingNow,
  playIntent,
  onToggleSize,
}) => {
  const [sizeBig, setSizeBig] = useState(true);
  const { playingNow, setPlayingNow, setMetaInfo } = usePlayingNowState()

  const { youtubeElement, setYoutubeElement } = useYoutube()
  const [playbackRates, setPlaybackRates] = useState([]);
  const [playbackRate, setPlaybackRate] = useState(1);
  // const playingHere = playingNow?.item.id == item.id && playingNow;
  const playingNowVideo = playingNow?.item?.videoId ? playingNow : null;
  const [lastVideoId, setLastVideoId] = useState(playingNowVideo?.item.videoId);


  const onStateChange = ({ data }) => {
    
    if (data == 1) {
      // playing
      setPlayingNow(playingNow => ({
        ...playingNow,
        state: "playing",
        position: {
          ms: youtubeElement.target.getCurrentTime() * 1000,
          timestamp: Date.now()
        },
      }));
    } else if (data == 2) {
      // paused

      if (playingNow?.item.videoId) {
        setPlayingNow(playingNow => ({
          ...playingNow,
          state: "paused",
          position: {
            ms: youtubeElement.target.getCurrentTime() * 1000,
            timestamp: Date.now()
          },
        }));
      }
    } else if (data == 5){
      

      // setMetaInfo(playingNowVideo.item.id, {
      //   duration: youtubeElement.target.getDuration() * 1000,
      //   title: youtubeElement.target.getVideoData().title,
      // });
    }
  };

  // if (!playingNowVideo) {
  //   return null
  // }

  return (
    <div
      className="absolute right-2 origin-bottom-right transition-transform duration-300"
      style={{
        bottom: FOOTER_HEIGHT + 10,
        transform: sizeBig ? "scale(1)" : "scale(0.3)",
        display: playingNowVideo ? "block" : "none"
      }}
    >
      <button className="rounded p-2 bg-gray-300 rotate-90 transform" onClick={() => setSizeBig(!sizeBig)}>
        <IoResize />
      </button>

      <YouTube
        // videoId={playingNowVideo?.item.videoId || lastVideoId}
        opts={{
          height: "300",
          width: "600",
          playerVars: {
            controls: 0,
            modestbranding: 1,
            autoplay: 0,
          },
        }}
        onReady={setYoutubeElement}
        onStateChange={onStateChange}
      // onPlaybackRateChange={({ data }) => {
      //   setPlaybackRate(data);
      // }}
      />
    </div>

  )

  return (
    <div
      style={{
        // display: playing ? "block" : "none",
        // display: visible ? "block" : "none",
        // display: "none",
      }}
    >
      <div
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <div></div>
        {/* <ButtonGroup size="sm" aria-label="Basic example">
          {playbackRates.map((rate) => (
            <Button
              key={rate}
              variant={playbackRate == rate ? "secondary" : "light"}
              onClick={() => youtubeElement.target.setPlaybackRate(rate)}
            >
              {rate}
            </Button>
          ))}
        </ButtonGroup> */}
      </div>
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


      </div>
    </div>
  );
};
