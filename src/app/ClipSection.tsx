import React, { useState, useEffect, useRef, useCallback } from "react";
import { useClip } from "./clip-context";
import { IoPlaySharp, IoRepeat } from 'react-icons/io5';
import { AiFillCloseCircle } from "react-icons/ai";
import { usePlayingNowState } from "./players/player-context";
import { useSlapData } from "./slapdata-context";



export default function ClipSection({ }) {
  const { clipNow, defocus } = useClip()
  const { editClip } = useSlapData()

  const { playItem, playClip } = usePlayingNowState()

  return (
    <>
      {clipNow &&

        <div className="flex w-full py-2 px-4 border-t border-gray-500 bg-gray-100">
          <div>
            <div>

              Clip: <div className={"px-2 text mt-1 mr-1 inline-flex items-center py-1 font-medium rounded  "}>
                <input value={clipNow.clip.title} className="font-bold border rounded-sm py-1 px-3 "
                  onChange={e => editClip(clipNow.slap.id, clipNow.item.id, clipNow.clip.id, {
                    title: e.target.value,
                  })}
                />
                <button onClick={() => { playClip(clipNow.item, clipNow.clip) }}
                className={"p-1 ml-2 flex-shrink-0 rounded-full bg-transparent transition-colors duration-150 hover:bg-gray-300"
                }>
                  <IoPlaySharp  />
                </button>
                <span className="opacity-50 ml-1">({Math.round((clipNow.clip.to - clipNow.clip.from) / 1000)}s)</span>
                <button onClick={() => { 
                  alert("Hey! I haven't had time to implement the repeat function in this new version. Is it useful for you? Send me a message on twitter (@larskarbo) or mail@larskarbo.no and I will fix it.")
                 }}
                className={"p-1 ml-2 flex-shrink-0 border border-gray-300 rounded-full bg-transparent transition-colors duration-150 hover:bg-gray-300"
                }>
                  <IoRepeat  />
                </button>
              </div>
            </div>
            <div className="text-xs mt-1">
              from <span className="font-bold"> {clipNow.item.metaInfo.title} </span>
              <button onClick={() => { playItem(clipNow.item) }} className={"p-0.5 flex-shrink-0 rounded-full bg-transparent transition-colors duration-150 hover:bg-gray-300"
              }>
                <IoPlaySharp size={10} />
              </button>
            </div>
          </div>





          <div className="flex-grow"></div>
          <button onClick={() => { defocus() }} className={"p-1 flex-shrink-0 rounded-full bg-transparent transition-colors duration-150 hover:bg-gray-300"
          }>
            <AiFillCloseCircle />
          </button>
        </div>
      }
    </>
  )
}
