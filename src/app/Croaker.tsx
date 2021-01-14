import React, { useState, useEffect, useRef, useCallback } from "react";
// import KeyboardEventHandler from "react-keyboard-event-handler";
import urlParser from "js-video-url-parser";
import { request } from "./utils/request";
import { v4 as uuidv4 } from "uuid";

import update from "immutability-helper";
import { SlapItem } from "./SlapItem";
import Authorize from "./Authorize";
import { sansSerif } from "./utils/font";
import { CleanInput, DEFAULT_BLACK } from "./utils/font";
import { useDrop } from "react-dnd";
import { Link, navigate } from "gatsby";
import {
  AiFillAccountBook,
  AiFillDelete,
  AiFillSave,
  AiOutlinePlayCircle,
  AiOutlineSync,
} from "react-icons/ai";
import { usePlayingNowState } from "./players/player-context";
import { useUser } from "./user-context";
import { spotifyTrackToSlapperTrack } from "./utils/helpers";
import { useSlapData } from "./slapdata-context";
import { useYoutube } from "./youtube-context";
import SpotifySync from "./SpotifySync";

export const FOOTER_HEIGHT = 120;


export interface Clip {
  from: number;
  to: number;
  title: string;
  id: string;
  color: string;
}

export interface Item {
  videoId?: string;
  trackId?: string;
  id: string;
  clips: Clip[];
  text: string;
  metaInfo: {
    duration: number;
    title: string;
    artist: string;
    albumImage: string;
  };
}

