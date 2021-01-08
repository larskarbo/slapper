import React, { useState, useEffect, useRef, useCallback } from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import urlParser from "js-video-url-parser";
import { request } from "./utils/request";
import { v4 as uuidv4 } from "uuid";

import update from 'immutability-helper';
import Players, { PlayingNow, PlayIntent } from "./players/Players";
import { SlapItem } from "./SlapItem";
import { useThrottle } from "use-throttle";
import Sidebar from "./SidebarOld";
import Footer from "./Footer";
import Authorize from "./Authorize";
import Profile from "./Profile";
import Browse from "./Browse";
import { sansSerif } from "./utils/font";
import { CleanInput, DEFAULT_BLACK, TText } from "./utils/font";
import Spotify from "./Spotify";
import { useDrop } from 'react-dnd'
import LinkShare from "./comp/LinkShare";
import { BButton } from "./comp/BButton";
// import { Helmet } from "react-helmet";
import useLocalStorage from "use-localstorage-hook";
import { Link } from 'gatsby';
import { FaPlay } from "react-icons/fa";
import { AiFillAccountBook, AiFillPlayCircle, AiFillSave, AiOutlinePlayCircle } from "react-icons/ai";
import { IoPlay, IoPlaySharp } from "react-icons/io5";
import { useSpotify } from "./players/spotify-context";

export const FOOTER_HEIGHT = 120;
const itemsForServer = (items) => {
  const forServer = JSON.parse(JSON.stringify(items));

  return forServer.map((i) => {
    delete i.state;
    delete i.position;
    return i;
  });
};

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


