import React, { useEffect, useRef, useState } from "react";
import { request } from "../utils/request";
import { Link } from 'gatsby';
import { useSpotify } from "../players/spotify-context";

export default function Settings({ user }) {
  const spotify = useSpotify()
  console.log('spotify: ', spotify);
  spotify.api.getMe().then(asdf => {
    console.log('asdf: ', asdf);

  }).catch(ds => {
    console.log('ds: ', ds);

  })

  return (
    <div>
      <h1 className="text-4xl font-black mb-12">Settings</h1>
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

      {/* <div className="flex flex-row">
        {slaps.map(slap => (
          <Box slap={slap} />
        ))}
      </div> */}
    </div>
  );
}