export default function Croaker({ slapId, type }) {
  const { user } = useUser();
  const [_, drop] = useDrop({
    accept: "nothing",
    drop: (asdf) => {

    },
  });

  const { slaps, dirtySlaps, saveSlap, setReloadSlapsUpdateInt, addItem, setListInfo, moveItem, editItemText, deleteSlap, addClip, setMetaInfo } = useSlapData()
  const ourSlap = slaps.find(s => s.id == slapId)
  const dirty = dirtySlaps[ourSlap?.id]
  const { spotify } = usePlayingNowState();

  const [input, setInput] = useState(
    // "https://www.youtube.com/watch?time_continue=13&v=XUQiSBRgX7M&feature=emb_title"
    ""
  );

  const myInputRef = useRef(null);

  const items = ourSlap?.items || []
  const [spotifyItems, setSpotifyItems] = useState([])
  const [slapUserId, setSlapUserId] = useState(null);
  const [loaded, setLoaded] = useState(!!ourSlap);

  const [spotifyListInfo, setSpotifyListInfo] = useState({
    title: "",
    description: "",
    coverImage: null,
  });
  const [dragging, setDragging] = useState(null);
  const [visibility, setVisibility] = useState("unlisted");

  useEffect(() => {
    if (ourSlap) {
      setLoaded(true)
    }
  }, [!!ourSlap]);

  useEffect(() => {
    if (!slapId) {
      return;
    }

    if (type == "spotify") {
      setLoaded(false);
      spotify.api.getPlaylist(slapId).then((a) => {

        setSpotifyItems(
          a.tracks.items.map(({ track }) => spotifyTrackToSlapperTrack(track))
        );


        setSpotifyListInfo({
          description: a.description.replaceAll("&quot;", '"'),
          title: a.name,
          coverImage: a.images[0].url,
        });
        setLoaded(true);

      });
    } else if (type == "slapper") {
      // check if you need to reload metadata
      if (ourSlap?.items.some(i => i.type == "spotify" && !i.metaInfo.image)) {
        console.log("MUST RELOAD!")
        refreshMetaInfo()
      }
    }
  }, [slapId]);

  const importToSlap = () => {
    request("POST", "fauna/collection", {
      title: spotifyListInfo.title,
      description: spotifyListInfo.description,
      items: spotifyItems,
      user: user.id,
      visibility: visibility,
      spotifyLinked: slapId,
    }).then((res: any) => {
      setReloadSlapsUpdateInt(Math.random())
      navigate("/app/slap/" + res.ref["@ref"].id)
    });

  };

  const go = async () => {
    let trackId;
    let parsed = urlParser.parse(input);
    const id = uuidv4();

    window.splitbee?.track("Add song", { value: input })

    if (input.split(":").length == 3) {
      trackId = input.split(":")[2];
    } else if (input.includes("https://open.spotify.com")) {
      trackId = input.split("track/")[1].split("?")[0];
    } else if (parsed && parsed.provider == "youtube") {
      // setItems([
      //   ...items,
      //   {
      //     videoId: parsed.id,
      //     state: "paused",
      //     id,
      //   },
      // ]);
    } else {
      alert("couldn't parse link");

      setInput("");
      return;
    }

    if (trackId) {
      spotify.api.getTrack(trackId).then(track => {


        addItem(slapId, spotifyTrackToSlapperTrack(track))
      })
    }

    if (parsed && parsed.provider == "youtube") {

      request("GET", "youtube/getVideoData/" + parsed.id)
        .then((res: any) => {

          addItem(slapId, {
            clips: [],
            metaInfo: {
              duration: res.duration * 1000,
              title: res.title,
            },
            type: "youtube",
            videoId: parsed.id,
          })
        })
    }

    setInput("");
  };


  const refreshMetaInfo = () => {

    for (const item of items) {
      if (item.trackId) {
        spotify.api.getTrack(item.trackId).then((track) => {
          setMetaInfo(slapId, item.id, {
            duration: track.duration_ms,
            title: track.name,
            image: track.album.images[0].url,
            artist: track.artists[0].name,
          })
        });
      }
    }
  };




  return (
    <div className="pb-24">
      <div style={{}}>
        <div className="flex">
          {/* <div className="w-40 h-40 bg-gray-600 rounded shadow"></div> */}
          {(ourSlap?.coverImage || spotifyListInfo.coverImage) ? (
            <img
              src={ourSlap?.coverImage || spotifyListInfo.coverImage}
              className="w-60 h-60 rounded shadow-lg"
            ></img>
          ) : (
              <div
                className={
                  "w-60 h-60 bg-gray-400 rounded shadow-lg " +
                  (!loaded && "animate-pulse")
                }
              ></div>
            )}
          <div className="pl-8 pt-4 flex flex-grow flex-col justify-between">
            <div>
              <CleanInput
                className="text-3xl font-bold overflow-visible"
                placeholder="Untitled"
                readOnly={type == "spotify"}
                value={ourSlap?.title || spotifyListInfo.title}
                onChange={(value) => setListInfo(slapId, { title: value })}
              />
              <div className="flex items-center my-4  text-gray-900">
                {/* <img
                  className="rounded-full w-7 h-7 mr-1 shadow"
                  src="https://s.gravatar.com/avatar/4579b299730ddc53e3d523ec1cd5482a?s=200"
                /> */}
                {/* {slapUserId} */}
              </div>
              <CleanInput
                style={{
                  paddingBottom: 30,
                  fontSize: 16,
                }}
                readOnly={type == "spotify"}
                placeholder="Description"
                value={ourSlap?.description || spotifyListInfo.description}
                onChange={(value) =>
                  setListInfo(slapId, { description: value })
                }
              />

              {(slapUserId && user?.id == slapUserId) && (
                <VisibilitySwitcher
                  visibility={visibility}
                  setVisibility={setVisibility}
                />
              )}
            </div>

            <div className="text-gray-500 text-sm">
              {items.length} tracks - {msToHM(items.reduce((duration, item) => duration + item.metaInfo.duration, 0))}
            </div>
          </div>
        </div>

        <div className="flex py-8">
          {/* <button
            className="rounded items-center
          justify-center text-sm flex py-2 px-6 bg-blue-500 hover:bg-blue-600 font-medium text-white  transition duration-150"
          >
            <AiOutlinePlayCircle className="mr-2" /> Listen
          </button> */}
          {type == "spotify" && (
            <button
              onClick={importToSlap}
              className="ml-4 rounded items-center
          justify-center text-sm flex py-2 px-6 bg-green-500 hover:bg-green-600 font-medium text-white  transition duration-150"
            >
              <AiFillAccountBook className="mr-2" /> Import into Slapper
            </button>
          )}

          {/* <button
            onClick={refreshMetaInfo}
            className="ml-4 rounded items-center
          justify-center text-sm flex py-2 px-6 bg-yellow-500 hover:bg-yellow-600 font-medium text-white  transition duration-150"
          >
            <AiFillAccountBook className="mr-2" /> Refresh metainfo
          </button> */}

          <button
            onClick={() => saveSlap(slapId)}
            className={"ml-4 rounded items-center" +
              "justify-center text-sm flex py-2 px-6  font-medium text-white  transition duration-150 "
              + (dirty ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-500")}
          >
            <AiFillSave className="mr-2" /> Save
          </button>

          {ourSlap?.spotifyLinked &&
            <SpotifySync slapId={slapId} />

          }



          <button
            onClick={() => deleteSlap(slapId)}
            className="ml-4 rounded items-center
          justify-center text-sm flex py-2 px-6 bg-red-500 hover:bg-red-600 font-medium text-white  transition duration-150"
          >
            <AiFillDelete className="mr-2" /> Delete
          </button>
        </div>
        <div className="border-t border-gray-100"></div>
        {/* <div className="border-b border-gray-100">
          

        </div> */}
        {(loaded) ?
          <>
            {ourSlap ?

              <div ref={drop}>
                {items.map((item, i) => (
                  <SlapItem
                    moveItem={(...props) => moveItem(slapId, ...props)}
                    addClip={(...props) => addClip(slapId, i, ...props)}
                    key={i}
                    slapId={slapId}
                    item={item}
                    i={i}
                    onSetText={(text) => editItemText(slapId, i, text)}
                    dragging={dragging}
                    setDragging={setDragging}
                  />
                ))}
              </div>
              :
              <div>
                {spotifyItems.map((item, i) => (
                  <SlapItem
                    moveItem={(...props) => moveItem(slapId, ...props)}
                    addClip={(...props) => addClip(slapId, i, ...props)}
                    key={i}
                    slapId={slapId}
                    item={item}
                    i={i}
                    dragging={dragging}
                    setDragging={setDragging}
                  />
                ))}
              </div>
            }
          </>
          :
          <div>

            <div className="bg-gray-200 animate-pulse w-full h-12 mb-4 rounded"></div>
            <div className="bg-gray-200 animate-pulse w-full h-12 mb-4 rounded"></div>
            <div className="bg-gray-200 animate-pulse w-full h-12 mb-4 rounded"></div>
          </div>
        }




        {!spotify.credentials && items.find((i) => i.trackId) && (
          <div
            style={{
              border: "1px solid black",
              width: "fit-content",
              padding: 10,
            }}
          >
            <div>Connect with spotify to play this Slap</div>
            <Authorize spotify={spotify} />
          </div>
        )}

        {user?.plan == "premium" || items.length < 5 ? (
          <>
            <form onSubmit={e => {
              e.preventDefault()
              go()
            }}>
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
                    ...sansSerif,
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
                <button className="ml-4 rounded items-center justify-center text-sm flex py-2 px-6 bg-green-500 hover:bg-green-600 font-medium text-white  transition duration-150">Upgrade to premium</button>
              </Link>
            </div>
          )}
      </div>
    </div>
  );
}

function VisibilitySwitcher({ setVisibility, visibility }) {
  return (
    <div
      style={{
        marginBottom: 10,
      }}
    >
      {visibility == "public" ? (
        <div
          style={{
            fontSize: 12,
          }}
        >
          This slap is public.{" "}
          <a onClick={() => setVisibility("unlisted")} href="#">
            Change to "unlisted"
          </a>
        </div>
      ) : (
          <div
            style={{
              fontSize: 12,
            }}
          >
            This slap can only be accessed by link.{" "}
            <a onClick={() => setVisibility("public")} href="#">
              Change to "public"
          </a>
          </div>
        )}
    </div>
  );
}


export const msToHM = (ms) => {
  const minutes = Math.round(ms / 60_000)
  const hours = Math.floor(minutes / 60)

  return (hours && (hours + " hrs ")) + minutes % 60 + " mins"
}