export default function Croaker({ loadingUser, user, collectionId, type }) {
  const [collectedProps, drop] = useDrop({
    accept: "nothing",
    drop: (asdf) => {
      console.log('asdf: ', asdf);

    }
  })
  const spotify = useSpotify()
  const [input, setInput] = useState(
    // "https://www.youtube.com/watch?time_continue=13&v=XUQiSBRgX7M&feature=emb_title"
    ""
  );

  const myInputRef = useRef(null);

  const [playingNow, setPlayingNow] = useState<PlayingNow>(null);
  const [playIntent, setPlayIntent] = useState<PlayIntent>(null);

  const [clipRepeat, setClipRepeat] = useLocalStorage("clipRepeat", true);

  const [items, setItems] = useState([]);
  const [slapUserId, setSlapUserId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const throttledItems = useThrottle(items, 1000);
  const [listInfo, setListInfo] = useState({
    title: "",
    description: "",
    coverImage: null
  });
  const [title, setTitle] = useState("");
  const [dragging, setDragging] = useState(null);
  const throttledTitle = useThrottle(title, 1000);
  const [description, setDescription] = useState("");
  const throttledDescription = useThrottle(description, 1000);
  const [visibility, setVisibility] = useState("unlisted");

  useEffect(() => {
    if (!collectionId) {
      return;
    }
    setLoaded(false);

    if (type == "spotify") {
      spotify.api.getPlaylist(collectionId)
        .then(a => {
          console.log(a)
          setItems(a.tracks.items.map((spotifyItem, i) => {
            return {
              clips: i == 0 ? [
                {
                  title: "Intro",
                  from: 0,
                  to: 30000,
                  color: "red"
                }
              ] : [],
              metaInfo: {
                duration: spotifyItem.track.duration_ms,
                title: spotifyItem.track.name,
                artist: spotifyItem.track.artists[0].name,
                image: spotifyItem.track.album.images[2].url
              },
              type: "spotify",
              trackId: spotifyItem.track.id
            }
          }))
          console.log('a.description: ', a.description);

          setListInfo({
            description: a.description.replaceAll("&quot;", '"'),
            title: a.name,
            coverImage: a.images[0].url
          });
        })

    } else if (type == "slapper") {
      request("GET", "fauna/collection/" + collectionId).then((res: any) => {
        setItems(
          res.data.items.map((i) => {
            const newItem: Item = {
              videoId: i.videoId,
              trackId: i.trackId,
              id: i.id,
              clips: (i.clips || []).map((clip) => {
                const newClip: Clip = {
                  from: clip.from,
                  to: clip.to,
                  title: clip.title,
                  id: clip.id,
                  color: clip.color,
                };
                return newClip;
              }),
              text: i.text,
              metaInfo: {
                duration: i.metaInfo?.duration,
                title: i.metaInfo?.title,
                artist: i.metaInfo?.artist,
                image: i.metaInfo?.image,
              },
            };
            return newItem;
          })
        );
        setListInfo({
          description: res.data.description,
          title: res.data.title,
          coverImage: "https://via.placeholder.com/150"
        })
        setSlapUserId(res.data.user);
        setVisibility(res.data.visibility || "unlisted");
        setLoaded(true);
      });

    }

  }, [collectionId]);


  // useEffect(() => {
    // if (!loaded) {
    //   return;
    // }
    // if (user?.id != slapUserId) {
    //   return;
    // }
    // request("PUT", "fauna/collection/" + collectionId, {
    //   title,
    //   description,
    //   items: itemsForServer(items),
    //   user: user.id,
    //   visibility: visibility,
    // }).then((res: any) => { });
  // }, [throttledItems, throttledDescription, throttledTitle, visibility]);

  const go = () => {
    let trackId;
    let parsed = urlParser.parse(input);
    const id = uuidv4();

    if (input.split(":").length == 3) {
      trackId = input.split(":")[2];
      setItems([
        ...items,
        {
          trackId,
          state: "paused",
          id,
        },
      ]);
    } else if (input.includes("https://open.spotify.com")) {
      trackId = input.split("track/")[1].split("?")[0];

      setItems([
        ...items,
        {
          trackId,
          state: "paused",
          id,
        },
      ]);
    } else if (parsed && parsed.provider == "youtube") {
      setItems([
        ...items,
        {
          videoId: parsed.id,
          state: "paused",
          id,
        },
      ]);
    } else {
      alert("couldn't parse link");
      return;
    }

    setInput("");
  };

  const play = (playable) => {
    setPlayIntent({
      ...playable,
      action: "play",
    });
  };

  const scrub = (to) => {
    setPlayIntent({
      action: "scrub",
      to: to,
    });
  };

  const pause = () => {
    setPlayIntent({
      ...playingNow,
      action: "pause",
    });
  };

  const addClip = (item, clipProps) => {
    setItems((items: Item[]) =>
      items.map((y) => {
        if (y.id == item.id) {
          const previousClips = y.clips || [];
          return {
            ...y,
            clips: [
              ...previousClips,
              {
                id: uuidv4(),
                title: "Clip",
                ...clipProps,
              },
            ].sort((a, b) => a.from - b.from),
          };
        }
        return y;
      })
    );
  };

  const deleteItem = (item) => {
    setItems((items) => items.filter((y) => y.id !== item.id));
  };

  const deleteClip = (item, clip) => {
    setItems((items: Item[]) =>
      items.map((y) => {
        if (y.id == item.id) {
          const previousClips = y.clips || [];
          return {
            ...y,
            clips: previousClips.filter((y) => y.id !== clip.id),
          };
        }
        return y;
      })
    );
  };

  const updateItem = (item, object) => {
    setItems((items) =>
      items.map((y) => {
        if (y.id == item.id) {
          return {
            ...y,
            ...object,
          };
        }
        return y;
      })
    );
  };

  const updateClip = (item, clip, object) => {
    setItems((items) =>
      items.map((y) => {
        if (y.id == item.id) {
          return {
            ...y,
            clips: y.clips
              .map((clipOld) => {
                if (clipOld.id == clip.id) {
                  return {
                    ...clipOld,
                    ...object,
                  };
                }
                return clipOld;
              })
              .sort((a, b) => a.from - b.from),
          };
        }
        return y;
      })
    );
  };

  const moveItem = useCallback((itemIndex, item, newIndex) => {
    console.log('itemIndex, item, newIndex: ', itemIndex, item, newIndex);
    let newIndexAdjusted = newIndex
    if(itemIndex < newIndex){
      newIndexAdjusted-=1
    }
    setItems(update(items, {
        $splice: [
            [itemIndex, 1],
            [newIndexAdjusted, 0, item],
        ],
    }));
}, [items]);

  const refreshMetaInfo = () => {
    console.log('items: ', items);
    for (const item of items) {
      if (item.trackId) {
        console.log('item.trackId: ', item.trackId);
        spotify.api.getTrack(item.trackId).then((track) => {
          console.log({
            duration: track.duration_ms,
            title: track.name,
            image: track.album.images[0].url,
            artist: track.artists[0].name,
          })
          setItems(items => (
            items.map(i => {
              if(i.trackId == item.trackId){
                return {
                  ...i,
                  metaInfo:{
                    duration: track.duration_ms,
                    title: track.name,
                    image: track.album.images[0].url,
                    artist: track.artists[0].name,
                  }
                }
              }
              return i
            })
          ))
          // onSetMetaInfo(item, {
          //   duration: track.duration_ms,
          //   title: track.name,
          //   image: track.album.images[0].url,
          //   artist: track.artists[0].name,
          // });
        });
      }
    }
  }

  const save = () => {
    if (user?.id != slapUserId) {
      console.log('slapUserId: ', slapUserId);
      return;
    }
    request("PUT", "fauna/collection/" + collectionId, {
      title,
      description,
      items: itemsForServer(items),
      user: user.id,
      visibility: visibility,
    }).then((res: any) => {
      console.log("saved")
    });
  }

  return (

    <div className="">
      <div
        style={{
        }}
      >
        <div className="flex">
          {/* <div className="w-40 h-40 bg-gray-600 rounded shadow"></div> */}
          {listInfo.coverImage &&
            <img src={listInfo.coverImage}
              className="w-60 h-60 bg-gray-600 rounded shadow-lg"></img>}
          <div className="pl-8 pt-4 flex flex-col justify-between">
            <div>
              <CleanInput
                className="text-3xl font-bold"
                placeholder="Untitled"
                value={listInfo.title}
                onChange={(value) => setTitle(value)}
              />
              <div className="flex items-center my-4  text-gray-900">
                <img className="rounded-full w-7 h-7 mr-1 shadow" src="https://s.gravatar.com/avatar/4579b299730ddc53e3d523ec1cd5482a?s=200" />
                 larskarbo
                </div>
              <CleanInput
                style={{
                  paddingBottom: 30,
                  fontSize: 16,
                }}
                placeholder="Description"
                value={listInfo.description}
                onChange={(value) => setDescription(value)}
              />
            </div>

            <div className="text-gray-500 text-sm">12 tracks - 2 hrs 46 mins</div>
          </div>
        </div>

        <div className="flex py-8">
          <button className="rounded items-center
          justify-center text-sm flex py-2 px-6 bg-blue-500 hover:bg-blue-600 font-medium text-white  transition duration-150">
            <AiOutlinePlayCircle className="mr-2" /> Listen
            </button>

          <button onClick={refreshMetaInfo} className="ml-4 rounded items-center
          justify-center text-sm flex py-2 px-6 bg-yellow-500 hover:bg-yellow-600 font-medium text-white  transition duration-150">
            <AiFillAccountBook className="mr-2" /> Refresh metainfo
            </button>

          <button onClick={save} className="ml-4 rounded items-center
          justify-center text-sm flex py-2 px-6 bg-yellow-500 hover:bg-yellow-600 font-medium text-white  transition duration-150">
            <AiFillSave className="mr-2" /> Save
            </button>
        </div>
        <div className="border-t border-gray-100"></div>
        {/* <div className="border-b border-gray-100">
          
        </div> */}
<div ref={drop}>
          {items.map((item, i) => (
            <SlapItem moveItem={moveItem} key={i} item={item} i={i} dragging={dragging} setDragging={setDragging} />
          ))}
</div>




        <div className="p-80"></div>
        {loaded && (
          <div>
            <div
              style={{
              }}
            >
              {user?.id != slapUserId ? (
                <TText style={{ color: "red" }}>
                  You don't own this slap, so it won't be saved.
                </TText>
              ) : (
                  <VisibilitySwitcher
                    visibility={visibility}
                    setVisibility={setVisibility}
                  />
                )}

              <LinkShare
                link={"https://slapper.io/s/" + collectionId}
              />
              {!spotify.credentials && items.find((i) => i.trackId) && (
                <div
                  style={{
                    border: "1px solid black",
                    width: "fit-content",
                    padding: 10,
                  }}
                >
                  <TText>Connect with spotify to play this Slap</TText>
                  <Authorize spotify={spotify} />
                </div>
              )}

              {/* 
              {items.map((item, i) => (
                <SlapItem
                  item={item}
                  duration={item.metaInfo?.duration}
                  title={item.metaInfo?.title}
                  text={item.text}
                  key={item.videoId || item.trackId}
                  playingNow={playingNow}
                  onPause={() => pause()}
                  onPlay={play}
                  disabled={item.trackId && !spotify.credentials}
                  onScrub={scrub}
                  onSetSegment={(segment) => {
                    updateItem(item, {
                      from: segment.from,
                      to: segment.to,
                    });
                  }}
                  onSetText={(text) => updateItem(item, { text: text })}
                  onSetTitle={(title) =>
                    updateItem(item, { title: title })
                  }
                  onDeleteClip={(clip) => deleteClip(item, clip)}
                  onDeleteItem={() => deleteItem(item)}
                  onUpdateClip={(clip, whatever) =>
                    updateClip(item, clip, whatever)
                  }
                />
              ))} */}

              {user?.plan == "premium" || items.length < 5 ? (
                <>
                  <KeyboardEventHandler
                    handleKeys={["Enter"]}
                    onKeyEvent={go}
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
                        type="text"
                        style={{
                          ...sansSerif,
                          outline: "none",
                          fontSize: input.length ? 10 : 15,
                          width: "100%",
                          padding: "10px 20px",
                          borderWidth: 1,
                          height: 45,
                          borderColor: DEFAULT_BLACK,
                        }}
                        placeholder="Paste youtube or spotify link here"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                      />

                      {input.length > 0 && (
                        <div
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
                          <TText>Press enter to add</TText>
                        </div>
                      )}
                    </div>
                  </KeyboardEventHandler>
                  <TText
                    style={{
                      fontSize: 10,
                      fontStyle: "italic",
                    }}
                  >
                    ↑ Examples: ↑
                          </TText>
                  <TText
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
                          "https://www.youtube.com/watch?v=Ob7vObnFUJc"
                        );
                        myInputRef.current.focus();
                      }}
                    >
                      https://www.youtube.com/watch?v=Ob7vObnFUJc
                            </a>
                  </TText>
                  <TText
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
                          "spotify:track:698ItKASDavgwZ3WjaWjtz"
                        );
                        myInputRef.current.focus();
                      }}
                    >
                      spotify:track:698ItKASDavgwZ3WjaWjtz
                            </a>
                  </TText>
                  <TText
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
                          "https://open.spotify.com/track/698ItKASDavgwZ3WjaWjtz?si=PAypRLZDRyyS9-AUP_P6oQ"
                        );
                        myInputRef.current.focus();
                      }}
                    >
                      https://open.spotify.com/track/698It...RLZDRyyS9-AUP_P6oQ
                            </a>
                  </TText>
                </>
              ) : (
                  <div
                    style={{
                      padding: 20,
                      backgroundColor: "#FFDCA8",
                    }}
                  >
                    <TText
                      style={{
                        fontWeight: 700,
                      }}
                    >
                      5 songs per slap is the maximum for the Standard
                      plan
                          </TText>
                    <TText
                      style={{
                        marginBottom: 20,
                      }}
                    >
                      Upgrade to premium to get the full Slapper
                      experience, and support the development of the app!
                          </TText>
                    <Link to="/s/profile">
                      <BButton variant="primary">
                        Upgrade to premium
                            </BButton>
                    </Link>
                  </div>
                )}
              {/* <FeedbackFish
                    projectId="84e4f29205e0f4"
                    userId={user?.email}
                  >
                    <BButton style={{ marginTop: 100, marginBottom: 100 }}>
                      Send instant feedback ⚡
                        </BButton>
                  </FeedbackFish> */}
            </div>
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
        <TText
          style={{
            fontSize: 12,
          }}
        >
          This slap is public.{" "}
          <a onClick={() => setVisibility("unlisted")} href="#">
            Change to "unlisted"
          </a>
        </TText>
      ) : (
          <TText
            style={{
              fontSize: 12,
            }}
          >
            This slap can only be accessed by link.{" "}
            <a onClick={() => setVisibility("public")} href="#">
              Change to "public"
          </a>
          </TText>
        )}
    </div>
  );
}
