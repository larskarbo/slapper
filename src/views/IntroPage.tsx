import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import netlifyIdentity from "netlify-identity-widget";
import { useHistory, useLocation, Link, Route, Switch, Redirect } from "react-router-dom";

import marked from "marked";
import YouTube from "react-youtube";
import { TText } from "../utils/font";
import { BButton } from "../comp/BButton";
import annotate from "./annotate.png";
import segments from "./segments.png";
import songs from "./songs.png";
import Typist from "react-typist";
import { Logo } from "../Sidebar";
import { Helmet } from "react-helmet";

export default function () {
  const location = useLocation()
  if(location.hash?.includes("confirmation_token")){
    return <Redirect to={"/onboarding"+location.hash} />
  }
  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: "oldlace",
      }}
    >
      {/* <View
        style={{
          height: 40,
          backgroundColor: "#008aff",
          justifyContent: "center",
          width: "100%"
        }}
      >
        <TText
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          🚀 Live on <a
          style={{
            color: "white",
          }} target="_blank" href="https://www.producthunt.com/">Product hunt</a>
        </TText>
      </View> */}
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 40,
          paddingTop: 20,
          paddingHorizontal: 20,
          maxWidth: 1000,
        }}
      >
        <Logo />
        <TText
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
        </TText>
        <TText
          style={{
            fontSize: 20,
            textAlign: "center",
            marginTop: 10,
            marginBottom: 10,
            fontWeight: 200,
          }}
        >
          from Spotify and Youtube in the same list.
        </TText>

        <GetStarted style={{ marginTop: 20 }}>Go to app</GetStarted>

        <video
          style={{
            width: "100%",
            boxShadow: "3px 3px 5px 6px #ccc",
          }}
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

        <GetStarted>Get started</GetStarted>

        <img
          style={{
            maxWidth: 400,
          }}
          src={songs}
        />
        <img
          style={{
            maxWidth: 400,
          }}
          src={annotate}
        />
        <img
          style={{
            maxWidth: 400,
          }}
          src={segments}
        />
        <GetStarted style={{ marginTop: 20 }}>Get started</GetStarted>
      </View>
    </View>
  );
}

const GetStarted = ({ style, children }) => {
  let history = useHistory();
  return (
    <Link to="/register">
      <BButton
        style={{
          marginTop: 50,
          marginBottom: 30,
          ...style,
        }}
        variant="success"
      >
        {children}
      </BButton>
    </Link>
  );
};
