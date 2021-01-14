import React, { useEffect, useRef, useState } from "react";
import { request } from "../utils/request";
import { Link } from 'gatsby';
import { useSpotify } from "../players/spotify-context";
import { usePlayingNowState } from "../players/player-context";
import Profile from '../Profile';
import { useUser } from "../user-context";

export default function Settings({ }) {
  const { spotify } = usePlayingNowState()
  const { user } = useUser()

  return (
    <div className="pb-8">
      <h1 className="text-4xl font-black mb-12">Settings</h1>

      {user &&
        <Profile />
      }

      {user?.stripeCustomerId &&
        <form method="POST" action={"/.netlify/functions/money/customer-portal/" + user.stripeCustomerId}>
          <button className="button bg-yellow-400 hover:bg-yellow-500" type="submit">Update payment settings</button>
        </form>

      }

      <h2 className="text-xl font-medium mb-4">Integrations</h2>

      <h3 className="text-lg mb-4">Spotify</h3>

      {spotify.me ?
        <>
          <div>Logged in as {spotify.me.display_name} ({spotify.me.id})</div>
          <div>Spotify Plan: {spotify.me.product}</div>
          <button
            onClick={() => spotify.logOut()}
            className="focus:outline-none rounded items-center
          justify-center text-sm flex py-2 px-6 bg-green-600 hover:bg-green-700 font-medium text-white  transition duration-150">
            Unlink Spotify
            </button>
        </>

        :
        <>
          <div>Not logged in to Spotify</div>
          <button
            onClick={() => spotify.authorize()}
            className="focus:outline-none rounded items-center
          justify-center text-sm flex py-2 px-6 bg-green-600 hover:bg-green-700 font-medium text-white  transition duration-150">
            Link Spotify
            </button>
        </>
      }


      <hr className="mt-4" />

      <Link to="/app/logout">
        <button
          className="button bg-gray-500 hover:bg-gray-600 mt-8"
        >
          Log out
      </button>

      </Link>

      {/* <div className="flex flex-row">
        {slaps.map(slap => (
          <Box slap={slap} />
        ))}
      </div> */}
    </div>
  );
}