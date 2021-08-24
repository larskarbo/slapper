import { navigate } from "gatsby";
import React, { useEffect, useRef, useState } from "react";
import Helmet from "react-helmet";
import Authorize from "../app/Authorize";
import Spotify from "../app/Spotify";
import Bar from "../app/Timeline/Bar";
import { Clip } from "../app/Timeline/Clip";
import { ClipSimpleForLooper } from "../ClipSimpleForLooper";
const spotify = new Spotify();
export default function SpotifyABLooper() {
  const [playingNow, setPlayingNow] = useState(null);
  const [loopFrom, setLoopFrom] = useState("0:00");
  const [loopTo, setLoopTo] = useState("0:30");
  const [loopActive, setLoopActive] = useState(false);

  useEffect(() => {
    if (playingNow?.state == "playing" && loopActive) {
      const timeout = setTimeout(() => {}, 1000);

      return () => clearTimeout(timeout);
    }
  }, [playingNow, loopFrom, loopTo, loopActive]);

  const lineRef = useRef(null);

  useEffect(() => {
    console.log(
      "spotify.onUpdatePlaybackState: ",
      spotify.onUpdatePlaybackState
    );
    spotify.onUpdatePlaybackState = (playbackState) => {
      console.log("playbackState: ", playbackState);
      if (!playbackState) {
        setPlayingNow(null);
      }

      setPlayingNow((playingNow) => ({
        playbackState,
        position: playbackState
          ? {
              ms: playbackState.progress_ms,
              timestamp: Date.now(),
            }
          : undefined,
        state: playbackState?.is_playing ? "playing" : "paused",
      }));
    };
  }, [spotify]);

  return (
    <div className="bg-yellow-50 min-h-screen flex justify-center">
      <div className="max-w-2xl pt-12">
        <div className="text-center uppercase font-light my-8">Slapper.io</div>
        <Helmet>
          <title>Spotify AB-looper online</title>
          <meta
            name="description"
            content="Loop a segment of a song on Spotify with this online AB-repeater looping tool. Connects with Spotify and let's you loop for practice or entertainment!"
          />
        </Helmet>
        <h1 className="text-4xl font-bold text-center my-8">
          Spotify AB-looper
        </h1>

        {!spotify.credentials && <Authorize spotify={spotify} />}

        <div className="text-sm font-bold my-4">
          Control playback in your Spotify app.
        </div>
        {playingNow && (
          <div>
            <div className="text-xs uppercase mb-4">
              Currently {playingNow.state == "playing" ? "playing" : "paused"}:
            </div>
            <div className="flex ">
              <div className="h-10 w-10 mr-4 rounded shadow relative overflow-hidden">
                <img
                  className=""
                  src={playingNow.playbackState?.item?.album?.images?.[0]?.url}
                />
              </div>
              <div className="font-light text-gray-800 text-sm w-40  overflow-hidden pr-4">
                <div
                  className={"font-medium whitespace-nowrap overflow-ellipsis "}
                >
                  {playingNow.playbackState?.item?.name}
                </div>
                <div className="whitespace-nowrap overflow-ellipsis">
                  {playingNow.playbackState?.item?.artists?.[0]?.name}
                </div>
              </div>
            </div>
          </div>
        )}

        {playingNow && (
          <div className="text-sm my-8">
            <div>
              Current time:{" "}
              <Time
                playing={playingNow.state == "playing"}
                position={playingNow.position}
              />
            </div>
            <div>
              Song duration:{" "}
              {msToTime(playingNow.playbackState?.item?.duration_ms)}
            </div>
            <div>
              Loop active:{" "}
              <input
                type="checkbox"
                checked={loopActive}
                onChange={(e) => {
                  setLoopActive(e.target.checked);
                }}
              />
            </div>
            <div>
              Loop from:{" "}
              <input
                className="border p-1 m-1"
                type="text"
                value={loopFrom}
                onChange={(e) => {
                  setLoopFrom(e.target.value);
                }}
              />
            </div>
            <div>
              Loop to:{" "}
              <input
                className="border p-1 m-1"
                type="text"
                value={loopTo}
                onChange={(e) => {
                  setLoopTo(e.target.value);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const msToTime = (ms) => {
  if (!ms) {
    return "";
  }
  const secondsTot = Math.round(ms / 1000);
  const minutes = Math.floor(secondsTot / 60);
  const seconds = (secondsTot % 60) + "";
  return minutes + ":" + seconds.padStart(2, "0");
};

const getTime = (position) => {
  if (!position) {
    return null;
  }
  const timeSinceSampling = Date.now() - position.timestamp;
  return msToTime(position.ms + timeSinceSampling);
};

const Time = ({ position, playing }) => {
  const [time, setTime] = useState(getTime(position));

  useEffect(() => {
    setTime(getTime(position));
    if (playing) {
      const interval = setInterval(() => {
        setTime(getTime(position));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [position, playing]);

  return <>{time}</>;
};
