import React, { useEffect, useState } from "react";

import { Link } from 'gatsby';
import { useMatch } from "@reach/router"
import { useSlapData } from "./slapdata-context";
import { useUser } from "./user-context";
import { FaPlusCircle, FaSpotify } from "react-icons/fa";
import { FeedbackFish } from "@feedback-fish/react";

const Sidebar = ({ }) => {
  const { slaps, dirtySlaps, spotifyLists, newSlap } = useSlapData()

  const { isAuthenticated, user } = useUser()


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
      <div className="my-8 text-xl font-bold px-4">Slapper
      {user?.plan == "premium" &&
          <span
            className={"px-1 ml-2 bg-yellow-500 text-xs inline-flex items-center py-1 font-medium text-white rounded "}>
            Premium
          </span>
        }
      </div>

      <NavLink title="Home" to="/app" className="flex flex-row mb-2" activeClassName="font-bold">
      </NavLink>
      {/* <NavLink title="Explore" to="/app/explore" className="flex flex-row mb-2">
      </NavLink> */}

      {isAuthenticated ?
        <>
          <NavLink title="My lists" to="/app/my-slaps" className="flex flex-row mb-2">
          </NavLink>
          <div className="overflow-y-scroll flex-grow border-t border-b border-gray-400">

            {slaps.filter(slap => slap.spotifyLinked).length > 0 && <>
              <div className="pl-6 text-xs uppercase pt-4 font-bold text-gray-700">Slapper (🔄 Spotify)</div>
              <div className="py-2 my-1 bg-gray-100">

                {slaps.filter(slap => slap.spotifyLinked).map(slap => (
                  <ListLink key={slap.id} to={"/app/slap/" + slap.id}>
                    {slap.title || "Untitled"}{dirtySlaps[slap.id] && "*"}
                  </ListLink>

                ))}
              </div>
            </>}


            <div className="pl-6 text-xs uppercase pt-4 font-bold text-gray-700">Slapper Lists</div>
            <div className="py-2 my-1 bg-gray-100">

              {slaps.filter(slap => !slap.spotifyLinked).map(slap => (
                <ListLink key={slap.id} to={"/app/slap/" + slap.id}>
                  {slap.title || "Untitled"}{dirtySlaps[slap.id] && "*"}
                </ListLink>
              ))}

            </div>
            <button
              // {...props}
              onClick={newSlap}
              className="  mx-4 mt-2   w-full text-left"
            >
              <div className={"text-sm py-2 font-light px-5 bg-gray-100 rounded  border transition-colors duration-150 hover:bg-gray-200 inline-flex items-center "}><FaPlusCircle className="mr-2" /> New slapper list</div>
            </button>
            {spotifyLists.length > 0 && <>
              <div className="pl-6 text-xs uppercase pt-4 font-bold text-gray-700">Spotify Playlists</div>
              <div className="py-2 my-1 bg-gray-100">
                {spotifyLists
                .filter((spotifyList) => {
                  if (slaps.find(s => s.spotifyLinked == spotifyList.id)) {
                    return false
                  }
                  return true
                })
                .map(slap => (
                  <ListLink key={slap.id} to={"/app/spotify/playlist/" + slap.id}>
                    {slap.title}
                  </ListLink>
                ))}
              </div>
            </>}

          </div>
        </>
        : <div className=" flex-grow"></div>}


      {isAuthenticated ?
        <div className=" pt-4 pb-4">
          <FeedbackFish projectId="84e4f29205e0f4" userId={user?.email}>
            <NavLink title="Feedback 📬" to="/app/feedback" className="flex flex-row mb-2">
            </NavLink>
          </FeedbackFish>

          <NavLink title="Settings" to="/app/settings" className="flex flex-row mb-2">
          </NavLink>
        </div>
        :
        <div className="border-t border-gray-400 pt-4 pb-4">
          <FeedbackFish projectId="84e4f29205e0f4" userId={user?.email}>
            <NavLink title="Feedback 📬" to="/app/feedback" className="flex flex-row mb-2">
            </NavLink>
          </FeedbackFish>

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