import React, { useState, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import KeyboardEventHandler from "react-keyboard-event-handler";
import SegmentView, { msToTime } from "./SegmentView/SegmentView";
import YouTube from "react-youtube";
import urlParser, { YouTubeParseResult } from "js-video-url-parser";
import Players from "./Players";
import useHover from "@react-hook/hover";
import { Splat } from "./Splat";

export default function Croaker({ spotify }) {
  // const [input, setInput] = useState("spotify:track:0bXpmJyHHYPk6QBFj25bYF")
  const [input, setInput] = useState(
    "https://www.youtube.com/watch?time_continue=13&v=XUQiSBRgX7M&feature=emb_title"
  );
  const [spotifies, setSpotifies] = useState([]);
  const [youtubes, setYoutubes] = useState([
    { videoId: "W9WnR9xavv4", state: "paused", from: 0, to: 130121 },
    {
      videoId: "4oEQ8Nj1zmw",
      from: 40000,
      to: 239000,
      state: "paused",
      duration: 239000,
    },
    { videoId: "tIhaZV9hgWw", state: "paused", from: 105625, to: 127563 },
    { videoId: "FxYw0XPEoKE", state: "paused", from: 221000, to: 255283 },

    // {
    //   videoId: "XUQiSBRgX7M",
    //   state: "paused",
    //   to: 6000
    // },
    // {
    //   videoId: "Oso6dYXw5lc",
    //   state: "paused",
    // }
  ]);
  console.log("youtubes: ", JSON.stringify(youtubes));

  // useEffect(() => {
  //   setTimeout(() => {
  //     setYoutubes(["https://www.youtube.com/watch?time_continue=13&v=XUQiSBRgX7M&feature=emb_title"])
  //   }, 500)
  // }, [])

  const go = () => {
    let trackid;
    let parsed = urlParser.parse(input);

    if (input.split(":").length == 3) {
      trackid = input.split(":")[2];
      setSpotifies([
        ...spotifies,
        {
          trackid,
        },
      ]);
    } else if (input.includes("https://open.spotify.com")) {
      trackid = input.split("track/")[1].split("?")[0];
      setSpotifies([
        ...spotifies,
        {
          trackid,
        },
      ]);
    } else if (parsed) {
      setYoutubes([
        ...youtubes,
        {
          videoId: parsed.id,
          state: "paused",
        },
      ]);
    } else {
      alert("couldn't parse link");
      return;
    }

    setInput("");
  };

  const play = (s) => {
    setYoutubes(
      youtubes.map((y) => {
        if (y.videoId == s.videoId) {
          return {
            ...y,
            state: "playing",
          };
        }
        return {
          ...y,
          state: "paused",
        };
      })
    );
  };

  const pause = (s) => {
    setYoutubes(
      youtubes.map((y) => {
        if (y.videoId == s.videoId) {
          return {
            ...y,
            state: "paused",
          };
        }
        return y;
      })
    );
  };

  const setSegment = (s, segment) => {
    setYoutubes(
      youtubes.map((y) => {
        if (y.videoId == s.videoId) {
          return {
            ...y,
            from: segment.from,
            to: segment.to,
          };
        }
        return y;
      })
    );
  };

  return (
    <View
      style={{
        paddingLeft: 200,
      }}
    >
      <Text
        style={{
          paddingVertical: 100,
          fontSize: 45,
          fontWeight: 200,
        }}
      >
        <span
          style={{
            fontWeight: 700,
          }}
        >
          Slapper
        </span>
        .io
      </Text>
      {youtubes.map((s) => (
        <YoutubeFucker
          key={s.videoId}
          s={s}
          onPause={() => pause(s)}
          onPlay={() => play(s)}
          setSegment={(segment) => setSegment(s, segment)}
        />
      ))}
      {spotifies.map((s) => (
        <SpotifyFucker spotify={spotify} key={s.trackid} s={s} />
      ))}

      {/* <Splat
        title="test song"
        duration={50000}
        pointerAt={20000}
        playing={true}
        loading={false}
      >
        <Text>Image</Text>
      </Splat> */}

      <KeyboardEventHandler handleKeys={["Enter"]} onKeyEvent={go}>
        <input
          style={{
            height: 60,
            width: 500,
            padding: 20,
            outline: "none",
            borderWidth: 0,
            fontSize: input.length ? 12 : 25,
          }}
          type="text"
          placeholder="Paste youtube link here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </KeyboardEventHandler>

      {/* <Players /> */}
    </View>
  );
}

const SpotifyFucker = ({ spotify, s }) => {
  const [track, setTrack] = useState(null);
  const [segment, setSegment] = useState({
    start: 10000,
    end: 20000,
  });

  useEffect(() => {
    spotify.s.getTrack(s.trackid).then((track) => {
      setTrack(track);
    });
  }, [s.trackid]);

  return (
    <Splat>
      {track && (
        <div>
          <img
            onClick={() => {
              spotify.s.play({
                uris: ["spotify:track:" + s.trackid],
                // position_ms: seek
              });
            }}
            src={track.album.images[2].url}
            style={{
              width: 64,
            }}
          />
          {track.name}
          <SegmentView
            track={track}
            spotify={spotify.s}
            segment={segment}
            isInside={true}
            updateSegment={setSegment}
          />
        </div>
      )}
    </Splat>
  );
};

const YoutubeFucker = ({ spotify, s, onPlay, onPause, setSegment }) => {
  const [youtubeElement, setYoutubeElement] = useState(null);
  const [title, setTitle] = useState(null);
  const [duration, setDuration] = useState(s.duration || null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [pointerAt, setPointerAt] = useState(s.from ? s.from : 0);

  useEffect(() => {
    if (!youtubeElement) return;
    if (s.state == "playing") {
      youtubeElement.target.playVideo();
      setPlaying(true);
    } else {
      youtubeElement.target.pauseVideo();
      setPlaying(false);
    }
  }, [s.state, youtubeElement]);

  useEffect(() => {
    if (youtubeElement) {
      const player = youtubeElement.target;

      // States: 1: playing, 2: paused, 5: stopped
      if ([1, 2, 5].indexOf(player.getPlayerState()) >= 0) {
        const data = player.getVideoData();

        setDuration(player.getDuration() * 1000);
        setSegment({
          from: s.from ? s.from : 0,
          to: s.to ? s.to : player.getDuration() * 1000,
        });
        setTitle(player.getVideoData().title);
        if (s.from) {
          youtubeElement.target.seekTo(s.from / 1000);
          setPointerAt(s.from);
          player.pauseVideo();
        }
        setLoading(false);
      }
    }
  }, [youtubeElement]);

  useEffect(() => {
    if (youtubeElement) {
      const pointerAt = youtubeElement?.target?.playerInfo?.currentTime * 1000;
      if (pointerAt) {
        setPointerAt(pointerAt);

        if (s.state == "playing") {
          const timeUntilStop = s.to - pointerAt;
          console.log("timeUntilStop: ", timeUntilStop);
          const timeout = setTimeout(() => {
            onPause();
          }, timeUntilStop);
          return () => clearTimeout(timeout);
        }
      }
    }
  }, [s.state, youtubeElement]);

  const scrub = (to) => {
    console.log("scrubbing to: ", to);
    youtubeElement.target.seekTo(to / 1000);

    setPointerAt(to);
  };

  //

  return (
    <Splat
      loading={loading}
      title={title}
      duration={duration}
      pointerAt={pointerAt}
      onPause={onPause}
      onPlay={onPlay}
      playing={playing}
      onScrub={scrub}
      segment={{
        from: s.from || 0,
        to: s.to ? s.to : duration,
      }}
      setSegment={setSegment}
    >
      <YouTube
        videoId={s.videoId}
        opts={{
          height: "60",
          width: "60",
        }}
        onReady={setYoutubeElement}
        // onStateChange={func}
      />
    </Splat>
  );
};
