import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TText } from "./utils/font";
import { request } from "./utils/request";

const Browse = ({ }) => {
  const [slaps, setSlaps] = useState([])
  console.log('slaps: ', slaps);
  useEffect(() => {
    request("GET", "fauna/popularCollections").then((res:any) => {
      setSlaps(
        res.map((r) => ({
          ...r.data,
          id: r.ref["@ref"].id,
        }))
      );
      // setActiveSlap(279439751993360901);
    });
  }, []);

  const truncate = (input) => input.length > 403 ? `${input.substring(0, 403)}...` : input;

  return (
    <div
      style={{
        // marginBottom: 30,
        // backgroundColor: "#333333",
        paddingTop: 100,
      }}
    >
      <h1>Browse public slaps</h1>
      {slaps.map(s => (
        <Link  key={s.id} to={"/s/"+s.id}>

        <div style={{
          borderWidth: 1,
          height: 50,
          padding: 5,
          marginBottom: 5
        }}>
          <TText style={{
            fontWeight: 700
          }}>{s.title} ({s.items.length} songs, {s.items.reduce((acc,cur)=>acc + cur.clips?.length,0)} clips)</TText>
          <TText style={{
            fontWeight: 300,
          }}>{truncate(s.description) || " "}</TText>
        </div>
        </Link>
      ))}
    </div>
  );
};

export default Browse;
