import React, { useEffect, useRef, useState } from "react";
import { request } from "../utils/request";
import { Link } from 'gatsby';

import { Redirect } from '@reach/router';

export default function Home({ user }) {

  return (
    <div>
      
      <h1 className="text-4xl font-black mb-12">Home</h1>

      Hi!
    </div>
  );
}

export const Box = ({ slap }) => (
  <div className="mr-10 w-40 mb-4">
    {/* <div className="w-40 h-40 bg-gray-700 rounded shadow"></div> */}
    <Link to={slap.link}>
      <img className="w-40 h-40  rounded shadow" src={slap.coverImage || "https://via.placeholder.com/150"}></img>
      <div className="pt-2 font-medium text-sm overflow-hidden whitespace-nowrap">{slap.title}</div>
    </Link>
  </div>
);
