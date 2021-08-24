import { navigate } from "gatsby";
import React, { useEffect, useRef, useState } from "react";
import Helmet from "react-helmet";
import Authorize from "../app/Authorize";
import Spotify from "../app/Spotify";
import Bar from "../app/Timeline/Bar";
import { ClipSimpleForLooper } from "../ClipSimpleForLooper";
const spotify = new Spotify();

export default function SpotifyABLooper() {
  const [playingNow, setPlayingNow] = useState(null);
  
  const [loopActive, setLoopActive] = useState(false);
  const [lastPeek, setLastPeek] = useState({
    timeLeft: null,
    atTime: new Date(),
  });
  const [clip, setClip] = useState({
    from: 10_000,
    to: 20_000,
  });

  useEffect(() => {
    if (playingNow?.state == "playing" && loopActive) {
      const timeout = setTimeout(() => {}, 1000);

      return () => clearTimeout(timeout);
    }
  }, [playingNow, loopActive]);

  const lineRef = useRef(null);

  useEffect(() => {
    spotify.onUpdatePlaybackState = (playbackState) => {
      
      if (!playbackState) {
        setPlayingNow(null);
        return
      }

      console.log(
        "playbackState.progress_ms < clip.to: ",
        playbackState.progress_ms,
        clip.to
      );
      if (loopActive && playbackState.progress_ms < clip.to) {
        setLastPeek({
          timeLeft: clip.to - playbackState.progress_ms,
          atTime: new Date(),
        });
      } else {
        setLastPeek({
          timeLeft: null,
          atTime: new Date(),
        });
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
  }, [spotify, clip]);

  const goToBeginning = () => {
    spotify.api.seek(clip.from);
  };

  useEffect(() => {
    if (playingNow?.state == "playing" && lastPeek.timeLeft > 0) {
      const timeout = setTimeout(goToBeginning, lastPeek.timeLeft);
      return () => clearTimeout(timeout);
    }
  }, [lastPeek.timeLeft, playingNow]);

  return (
    <div className="bg-yellow-50 min-h-screen flex justify-center">
      <div className="max-w-lg w-full px-4 pt-12">
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
        {playingNow ? (
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
        ): (
          <div className="text-sm">Play a song in your favorite Spotify app to make the looper appear!</div>
        )
      
      }

        {playingNow && (
          <div className="text-sm my-8">
            <div className="flex">
              <div className="w-12 text-xs flex justify-center text-gray-500 font-light pt-2">
                <Time
                  playing={playingNow?.state == "playing"}
                  position={playingNow.position}
                />
              </div>
              <div ref={lineRef} className="relative flex-grow h-20">
                {lineRef?.current && (
                  <>
                    <ClipSimpleForLooper
                      active={loopActive}
                      clip={clip}
                      isHovering={true}
                      duration={playingNow.playbackState?.item?.duration_ms}
                      parent={lineRef.current}
                      onUpdateClip={setClip}
                    />
                    <Bar
                      parent={lineRef.current}
                      duration={playingNow.playbackState?.item?.duration_ms}
                      value={playingNow.position?.ms || 0}
                      onUp={(ms) => spotify?.api?.seek(ms)}
                      isPlaying={playingNow.state == "playing"}
                    />
                  </>
                )}
              </div>
              <div className="w-12 text-xs flex justify-center text-gray-500 font-light pt-2">
                {msToTime(playingNow.playbackState?.item?.duration_ms)}
              </div>
            </div>

            <div>
              <button
                onClick={goToBeginning}
                className=" border px-2 py-1 text-sm border-gray-700 bg-white shadow mt-2"
              >
                Go to loop start
              </button>
              <div className="my-2">
                Loop active:{" "}
                <input
                  type="checkbox"
                  checked={loopActive}
                  onChange={(e) => {
                    setLoopActive(e.target.checked);
                  }}
                />
              </div>
              {loopActive && (
                <div className="my-2">
                  Looping in:{" "}
                  <CountDown
                    playing={playingNow?.state == "playing"}
                    lastPeek={lastPeek}
                  />
                </div>
              )}
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

const CountDown = ({ lastPeek, playing }) => {
  const [time, setTime] = useState(lastPeek.timeLeft);

  useEffect(() => {
    setTime(lastPeek.timeLeft);
    if (playing) {
      const interval = setInterval(() => {
        const timeSinceSampling = Date.now() - lastPeek.atTime;
        setTime(lastPeek.timeLeft - timeSinceSampling);
      }, 60);
      return () => clearInterval(interval);
    }
  }, [lastPeek.timeLeft, playing]);

  return <>{time}</>;
};
