import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { SlapItem } from "./SlapItem";
import { Item, Clip } from "./Croaker"


export const YoutubeFucker = ({
  item,
  onPlay,
  onPause,
  onSetSegment,
  onSetTitle,
  onSetPosition,
  autoplay,
  ...props
}: {
  item:Item
  [key: string]: any
}) => {
  const [youtubeElement, setYoutubeElement] = useState(null);

  

  

  useEffect(() => {
    if (youtubeElement) {
      const pointerAt = youtubeElement?.target?.playerInfo?.currentTime * 1000;
      if (pointerAt) {
        // setPointerAt(pointerAt);

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
    onSetPosition(to)
  };

  //

  return (
    <SlapItem
      loading={false}
      item={item}
      duration={item.metaInfo?.duration}
      title={item.metaInfo?.title}
      pointerAt={item.position}
      onPause={onPause}
      onPlay={onPlay}
      playing={item.state == "playing"}
      onScrub={scrub}
      text={item.text}
      {...props}
    >
      
    </SlapItem>
  );
};
