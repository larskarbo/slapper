import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import netlifyIdentity from "netlify-identity-widget";
import { useHistory, useLocation, Link, Route, Switch } from "react-router-dom";

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

        <GetStarted style={{ marginTop: 20 }} />

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
            src={
              "https://res.cloudinary.com/dfzqjzusj/video/upload/w_700/v1605174836/slapperland.mov"
            }
            // type="video/webm"
          />
          <source
            src={
              "https://res.cloudinary.com/dfzqjzusj/video/upload/w_700/v1605174836/slapperland.mp4"
            }
            // type="video/webm"
          />
          <source
            src={
              "https://res.cloudinary.com/dfzqjzusj/video/upload/w_700/v1605174836/slapperland.webm"
            }
            // type="video/webm"
          />
          Sorry, your browser doesn't support embedded videos.
        </video>

        <GetStarted />

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
        <GetStarted style={{ marginTop: 20 }} />
      </View>
    </View>
  );
}

const GetStarted = ({ style }) => {
  let history = useHistory();
  return (
    <Link to="/login">
      <BButton
        style={{
          marginTop: 50,
          marginBottom: 30,
          ...style,
        }}
        variant="success"
      >
        Get started
      </BButton>
    </Link>
  );
};
