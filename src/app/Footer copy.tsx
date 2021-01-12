import React, { useEffect, useRef, useState } from "react";
import SegmentView from "./SegmentViewf/SegmentView";
import useHover from "@react-hook/hover";
import { TText } from "./utils/font";
import Play from "./comp/Play";
import CircleButton from "./comp/CircleButton";
import { RiRepeatFill } from "react-icons/ri";
import { AiFillSound } from "react-icons/ai";
import { ImPause2, ImPlay3 } from "react-icons/im";

const Footer = ({
  onAddClip,
  onDeleteClip,
  playingNow,
  onPause,
  children,
  clipRepeat,
  setClipRepeat,
  onUpdateClip,
  onScrub,
  onSetPlayingNow,
  items,
  onPlay,
}) => {
  //
  //
  const playOrPause = () =>
    playingNow?.state == "playing" ? onPause() : onPlay();

  useEffect(() => {
    document.onkeydown = (e) => {
      if (e.code == "Space") {
        if (e.target.nodeName === "TEXTAREA" || e.target.nodeName === "INPUT") {
          return;
        }
        e.preventDefault();
        playOrPause();
      }
    };
  }, [playingNow?.state]);

  return (
    <div
      style={{
        display: "flex",
        flexGrow: 1,
        flexDirection: "row",
        height: "100%",
      }}
    >
      <div
        style={{
          justifyContent: "center",
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        {/* <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          
        </div> */}
        <img
          style={{
            width: 64,
          }}
          src={playingNow?.item.metaInfo.image}
        />
      </div>

      <div
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
        {/* <MarqueeText
          style={{ fontSize: 16, fontWeight: "800" }}
          duration={3000}
          marqueeOnStart={false}
          loop
          marqueeDelay={1000}
          marqueeResetDelay={1000}
        >
          {playingNow?.item.metaInfo.title}
        </MarqueeText> */}

        <TText
          style={{
            fontWeight: "200",
          }}
        >
          {playingNow?.item.metaInfo.artist}
        </TText>
      </div>

      <div
        style={{
          alignItems: "center",
          paddingLeft: 5,
          paddingRight: 5,
          flexDirection: "row",
        }}
      >
        {playingNow?.item && (
          <Play
            playing={playingNow?.state == "playing"}
            onPress={playOrPause}
          />
        )}

        {playingNow?.type == "clip" && (
          <div
            style={{
              border: "solid 2px black",
              padding: 5,
              marginLeft: 5,
            }}
          >
            <TText>
              {playingNow.state == "playing" ? <AiFillSound /> : <ImPause2 />}

              {playingNow.clip.title}
            </TText>
            <div
              style={{
                flexDirection: "row",
              }}
            >
              <CircleButton
                Icon={ImPlay3}
                onPress={() => {
                  const playable = {
                    type: "clip",
                    item: playingNow.item,
                    clip: playingNow.clip,
                  };
                  onPlay(playable);
                }}
              />
              <CircleButton
                inverted={clipRepeat}
                Icon={RiRepeatFill}
                onPress={() => {
                  setClipRepeat(!clipRepeat);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        {playingNow ? (
          <SegmentView
            clips={
              playingNow
                ? items.find((i) => playingNow.item.id == i.id)?.clips || []
                : []
            }
            duration={playingNow?.item.metaInfo.duration || 0}
            pointerAt={playingNow?.position || 0}
            playing={playingNow?.state == "playing"}
            playingNow={playingNow}
            onScrub={onScrub}
            onPlay={(clip) => {
              const playable = {
                type: "clip",
                item: playingNow?.item,
                clip: clip,
              };
              onPlay(playable);
            }}
            onPause={onPause}
            item={playingNow?.item}
            onAddClip={onAddClip}
            onDeleteClip={onDeleteClip}
            onUpdateClip={(clip, whatever) =>
              onUpdateClip(playingNow?.item, clip, whatever)
            }
          />
        ) : (
          <TText>Play song to get started...</TText>
        )}
      </div>
      {children}
      {/* <div
        style={{
          justifyContent: "center",
          width: 200
        }}
      >
      Playing from spotify
      </div> */}
    </div>
  );
};

export default Footer;
