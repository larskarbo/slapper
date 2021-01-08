import React, { useEffect, useRef, useState } from "react";
import { request } from "../utils/request";
import { Link } from 'gatsby';

export default function Home({ user }) {
  const [slaps, setSlaps] = useState([])
  console.log('slaps: ', slaps);
  useEffect(() => {
    request("GET", "fauna/myCollections").then((res: any) => {
      console.log('res: ', res);
      setSlaps(
        res.slice(0, 4).map((r) => ({
          ...r.data,
          id: r.ref["@ref"].id,
        }))
      );
      // setActiveSlap(279439751993360901);
    }).catch((error) => {
      console["error"]('error: ', error);

    })

  }, []);

  return (
    <div>
      <h1 className="text-4xl font-black mb-12">Home</h1>
      <h2 className="text-xl font-medium mb-4">My slaps</h2>
      <div className="flex flex-row">
        {slaps.map(slap => (
          <Box slap={slap} />
        ))}
      </div>
    </div>
  );
}

export const Box = ({ slap }) => (
  <div className="mr-10 w-40 mb-4">
    {/* <div className="w-40 h-40 bg-gray-700 rounded shadow"></div> */}
    <Link to={slap.link}>
      <img className="w-40 h-40  rounded shadow" src={slap.img || "https://via.placeholder.com/150"}></img>
      <div className="pt-2 font-medium text-sm overflow-hidden whitespace-nowrap">{slap.title}</div>
    </Link>
  </div>
);
