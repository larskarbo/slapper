import Authorize from "../Authorize";
import DeviceSelector from "../DeviceSelector";
import React, { useEffect } from "react";
import { Item, Clip } from "./Croaker";

export const SpotifyBox = ({
  spotify,
  items,
  playingNow,
  onSetMetaInfo,
  onSetPlayingNow,
}: {
  items: Item[];
  [key: string]: any;
}) => {
  const spotifyItems = items.filter((i) => i.trackId);
  const playingNowTrack = playingNow?.item.trackId ? playingNow : null;
  // useEffect(() => spotify.playPauseWhatever(items), [items]);

  useEffect(() => {
    spotify.onUpdatePlaybackState = (playbackState) => {
      if (
        playingNowTrack &&
        playingNowTrack.item.trackId == playbackState?.item?.id
      ) {
        onSetPlayingNow({
          position: playbackState.progress_ms,
        });
      }
    };
  }, [spotify, playingNowTrack]);

  useEffect(() => {}, [playingNowTrack?.clientUpdate]);

  useEffect(() => {
    if (!playingNowTrack) {
      spotify.api.pause();
      return;
    }
    if (!playingNowTrack.action) return;

    playAction();
  }, [playingNowTrack?.clientUpdate]);

  // seeking
  useEffect(() => {
    if (playingNowTrack?.scrub) {
      onSetPlayingNow({
        position: playingNowTrack.scrub,
      });
      (async () => {
        await spotify.api.seek(playingNowTrack.scrub);
          onSetPlayingNow({
            position: playingNowTrack.scrub,
          });
      
      })()
    }
  }, [playingNowTrack?.scrub]);

  const playAction = async () => {
    if (playingNowTrack.action == "wantToPause") {
      const position = spotify.estimatePosition();
      await spotify.api.pause();
      onSetPlayingNow({
        state: "paused",
        action: null,
        position,
      });
    } else if (playingNowTrack.action == "wantToPlay") {
      const playObject: any = {
        uris: ["spotify:track:" + playingNowTrack.item.trackId],
      };

      if (playingNowTrack.type == "item") {
        if (!playingNowTrack.position) {
          playObject.position_ms = 0;
        }
      } else if (playingNowTrack.type == "clip") {
        playObject.position_ms = playingNowTrack.clip.from;
      }
      await spotify.play(playObject);
      onSetPlayingNow({
        state: "playing",
        action: null,
        ...(playObject.position_ms
          ? { position: playObject.position_ms }
          : undefined),
      });
    }
  };

  return (
    <div
      style={{
        
      }}
    >
      <Authorize spotify={spotify} />

      {spotifyItems.map((item) => (
        <Track
          key={item.trackId}
          spotify={spotify}
          item={item}
          onSetMetaInfo={onSetMetaInfo}
        />
      ))}

      {spotify.credentials && <DeviceSelector spotify={spotify} />}
    </div>
  );
};

const Track = ({ item, onSetMetaInfo, spotify }) => {
  useEffect(() => {
    spotify.api.getTrack(item.trackId).then((track) => {
      console.log('track: ', track);
      onSetMetaInfo(item, {
        duration: track.duration_ms,
        title: track.name,
        image: track.album.images[0].url,
        artist: track.artists[0].name
      });
    });
  }, [item.trackId]);

  return null;
};
