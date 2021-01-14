import React, { useEffect, useRef, useState } from "react";
import { MdComputer, MdDevices, MdPhone, MdPhoneIphone } from "react-icons/md";
import { usePlayingNowState } from "./players/player-context";
import { useSpotify } from "./players/spotify-context";

export default function DeviceSelector({ }) {
  const [contextMenu, setContextMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const ref = useRef();
  const { spotify } = usePlayingNowState();

  useEffect(() => {
    if (contextMenu) {
      setLoading(true)
      console.log('contextMenuShit: ', spotify);
      spotify.pollDevices().then(devices => {
        setDevices(devices)
        setLoading(false)
      })
    }
  }, [contextMenu])


  useEffect(() => {
    spotify.mustOpenMenu = () => {
      console.log("hei")
      setContextMenu(true)
      spotify.mustOpenDevices = false
    }
  }, [spotify])


  const activeDevice = devices.find(d => d.is_active)

  return (
    <>
      {contextMenu &&
        <div
          onClick={() => setContextMenu(false)}
          className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40"
        ></div>
      }
      <div className="w-50 px-10 relative">
        <button
          ref={ref}
          onClick={() => {
            setContextMenu(!contextMenu);
          }}
          className="rounded items-center
          justify-center text-sm py-2 pl-2 pr-2 font-light border border-gray-400  hover:shadow-md  transition-shadow duration-150"
        >
          <MdDevices className="inline mx-3" />
          {/* {activeDevice && (<span>
          Playing on Spotify (
          <span className="font-bold">{activeDevice.name}</span>
        </span>)} */}

        </button>
        {contextMenu && (
          <div
            className="origin-top-right z-10 overflow-y-scroll absolute right-4 border-2 py-8 bottom-12 border-gray-700 mt-2 w-80 h-96 rounded-md  shadow-xl 
		  bg-white"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="font-bold text-center pb-4 ">Connect to a Spotify device</div>

            {loading ?
              "" :
              <>
                {devices.map((device) => (
                  <button
                    onClick={async () => {
                      await spotify.api.transferMyPlayback([device.id]);
                      setContextMenu(false)
                      spotify.pollDevices()
                      setTimeout(() => {
                        spotify.pollDevices()
                      }, 500)
                    }}
                    key={device.id}
                    className={
                      "py-1 px-2 items-center text-left bg-white hover:bg-gray-100 transition-colors duration-150 w-full flex " +
                      (device.is_active && "text-red-400")
                    }
                  >
                    <div className="p-6 ">
                      {device.type == "Computer" ? 
                      <MdComputer size={30} />
                      :
                      <MdPhoneIphone size={30} />
                      }
                    </div>
                    <div>
                      <div className="text font-bold">{device.name}</div>
                      <div
                        className={
                          "font-light text-sm " +
                          (device.is_active ? "text-red-400" : "text-gray-700")
                        }
                      >
                        Spotify connect
                </div>
                    </div>
                  </button>
                ))}
              </>
            }
          </div>
        )}
      </div>
    </>
  );
}

const DropdownMenu = ({ options }) => {
  return <></>;
};
