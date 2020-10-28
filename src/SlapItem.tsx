import useHover from "@react-hook/hover";
import React, { useState, useEffect, useRef } from "react";
import { Text, TextInput, View } from "react-native";
import SegmentView, { msToTime } from "./SegmentView/SegmentView";
import { Entypo } from "@expo/vector-icons";
import { useParams, Link, Route, Switch } from "react-router-dom";

import styled from "styled-components/native";
import Play from "./comp/Play";
import { Item, Clip } from "./Croaker";
import { FaSpotify, FaYoutube } from "react-icons/fa";

const StyledView = styled.View`
  width: 700;
  /* height: 46px; */
  border-width: 1px;
  box-sizing: content-box;
  border-color: #3b3b3b;
  background-color: white;
  display: flex;
  flex-direction: column;
  margin-bottom: 10;
`;

const Block = styled.View`
  padding: 7px 7px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const SlapItem = ({
  loading,
  children,
  duration,
  title = "...",
  onPause,
  onPlay,
  onScrub,
  segment,
  text,
  onSetSegment,
  onSetText,
  onSetTitle,
  onUpdateClip,
  playingNow,
  onAddClip,
  item,
}: {
  item: Item;
  [key: string]: any;
}) => {
  const [open, setOpen] = useState(false);
  const clips = item.clips || [];


  const songIsPlaying =
    playingNow?.item.id == item.id &&
    playingNow?.type == "item" &&
    playingNow?.state == "playing";

  return (
    <StyledView className="horse" style={{}}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Block>
            {/* {children} */}
            <Play
              playing={songIsPlaying}
              onPress={() => {
                const playable = {
                  type: "item",
                  item: item,
                };
                songIsPlaying ? onPause() : onPlay(playable);
              }}
            />
          </Block>

          <Block
            style={{
              width: 180,
              justifyContent: "center",
            }}
          >
            <View style={{ flexDirection: "column", flex: 1 }}>
              <Text
                style={{
                  width: "100%",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  fontWeight: "bold",
                }}
              >
                {title}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                }}
              >
                {item.videoId ? (
                  <a target="_blank" href={"https://youtu.be/" + item.videoId}>
                    <FaYoutube />
                  </a>
                ) : (
                  <a
                    target="_blank"
                    href={"https://open.spotify.com/track/" + item.trackId}
                  >
                    <FaSpotify />
                  </a>
                )}
              </Text>
            </View>
          </Block>
          {clips.map((c) => {
            const clipIsPlaying =
              playingNow?.type == "clip" &&
              playingNow?.clip.id == c.id &&
              playingNow?.state == "playing";
            return (
              <Block
                key={c.id}
                style={{
                  backgroundColor: c.color || "#EDB7C4",
                }}
              >
                <Play
                  playing={clipIsPlaying}
                  onPress={() => {
                    const playable = {
                      type: "clip",
                      item: item,
                      clip: c,
                    };
                    onUpdateClip(c, { state: "playing" });
                    if (clipIsPlaying) {
                      onPause();
                    } else {
                      onPlay(playable);
                    }
                  }}
                />
                <Text
                  style={{
                    paddingLeft: 6,
                  }}
                >
                  {c.title}
                </Text>
              </Block>
            );
          })}
          {(clips.length < 3 && open) && (
            <Block
              style={{
                backgroundColor: "#E9E9E9",
              }}
              onClick={onAddClip}
            >
              <Text>+ Add clip</Text>
            </Block>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Block
            style={{
              flex: 1,
              backgroundColor: "#FFFFD6",
              borderLeft: "1px solid #3b3b3b",
              borderRight: "1px solid #3b3b3b",
            }}
          >
            <TextInput value={item.text}  multiline
          onChange={(e) => onSetText(e.target.value)}
          placeholder="Write notes here..."
          style={{
            flex:1,
            height: "100%",
            outline: "none"
          }}
           />
          </Block>
          <Block
            style={{
              backgroundColor: open ? "black" : "#E9E9E9",
            }}
            onClick={()=>setOpen(!open)}
          >
            <Text
              style={{
                paddingLeft: 6,
                color: open ? "white" : "black",
              }}
            >
              ▼
            </Text>
          </Block>
        </View>
      </View>

      {open && (
        <View style={{}}>
          <SegmentView
            clips={clips}
            duration={duration || 0}
            pointerAt={
              (playingNow?.item.id == item.id && playingNow?.position) || 0
            }
            playing={
              playingNow?.item.id == item.id && playingNow?.state == "playing"
            }
            onScrub={onScrub}
            onUpdateClip={onUpdateClip}
          />
        </View>
      )}

      {/* <View
        style={{
          width: 200,
          height: 60,
        }}
      >
        <textarea
          style={{
            width: 200,
            height: 60,
            backgroundColor: "#ffff88",
          }}
          onChange={(e) => onSetText(e.target.value)}
        >
          {text}
        </textarea>
      </View> */}
    </StyledView>
  );
};

// const Play = ({ onPress, playing }) => {
//   const ref = useRef(null);
//   const isHover = useHover(ref);
//   const show = isHover || !playing;

//   return (
//     <div
//       onClick={onPress}
//       ref={ref}
//       style={{
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         position: "absolute",
//         backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent",
//         opacity: show ? 1 : 0,
//         cursor:"pointer",

//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       {playing ? (
//         <Entypo name="controller-paus" size={34} color="white" />
//       ) : (
//         <Entypo name="controller-play" size={34} color="white" />
//       )}
//     </div>
//   );
// };
