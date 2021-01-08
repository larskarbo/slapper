import React, { useEffect, useRef, useState } from "react";
import { request } from "../utils/request";
import { Link } from 'gatsby';
import { useSpotify } from "../players/spotify-context";
import { Box } from "./Home"

export default function ({ user }) {
  const [slaps, setSlaps] = useState([])
  const spotify = useSpotify()
  useEffect(() => {
    spotify.api.getUserPlaylists(spotify.me.id).then((res:any) => {
        console.log('res: ', res);
        setSlaps(
          res.items.map((r) => ({
            ...r,
            title: r.name,
            img: r.images[0].url,
            link: "/app/spotify/playlist/" + r.id
          }))
        );
        // setActiveSlap(279439751993360901);
      }).catch((error) => {
        console["error"]('error: ', error);
  
      })
    // request("GET", "fauna/myCollections").then((res:any) => {
    //   console.log('res: ', res);
    //   setSlaps(
    //     res.slice(0,4).map((r) => ({
    //       ...r.data,
    //       id: r.ref["@ref"].id,
    //     }))
    //   );
    //   // setActiveSlap(279439751993360901);
    // }).catch((error) => {
    //   console["error"]('error: ', error);

    // })

  }, []);

  return (
    <div>
      <h1 className="text-4xl font-black mb-12">Home</h1>
      <h2 className="text-xl font-medium mb-4">My Spotify Playlists</h2>
      <div className="flex flex-row flex-wrap">
        {slaps.map(slap => (
          <Box slap={slap} />
        ))}
      </div>
    </div>
  );
}

