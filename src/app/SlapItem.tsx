import React, { useState, useRef } from "react";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { IoPause, IoPlay } from "react-icons/io5";
import { playItem, usePlayingNowDispatch, usePlayingNowState } from "./players/player-context";
import { useDrag, useDrop } from 'react-dnd'
import { useSpotifyDispatch } from './players/spotify-context';

export const SlapItem = ({
  item,
  i,
  dragging,
  setDragging,
  moveItem
}) => {
  const playingNow = usePlayingNowState()
  console.log('playingNow: ', playingNow);
  const dispatch = usePlayingNowDispatch()

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
        console.log('hoverIndex: ',);
        shouldBe = hoverIndex + 1
      }
      if (shouldBe != dragging) {
        draggingItem.dropTo = shouldBe
        setDragging(shouldBe)
      }
    },
    drop: (draggingItem) => {
      console.log('item: ', draggingItem);
      moveItem(draggingItem.index, draggingItem.item, draggingItem.dropTo)
      setDragging(null)
    }
  });

  const ref = useRef()

  drag(drop(ref));
  // console.log('playingNow: ', playingNow);
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
            playItem(dispatch, item)
          }}
          className="w-full absolute left-0 top-0 right-0 bottom-0 bg-black bg-opacity-25 flex items-center justify-center
                group-hover:opacity-100 opacity-0 transition-opacity duration-150
              ">
          {mePlaying ?
            <IoPause color="white" size={20} /> :
            <IoPlay color="white" size={20} />}
        </button>
      </div>
      <div className="font-light text-gray-800 text-sm w-80 whitespace-nowrap  pr-4">
        <div className={"font-medium overflow-ellipsis overflow-hidden " + (mePlayingFocus && "text-red-500")}>{item.metaInfo.title}</div>
        <div>{item.metaInfo.artist}</div>
      </div>
      <div className=" w-40  overflow-x-hidden pr-4 py-1">
        {item.clips.map((clip, i) => (
          <button key={i} className="px-4 mb-2 inline-flex items-center py-1 bg-gray-600 font-medium text-white text-sm rounded">
            <AiOutlinePlayCircle className="mr-2 flex-shrink-0" />
            {clip.title}
            <span className="opacity-50 ml-1"> ({Math.round((clip.to - clip.from) / 1000)}s)</span>
          </button>
        ))}
      </div>
      <div className=" w-60  overflow-x-hidden pr-4 py-1">
        <div className="text-sm">
          mitt navn er ARE
              </div>
      </div>
    </div>
  );
};