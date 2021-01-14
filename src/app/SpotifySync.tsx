import React, { Component, useState } from "react";
import { FeedbackFish } from "@feedback-fish/react";
import { AiOutlineSync } from "react-icons/ai";
import { spotifyTrackToSlapperTrack } from "./utils/helpers";
import { useSlapData } from "./slapdata-context";
import { usePlayingNowState } from "./players/player-context";

const SpotifySync = ({ slapId }) => {
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const { spotify } = usePlayingNowState();

  const { slaps, addItem, setListInfo } = useSlapData();
  const ourSlap = slaps.find((s) => s.id == slapId);

  const startSync = async () => {
    setSyncInProgress(true);

    let spotifiesAddedToSlapper = 0;
    let slappersAddedToSpotify = 0;

    const spotifyPlaylist = await spotify.api.getPlaylist(
      ourSlap.spotifyLinked
    );

    const spotifyItems = spotifyPlaylist.tracks.items.map(({ track }) =>
      spotifyTrackToSlapperTrack(track)
    );

    for (const spotifyItem of spotifyItems) {
      if (ourSlap.items.find((i) => spotifyItem.trackId == i.trackId)) {
        // nothing to do
      } else {
        console.log("not: ", ourSlap.items, spotifyItem);
        addItem(slapId, spotifyItem);
        spotifiesAddedToSlapper++;
      }
    }

    for (const item of ourSlap.items) {
      if (item.type == "spotify") {
        if (
          spotifyItems.find(
            (spotifyItem) => spotifyItem.trackId == item.trackId
          )
        ) {
          // nothing to do
        } else {
          console.log("not: ", item);
          // addItem(slapId, spotifyItem)
          await spotify.api.addTracksToPlaylist(ourSlap.spotifyLinked, [
            "spotify:track:" + item.trackId,
          ]);
          slappersAddedToSpotify++;
        }
      }
    }

    setListInfo(slapId, {
      coverImage: spotifyPlaylist.images[0].url,
    });

    setSyncInProgress(false);
    setStats({
      spotifiesAddedToSlapper,
      slappersAddedToSpotify,
    });
  };

  return (
    <>
      <button
        onClick={() => {
          if(!spotify.me){
            alert("Please connect with spotify to sync")
            return
          }
          setShowModal(true)
        }}
        className={
          "ml-4 rounded items-center" +
          "justify-center text-sm flex py-2 px-6  font-medium text-white  transition duration-150 " +
          "bg-green-500 hover:bg-green-600"
        }
      >
        <AiOutlineSync className="mr-2" /> Sync with Spotify
      </button>
      {showModal && (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            // onClick={() => setShowModal(false)}
          >
            <div className="relative w-auto my-6 mx-auto max-w-md">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  {/* <h3 className="text-3xl text-center font-semibold">
                    Spotify Sync
                </h3> */}
                  {!syncInProgress && (
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  )}
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  {syncInProgress ? (
                    <>
                      <p className="my-4 text-gray-600 text-lg leading-relaxed">
                        Syncing...{" "}
                        <span className="animate-pulse inline-flex h-8 w-8 rounded-full bg-purple-400 opacity-75"></span>
                      </p>
                    </>
                  ) : (
                    <>
                      {stats ? (
                        <>
                          <p className="my-4 text-gray-600 text-lg leading-relaxed">
                            Sync completed.
                          </p>
                          <ul className="list-disc list-inside">
                            <li>Songs added from Spotify to Slapper: {stats.spotifiesAddedToSlapper}</li>
                            <li>Songs added from Slapper to Spotify: {stats.slappersAddedToSpotify}</li>
                          </ul>
                        </>
                      ) : (
                        <>
                          <p className="my-4 text-gray-600 text-lg leading-relaxed">
                            Sync the Slap with the connected Spotify playlist.
                          </p>
                          <ul className="list-disc list-inside">
                            <li>It won't delete any songs.</li>
                            <li>It won't reorder any songs.</li>
                            <li className="text-green-700">
                              It will add new songs (two ways).
                            </li>
                            <li className="text-green-700">
                              It will preserve annotations and clips.
                            </li>
                            <li className="text-green-700">
                              It will skip any youtube songs.
                            </li>
                            <li className="text-green-700">
                              It will get playlist image from Spotify.
                            </li>
                          </ul>
                        </>
                      )}
                    </>
                  )}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  {!syncInProgress && !stats && (
                    <button
                      className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      style={{ transition: "all .15s ease" }}
                      onClick={() => startSync()}
                    >
                      Start sync
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  );
};

export default SpotifySync;
