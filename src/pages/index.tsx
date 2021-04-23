import React from "react";

import { TText } from "../app/utils/font";
import annotate from "./annotate.png";
import segments from "./segments.png";
import songs from "./songs.png";
import { Link, navigate } from "gatsby";
import { Redirect } from "@reach/router";
import Helmet from "react-helmet";

export default function () {
  if (
    typeof window != "undefined" &&
    window.location.hash.includes("confirmation_token")
  ) {
    console.log(window.location.hash);
    navigate("/app/" + window.location.hash);
  }
  return (
    <div className="bg-yellow-50 min-h-screen flex justify-center">
      <div className="max-w-2xl pt-12">
        <div className="text-center uppercase font-light">Slapper.io</div>
        <Helmet>
          <title>Organize, annotate and play music - Slapper</title>
          <meta
            name="description"
            content="Organize and annotate songs and segments from Spotify, Youtube, Soundcloud in interactive, shareable documents"
          />
        </Helmet>
        <div
          style={{
            fontSize: 40,
            textAlign: "center",
            marginTop: 30,
            fontWeight: 300,
          }}
        >
          <span
            style={{
              fontWeight: 700,
            }}
          >
            Organize
          </span>
          ,
          <span
            style={{
              fontWeight: 700,
            }}
          >
            {" "}
            annotate
          </span>{" "}
          and
          <span
            style={{
              fontWeight: 700,
            }}
          >
            {" "}
            play{" "}
          </span>
          music
        </div>
        <div
          style={{
            fontSize: 20,
            textAlign: "center",
            marginTop: 10,
            marginBottom: 10,
            fontWeight: 200,
          }}
        >
          from Spotify and Youtube in the same list.
        </div>

        <GetStarted style={{ marginTop: 20 }}>Go to app</GetStarted>

        <video
          style={{
            width: "100%",
          }}
          className="my-6 shadow-xl"
          controls={false}
          muted
          loop
          autoPlay
        >
          <source
            src="https://res.cloudinary.com/dfzqjzusj/video/upload/vc_h265,w_700,c_limit/slapperland.mp4"
            type="video/mp4; codecs=hvc1"
          />
          <source
            src="https://res.cloudinary.com/dfzqjzusj/video/upload/vc_vp9,w_700,c_limit/slapperland.webm"
            type="video/webm; codecs=vp9"
          />
          <source
            src="https://res.cloudinary.com/dfzqjzusj/video/upload/vc_auto,w_700,c_limit/slapperland.mp4"
            type="video/mp4"
          />
          Sorry, your browser doesn't support embedded videos.
        </video>

        <div className="flex justify-center my-6 mt-18">
          <div className="max-w-sm">
            <img src={songs} />
            <img src={annotate} />
            <img src={segments} />
          </div>
        </div>
        <GetStarted>Go to app</GetStarted>

        <div className="flex mt-16 justify-center my-24">
          <div className="">
            <a href="https://larskarbo.no" target="_blank">
              <div
                className=" flex items-center border border-gray-200 rounded p-2 px-4
                hover:border-gray-400 transition-colors duration-150 hover:shadow-sm
                "
              >
                <img
                  alt="Lars"
                  className="rounded-full mr-2 w-8"
                  src="https://s.gravatar.com/avatar/4579b299730ddc53e3d523ec1cd5482a?s=72"
                />
                <div className="font-light">
                  made by <strong className="font-bold">@larskarbo</strong>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="my-8 font-light w-full text-center underline text-sm">
        <div>
          <Link to="/ab-repeat-spotify/">
            3 Ways to AB-repeat Spotify
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}

const GetStarted = ({ children }) => {
  // let history = useHistory();
  return (
    <div className="flex my-6 justify-center">
      <Link className="" to="/app">
        <button className="bg-green-100 shadow hover:border-green-400 transition-colors duration-150 hover:shadow-sm border border-green-200 rounded p-2 px-4">
          {children}
        </button>
      </Link>
    </div>
  );
};
