import useHover from "@react-hook/hover";
import React, { useState, useEffect, useRef } from "react";
import { Text, TextInput, View } from "react-native";
import SegmentView, { msToTime } from "./SegmentView/SegmentView";
import { Entypo } from "@expo/vector-icons";
import { useParams, Link, Route, Switch } from "react-router-dom";

import {
  Menu,
  Item as ContextItem,
  Separator,
  Submenu,
  MenuProvider,
} from "react-contexify";
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
  title = "...",
  onPause,
  onPlay,
  onScrub,
  onSetText,
  onUpdateClip,
  playingNow,
  onAddClip,
  onDeleteClip,
  onDeleteItem,
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
      <MenuProvider id={item.id}>
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
                    <a
                      target="_blank"
                      href={"https://youtu.be/" + item.videoId}
                    >
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
                <MenuProvider id={c.id}>
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
                  <ClipContextMenu id={c.id} onDelete={() => onDeleteClip(c)} />
                </MenuProvider>
              );
            })}
            {clips.length < 3 && open && (
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
              <TextInput
                value={item.text}
                multiline
                onChange={(e) => onSetText(e.target.value)}
                placeholder="Write notes here..."
                style={{
                  flex: 1,
                  height: "100%",
                  outline: "none",
                }}
              />
            </Block>
            <Block
              style={{
                backgroundColor: open ? "black" : "#E9E9E9",
              }}
              onClick={() => setOpen(!open)}
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
              duration={item.metaInfo.duration || 0}
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
      </MenuProvider>
      <SongContextMenu id={item.id} onDelete={onDeleteItem} />
    </StyledView>
  );
};

// create your menu first
const SongContextMenu = ({ id, onDelete }) => (
  <Menu id={id}>
    <ContextItem onClick={onDelete}>Remove song</ContextItem>
  </Menu>
);

const ClipContextMenu = ({ id, onDelete }) => (
  <Menu id={id}>
    <ContextItem onClick={onDelete}>Remove clip</ContextItem>
  </Menu>
);
