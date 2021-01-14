import React, { Component, useState } from "react";
import { FeedbackFish } from "@feedback-fish/react";
import { AiOutlineSync } from "react-icons/ai";
import { spotifyTrackToSlapperTrack } from "./utils/helpers";
import { useSlapData } from "./slapdata-context";
import { usePlayingNowState } from "./players/player-context";
import { IoLink } from "react-icons/io5";

const Share = ({ slapId }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setShowModal(true)
        }}
        className={
          "ml-4 rounded items-center " +
          "justify-center text-sm flex py-2 px-6  font-medium text-white  transition duration-150 " +
          "bg-gray-500 hover:bg-gray-600"
        }
      >
        <IoLink className="mr-2" /> Share
      </button>
      {showModal && (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          // onClick={() => setShowModal(false)}
          >
            <div className="relative w-full my-6 mx-auto max-w-md">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-3xl text-center font-semibold">
                    Share URL
                </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                      </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <>
                  <p className="text-sm mb-4 text-gray-700">Anyone with this link will be able to access your slap:</p>
                    <input
                      id="link"
                      type="text"
                      tabindex="1"
                      name="link"
                      value={"https://slapper.io/app/slap/" + slapId}
                      className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out
                border border-gray-300 rounded-md appearance-none focus:outline-none
                focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    />
                  </>
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

export default Share;
