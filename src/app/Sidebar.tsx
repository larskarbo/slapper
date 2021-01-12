import React, { useEffect, useState } from "react";

import { request } from "./utils/request";
import { TText } from "./utils/font";
import { BButton } from "./comp/BButton";
import { Link } from 'gatsby';
import { useMatch } from "@reach/router"
import { useSlapData } from "./slapdata-context";
import { useUser } from "./user-context";
import { FaSpotify } from "react-icons/fa";

const Sidebar = ({ }) => {
  const { slaps, dirtySlaps, spotifyLists } = useSlapData()

  const { isAuthenticated } = useUser()

  // return (
  //   <>
  //     <div className="">hey</div>
  //     <div className="flex-grow overflow-scroll">
  //       Hey2
  //       {spotifyLists.map(slap => (
  //         <ListLink key={slap.id} to={"/app/spotify/playlist/" + slap.id}>
  //           {slap.title}
  //         </ListLink>
  //       ))}
  //     </div>
  //     <div className="">hey3</div>
  //   </>
  // )

  return (
    <>
      <div className="my-8 text-xl font-bold px-4">Slapper</div>

      <NavLink title="Home" to="/app" className="flex flex-row mb-2" activeClassName="font-bold">
      </NavLink>
      <NavLink title="Explore" to="/app/explore" className="flex flex-row mb-2">
      </NavLink>

      {isAuthenticated ?
        <>
          <NavLink title="My lists" to="/app/my-slaps" className="flex flex-row mb-2">
          </NavLink>
          <div className="overflow-y-scroll flex-grow border-t border-b border-gray-400">
            <div className="pl-6 text-xs uppercase pt-4 font-bold text-gray-700">Slapper + Spotify</div>
            <div className="py-2 my-1 bg-gray-100">
              
              {slaps.filter(slap => slap.spotifyLinked).map(slap => (
                <ListLink key={slap.id} to={"/app/slap/" + slap.id}>
                  {slap.title}{dirtySlaps[slap.id] && "*"}
                </ListLink>
              ))}
            </div>


            <div className="pl-6 text-xs uppercase pt-4 font-bold text-gray-700">Slapper Lists</div>
            <div className="py-2 my-1 bg-gray-100">
              
              {slaps.filter(slap => !slap.spotifyLinked).map(slap => (
                <ListLink key={slap.id} to={"/app/slap/" + slap.id}>
                  {slap.title}{dirtySlaps[slap.id] && "*"}
                </ListLink>
              ))}
            </div>
            <div className="pl-6 text-xs uppercase pt-4 font-bold text-gray-700">Spotify Playlists</div>
            <div className="py-2 my-1 bg-gray-100">
            {spotifyLists.map(slap => (
              <ListLink key={slap.id} to={"/app/spotify/playlist/" + slap.id}>
                {slap.title}
              </ListLink>
            ))}
            </div>

          </div>
        </>
        : <div className=" flex-grow"></div>}


      {isAuthenticated ?
        <div className=" pt-4 pb-4">
          {/* <NavLink title="AB-Repeater" to="/app/settings" className="flex flex-row mb-2">
          </NavLink> */}
          <NavLink title="Settings" to="/app/settings" className="flex flex-row mb-2">
          </NavLink>
        </div>
        :
        <div className="border-t border-gray-400 pt-4 pb-4">
          {/* <NavLink title="AB-Repeater" to="/app/abrep" className="flex flex-row mb-2">
          </NavLink> */}
          <NavLink title="Login/sign up" to="/app/login" className="flex flex-row mb-2">
          </NavLink>
        </div>
      }
      {/* <NavLink to="/app/profile" className="flex flex-row mb-2">
        <div className="w-2 bg-red-400"></div>
        <div className="pl-8 text-lg font-bold">My profile</div>
      </NavLink> */}
    </>
  )
}

export default Sidebar

const NavLink = ({ title, ...props }) => {

  const match = useMatch(props.to);
  return (
    <Link
      {...props}
    >
      <div className={"w-2 " + (match && "bg-blue-300")}></div>
      <div className="pl-4 text-lg">{title}</div>
    </Link>
  )
};
const ListLink = ({ ...props }) => {

  const match = useMatch(props.to);
  return (
    <Link
      {...props}
    >
      <div className={"text-sm py-2 font-light pl-6 " + (match && "text-blue-400")}>{props.children || "Untitled"}</div>
    </Link>
  )
};