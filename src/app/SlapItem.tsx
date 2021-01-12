import React, { useState, useRef } from "react";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { IoPause, IoPlay } from "react-icons/io5";
import { HiDotsVertical } from "react-icons/hi";
import { playItem, usePlayingNowDispatch, usePlayingNowState } from "./players/player-context";
import { useDrag, useDrop } from 'react-dnd'
import { useSpotifyDispatch } from './players/spotify-context';
import { useClip } from "./clip-context";
import useClickOutside from 'use-click-outside';

export const SlapItem = ({
  item,
  i,
  dragging,
  setDragging,
  moveItem,
  onSetText,
  addClip,
  slapId
}) => {
  const { playingNow, playItem, pause } = usePlayingNowState()
  
  const { focusClip, clipNow, defocus } = useClip()

  const mePlayingFocus = playingNow.item && playingNow.item?.trackId == item.trackId
  const mePlaying = mePlayingFocus && playingNow.state == "playing"
  const [collectedProps, drag] = useDrag({
    item: { item, index: i, type: "slapItem" }
  })

  const [, drop] = useDrop({
    accept: "slapItem",
    hover(draggingItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggingItem.index;
      const hoverIndex = i;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      //   return;
      // }
      // // Dragging upwards
      let shouldBe = hoverIndex
      if (hoverClientY > hoverMiddleY) {
        shouldBe = hoverIndex + 1
      }
      if (shouldBe != dragging) {
        draggingItem.dropTo = shouldBe
        setDragging(shouldBe)
      }
    },
    drop: (draggingItem) => {
      
      moveItem(draggingItem.index, draggingItem.item, draggingItem.dropTo)
      setDragging(null)
    }
  });

  const ref = useRef()

  drag(drop(ref));
  // 
  return (
    <div ref={ref}
      className={"flex py-2 items-center border-b border-gray-100 px-4"
        + "bg-white hover:bg-gray-50 transition-colors duration-100 group"

      }

      style={{
        ...(dragging == i ? {
          borderTop: "2px solid blue"
        } : {
            borderTop: "2px solid transparent"
          })
      }}>
      <div className="mr-6 text-sm text-gray-400 font-thin w-2 text-center">{i + 1}</div>
      <div className="h-10 w-10 mr-4 rounded shadow relative overflow-hidden">
        <img className="" src={item.metaInfo.image} />
        <button
          onClick={() => {
            { mePlaying ? pause() : playItem(item) }
          }}
          className="w-full absolute left-0 top-0 right-0 bottom-0 bg-black bg-opacity-25 flex items-center justify-center
                group-hover:opacity-100 opacity-0 transition-opacity duration-150
              ">
          {mePlaying ?
            <IoPause color="white" size={20} /> :
            <IoPlay color="white" size={20} />}
        </button>
      </div>
      <div className="font-light text-gray-800 text-sm w-40 whitespace-nowrap  pr-4">
        <div className={"font-medium overflow-ellipsis overflow-hidden " + (mePlayingFocus && "text-red-500")}>{item.metaInfo.title}</div>
        <div>{item.metaInfo.artist}</div>
      </div>
      <div className=" w-80 -py-2 -mt-1  overflow-x-hidden pr-4 ">
        {item.clips.map((clip, i) => {
          const active = clipNow?.clip.id == clip.id
          return(
          <button
            onClick={() => active ? defocus() : focusClip(clip.id, item.id, slapId)}
            key={i} className={"px-2 text-xs mt-1 mr-1 inline-flex items-center py-1 font-medium text-white rounded " + (active ? "bg-red-500 " : "bg-gray-500 ")}>
            {clip.title}
            <span className="opacity-50 ml-1"> ({Math.round((clip.to - clip.from) / 1000)}s)</span>
          </button>
        )})}
        <button
            onClick={() => addClip({from:10000, to:20000})}
            key={i} className="px-2 text-xs mb-2 inline-flex items-center py-1 bg-gray-300 hover:bg-gray-400 font-medium text-white rounded">
            +
          </button>
      </div>
      <div className=" w-60  overflow-x-hidden pr-4 py-1 h-full">
        <textarea value={item.text || ""} onChange={e => onSetText(e.target.value)} className="text-sm border w-full h-full">
        </textarea>
      </div>
      <DropdownMenu options={[
        { name: "Remove", onClick: () => { } }
      ]} />
    </div>
  );
};



const DropdownMenu = ({ options }) => {

  const [contextMenu, setContextMenu] = useState(false);
  const ref = useRef();
  useClickOutside(ref, () => setContextMenu(false));

  return (
    <div className="relative">
      <button
        ref={ref}
        onMouseDown={() => {
          setContextMenu(!contextMenu)
        }}
        className={"border border-transparent hover:border-gray-400 rounded-sm p-1 m-auto " + (contextMenu && "bg-gray-700")}>
        <HiDotsVertical className={contextMenu ? "text-white" : "text-gray-500"} />
      </button>
      {
        contextMenu &&

        <div className="origin-top-right absolute right-8 top-0 mt-2 w-40 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <div className="py-1">
            {options.map(o => (
              <button key={o.name}
                onClick={o.onClick}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">
                {o.name}
              </button>

            ))}
          </div>
        </div>
      }
    </div>
  )
}