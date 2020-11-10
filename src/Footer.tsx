import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import SegmentView from "./SegmentView/SegmentView";
import MarqueeText from "react-native-marquee";
import useHover from "@react-hook/hover";
import { TText } from "./utils/font";

const Footer = ({ playingNow, children, onUpdateClip, onScrub, items, onPlay }) => {
  // console.log('playingNow: ', JSON.stringify(playingNow));
  // console.log('items: ', JSON.stringify(items));
  return (
    <View
      style={{
        display: "flex",
        flexGrow: 1,
        flexDirection: "row",
        height: "100%",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          paddingHorizontal: 10,
        }}
      >
        <img
          style={{
            width: 64,
          }}
          src={playingNow?.item.metaInfo.image}
        />
      </View>

      <View
        style={{
          justifyContent: "center",
          width: "200px",
          whiteSpace: "nowrap",
        }}
      >
        {/* <Text
          style={{
            fontWeight: "800",
          }}
        >
        </Text> */}
        <MarqueeText
          style={{ fontSize: 16, fontWeight: "800" }}
          duration={3000}
          marqueeOnStart={false}
          loop
          marqueeDelay={1000}
          marqueeResetDelay={1000}
        >
          {playingNow?.item.metaInfo.title}
        </MarqueeText>

        <TText
          style={{
            fontWeight: "200",
          }}
        >
          {playingNow?.item.metaInfo.artist}
        </TText>
      </View>

      <View
        style={{
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        <SegmentView
          clips={playingNow ? items.find((i) => playingNow.item.id == i.id )?.clips || [] : []}
          duration={playingNow?.item.metaInfo.duration || 0}
          pointerAt={playingNow?.position || 0}
          playing={playingNow?.state == "playing"}
          onScrub={onScrub}
          onPlay={(clip) => {
            const playable = {
              type: "clip",
              item: playingNow?.item,
              clip: clip,
            };
            onPlay(playable)
          }}
          onUpdateClip={(clip, whatever) => onUpdateClip(playingNow?.item, clip, whatever)}
        />
      </View>
      {children}
      {/* <View
        style={{
          justifyContent: "center",
          width: 200
        }}
      >
      Playing from spotify
      </View> */}
    </View>
  );
};

export default Footer;
