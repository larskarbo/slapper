import React, { useState, useEffect, useRef, useCallback } from "react";
// import KeyboardEventHandler from "react-keyboard-event-handler";
import { request } from "./utils/request";

import { SlapItem } from "./SlapItem";
import Authorize from "./Authorize";
import { CleanInput, DEFAULT_BLACK } from "./utils/font";
import { useDrop } from "react-dnd";
import { Link, navigate } from "gatsby";
import {
  AiFillAccountBook,
  AiFillDelete,
  AiFillSave,
} from "react-icons/ai";
import { usePlayingNowState } from "./players/player-context";
import { useUser } from "./user-context";
import { spotifyTrackToSlapperTrack } from "./utils/helpers";
import { useSlapData } from "./slapdata-context";
import SpotifySync from "./SpotifySync";
import Share from "./Share";
import Adder from "./Adder";

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

export default function Croaker({ slapId, listType }) {

  const { user } = useUser();
  const [_, drop] = useDrop({
    accept: "nothing",
    drop: (asdf) => {

    },
  });

  const { slaps, dirtySlaps, slapsLoaded, saveSlap, deleteItem, setReloadSlapsUpdateInt, setListInfo, moveItem, editItemText, deleteSlap, addClip, setMetaInfo } = useSlapData()
  const ourSlap = slaps.find(s => s.id == slapId)
  const dirty = dirtySlaps[ourSlap?.id]
  const { spotify } = usePlayingNowState();

  const [spotifyItems, setSpotifyItems] = useState([])
  const items = ourSlap?.items || spotifyItems || []
  const [loaded, setLoaded] = useState(!!ourSlap);

  const [spotifyListInfo, setSpotifyListInfo] = useState({
    title: "",
    description: "",
    coverImage: null,
  });
  const [dragging, setDragging] = useState(null);
  const [visibility, setVisibility] = useState("unlisted");

  useEffect(() => {
    if (!slapId) {
      return;
    }

    if (listType == "spotify") {
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
    }
  }, [slapId]);

  useEffect(() => {
    if (!slapId) {
      return;
    }

    if (listType == "slapper" && slapsLoaded) {
      // check if you need to reload metadata
      if (ourSlap) {

        setLoaded(true)
        if (ourSlap?.items.some(i => i.type == "spotify" && !i.metaInfo.image)) {

          refreshMetaInfo()
        }

      } else {
        //TODO REFACTOR AROUND HERE
        request("GET", "fauna/collection/" + slapId).then((res: any) => {
          setSpotifyItems(
            res.data.items.map(item => {
              if (item.videoId) {
                return (
                  {
                    ...item,
                    type: "youtube"
                  }
                )
              } else if (item.trackId) {
                return (
                  {
                    ...item,
                    type: "spotify"
                  }
                )
              }
            })
          );

          setLoaded(true)


          setSpotifyListInfo({
            description: res.data.description,
            title: res.data.title,
            coverImage: res.data.coverImage,
          });
        }).catch((error) => {
          console["error"]('error: ', error);

        })
      }




    }
  }, [slapId, slapsLoaded]);

  const importToSlap = () => {
    request("POST", "fauna/collection", {
      title: spotifyListInfo.title,
      description: spotifyListInfo.description,
      coverImage: spotifyListInfo.coverImage,
      items: spotifyItems,
      user: user.id,
      visibility: visibility,
      spotifyLinked: slapId,
    }).then((res: any) => {
      setReloadSlapsUpdateInt(Math.random())
      navigate("/app/slap/" + res.ref["@ref"].id)
    });

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
                readOnly={listType == "spotify"}
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
                readOnly={listType == "spotify"}
                placeholder="Description"
                value={ourSlap?.description || spotifyListInfo.description}
                onChange={(value) =>
                  setListInfo(slapId, { description: value })
                }
              />

              {/* {(slapUserId && user?.id == slapUserId) && (
                <VisibilitySwitcher
                  visibility={visibility}
                  setVisibility={setVisibility}
                />
              )} */}
            </div>

            <div className="text-gray-500 text-sm">
              {items.length} tracks - {msToHM(items.reduce((duration, item) => duration + item.metaInfo.duration, 0))}
            </div>
          </div>
        </div>

        <div className="flex py-8">
          {listType == "spotify" && (
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

          {listType == "slapper" && (
            <>
              {ourSlap && <button
                onClick={() => saveSlap(slapId)}
                className={"ml-4 rounded items-center " +
                  "justify-center text-sm flex py-2 px-6  font-medium text-white  transition duration-150 "
                  + (dirty ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-500")}
              >
                <AiFillSave className="mr-2" /> Save
          </button>}

              <Share slapId={slapId} />

              {ourSlap?.spotifyLinked &&
                <SpotifySync slapId={slapId} />

              }



              {ourSlap && <button
                onClick={() => {
                  if (window.confirm("Are you sure?")) {
                    deleteSlap(slapId)
                  }
                }}
                className="ml-4 rounded items-center
          justify-center text-sm flex py-2 px-6 bg-red-500 hover:bg-red-600 font-medium text-white  transition duration-150"
              >
                <AiFillDelete className="mr-2" /> Delete
          </button>}
            </>
          )}

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
                    onDelete={() => deleteItem(slapId, i)}
                    listType={listType}
                    moveItem={(...props) => moveItem(slapId, ...props)}
                    addClip={(...props) => addClip(slapId, i, ...props)}
                    key={i}
                    slapId={slapId}
                    readOnly={!ourSlap}
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
                    onDelete={() => deleteItem(slapId, i)}
                    listType={listType}
                    readOnly={!ourSlap}
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

        {ourSlap &&
          <Adder slapId={slapId} allowedToAdd={user?.plan == "premium" || items.length < 5} />
        }
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