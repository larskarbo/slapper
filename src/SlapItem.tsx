import React, { useState } from "react";
import { TextInput, View } from "react-native";
import SegmentView from "./SegmentView/SegmentView";

import { Menu, Item as ContextItem, MenuProvider } from "react-contexify";
import styled from "styled-components/native";
import Play from "./comp/Play";
import { Item, Clip } from "./Croaker";
import { FaSpotify, FaYoutube } from "react-icons/fa";
import { sansSerif, TText } from "./utils/font";
import { isClipPlaying } from "./utils/helpers";

const StyledView = styled.View`
  width: 100%;
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
  disabled,
  onDeleteItem,
  item,
}: {
  item: Item;
  [key: string]: any;
}) => {
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
              disabled={disabled}
              onPress={() => {
                if (disabled) {
                  alert("You need to connect to Spotify to play this song.");
                  return;
                }
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
              <TText
                style={{
                  width: "100%",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  fontWeight: "bold",
                }}
              >
                {title}
              </TText>
              <TText
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
              </TText>
            </View>
          </Block>
          {clips.map((c) => {
            const clipIsPlaying = isClipPlaying(playingNow, c);
            return (
              <Block
                key={c.id}
                style={{
                  backgroundColor: "#E9E9E9",
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
                <TText
                  style={{
                    paddingLeft: 6,
                  }}
                >
                  {c.title}
                </TText>
              </Block>
            );
          })}
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
              padding: 0,
            }}
          >
            <TextInput
              value={item.text}
              multiline
              onChange={(e) => onSetText(e.target.value)}
              placeholder="Write notes here..."
              style={{
                padding: 0,
                fontSize: 10,
                width: 200,
                flex: 1,
                height: "100%",
                outline: "none",
                ...sansSerif,
              }}
            />
          </Block>

          <MenuProvider id={item.id} event="onClick">
            <Block
              style={{
                flex: 1,
                pointer: "default"
              }}
            >
              ...
            </Block>
          </MenuProvider>
        </View>
      </View>

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
