import React, { useEffect, useState } from "react";

import { request } from "./utils/request";
import { TText } from "./utils/font";
import { BButton } from "./comp/BButton";
import { Link } from 'gatsby';
import { useMatch } from "@reach/router"
import { useSlapData } from "./slapdata-context";

const Sidebar = ({ }) => {
  const { slaps, spotifyLists } = useSlapData()

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
      <NavLink title="My lists" to="/app/my-slaps" className="flex flex-row mb-2">
      </NavLink>
      <div className="overflow-y-scroll flex-grow">
        {slaps.map(slap => (
          <ListLink key={slap.id} to={"/app/slap/" + slap.id}>
            {slap.title}
          </ListLink>
        ))}
        <div className="border-t border-gray-500" />
        {spotifyLists.map(slap => (
          <ListLink key={slap.id} to={"/app/spotify/playlist/" + slap.id}>
            {slap.title}
          </ListLink>
        ))}

      </div>


      <div className="border-t border-gray-400 pt-4 pb-4">
        <NavLink title="AB-Repeater" to="/app/settings" className="flex flex-row mb-2">
        </NavLink>
        <NavLink title="Settings" to="/app/settings" className="flex flex-row mb-2">
        </NavLink>
      </div>
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
      <div className="pl-8 text-lg">{title}</div>
    </Link>
  )
};
const ListLink = ({ ...props }) => {

  const match = useMatch(props.to);
  return (
    <Link
      {...props}
    >
      <div className={"text-sm py-2 font-light pl-10 " + (match && "text-blue-400")}>{props.children || "Untitled"}</div>
    </Link>
  )
};