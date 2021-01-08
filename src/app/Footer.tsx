import React, { useEffect, useRef, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { IoPlaySkipForwardSharp, IoPlaySharp, IoPauseSharp } from "react-icons/io5";
import { MdDevices } from "react-icons/md";
import DeviceSelector from "./DeviceSelector";
// import IoPlaySkipForwardSharp from "../app/svg/play-skip-forward-sharp.inline.svg"
import { usePlayingNowState, usePlayingNowDispatch, play, pause } from './players/player-context';
import Timeline from './Timeline/Timeline';

const Footer = ({
}) => {
  const { playingNow, pause, play } = usePlayingNowState()
  //
  //
  return (
    <div className="flex h-full items-center">
      <div className="flex items-center h-full px-10">
        <button className="p-2 hover:bg-gray-300 rounded-full bg-white transition-colors">

        </button>
        <Button
          onClick={() => { }}
          disabled={true}
          icon={<IoPlaySkipForwardSharp size={20} className="rotate-180 transform" />}
        />
        {playingNow.state == "playing" ?
          <Button
            onClick={() => pause()}
            disabled={false}
            icon={<IoPauseSharp className="relative" style={{
            }} size={30} />}
          />
          :
          <Button
            onClick={() => play()}
            disabled={playingNow.state == "idle"}
            icon={<IoPlaySharp className="relative" style={{
              left: 3
            }} size={30} />}
          />

        }
        <Button
          onClick={() => { }}
          disabled={true}
          icon={<IoPlaySkipForwardSharp size={20} />}
        />
      </div>

      {playingNow.item &&
        <div className="flex ">
          <div className="h-10 w-10 mr-4 rounded shadow relative overflow-hidden">
            <img className="" src={playingNow.item.metaInfo.image} />
          </div>
          <div className="font-light text-gray-800 text-sm w-40  overflow-hidden pr-4">
            <div className={"font-medium whitespace-nowrap overflow-ellipsis "}>{playingNow.item.metaInfo.title}</div>
            <div className="whitespace-nowrap overflow-ellipsis">{playingNow.item.metaInfo.artist}</div>
          </div>
        </div>
      }

      <Timeline />

      <DeviceSelector />
    </div>
  );
};

const Button = ({ onClick, disabled, icon }) => {
  // const Comp ? 
  return (
    <button disabled={disabled} onClick={onClick} className={"p-2 rounded-full bg-white transition-colors duration-150 " +
      (disabled ? "text-gray-300 cursor-default" : "hover:bg-gray-300 ")
    }>
      {icon}
    </button>
  )
}

export default Footer;
