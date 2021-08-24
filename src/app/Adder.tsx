import React, { Component, useRef, useState } from "react";
import urlParser from "js-video-url-parser";
import { v4 as uuidv4 } from "uuid";
import { usePlayingNowState } from "./players/player-context";
import { useSlapData } from "./slapdata-context";
import { request } from "./utils/request";
import { spotifyTrackToSlapperTrack } from "./utils/helpers";
import { Link } from "gatsby";

const Adder = ({ slapId, allowedToAdd }) => {
  const [input, setInput] = useState("");
  const { spotify } = usePlayingNowState();
  const { addItem } = useSlapData();
  const myInputRef = useRef(null);

  const go = async () => {
    let trackId;
    let parsed = urlParser.parse(input);
    const id = uuidv4();


    if (input.split(":").length == 3) {
      trackId = input.split(":")[2];
    } else if (input.includes("https://open.spotify.com")) {
      trackId = input.split("track/")[1].split("?")[0];
    } else if (parsed && parsed.provider == "youtube") {
      request("GET", "youtube/getVideoData/" + parsed.id).then((res: any) => {
        addItem(slapId, {
          clips: [],
          metaInfo: {
            duration: res.duration * 1000,
            title: res.title,
          },
          type: "youtube",
          videoId: parsed.id,
        });
      });
    } else {
      alert("couldn't parse link");

      setInput("");
      return;
    }

    if (trackId) {
      spotify.api.getTrack(trackId).then((track) => {
        addItem(slapId, spotifyTrackToSlapperTrack(track));
      });
    }

    setInput("");
  };

  return (
    <div>
      {allowedToAdd ? (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go();
            }}
          >
            <div
              style={{
                position: "relative",
                marginTop: 20,
                width: 500,
              }}
            >
              <input
                ref={myInputRef}
                className="rounded border border-gray-400 mb-2"
                type="text"
                style={{
                  outline: "none",
                  fontSize: input.length ? 10 : 15,
                  width: "100%",
                  padding: "10px 20px",
                  borderWidth: 1,
                  height: 45,
                }}
                placeholder="Paste youtube or spotify link here"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {input.length > 0 && (
                <button
                  type="submit"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 10,
                    bottom: 10,
                    backgroundColor: "white",
                    justifyContent: "center",
                    paddingLeft: 20,
                  }}
                >
                  <div>Press enter to add</div>
                </button>
              )}
            </div>
          </form>
          <div
            style={{
              fontSize: 10,
              fontStyle: "italic",
            }}
          >
            ↑ Examples: ↑
          </div>
          <div
            style={{
              fontSize: 10,
              color: "blue",
              textDecoration: "underline",
            }}
          >
            <a
              href="#"
              onClick={() => {
                setInput("https://www.youtube.com/watch?v=Ob7vObnFUJc");
                myInputRef.current.focus();
              }}
            >
              https://www.youtube.com/watch?v=Ob7vObnFUJc
            </a>
          </div>
          <div
            style={{
              fontSize: 10,
              color: "blue",
              textDecoration: "underline",
            }}
          >
            <a
              href="#"
              onClick={() => {
                setInput("spotify:track:698ItKASDavgwZ3WjaWjtz");
                myInputRef.current.focus();
              }}
            >
              spotify:track:698ItKASDavgwZ3WjaWjtz
            </a>
          </div>
          <div
            style={{
              fontSize: 10,
              color: "blue",
              textDecoration: "underline",
            }}
          >
            <a
              href="#"
              onClick={() => {
                setInput(
                  "https://open.spotify.com/track/14WuWxuKmGsNTD7wXEt1jH?si=yjaNviDBRB6aTQ1X0zgjtQ"
                );
                myInputRef.current.focus();
              }}
            >
              https://open.spotify.com/track/14WuWxuKmG...TQ1X0zgjtQ
            </a>
          </div>
        </>
      ) : (
        <div
          style={{
            padding: 20,
            backgroundColor: "#FFDCA8",
          }}
        >
          <div
            style={{
              fontWeight: 700,
            }}
          >
            5 songs per slap is the maximum for the Standard plan
          </div>
          <div
            style={{
              marginBottom: 20,
            }}
          >
            Upgrade to premium to get the full Slapper experience, and support
            the development of the app!
          </div>
          <Link to="/app/settings">
            <button className="ml-4 rounded items-center justify-center text-sm flex py-2 px-6 bg-green-500 hover:bg-green-600 font-medium text-white  transition duration-150">
              Upgrade to premium
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Adder;
