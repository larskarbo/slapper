import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import netlifyIdentity from "netlify-identity-widget";
import { useHistory, useLocation, Route, Switch } from "react-router-dom";
import marked from "marked";
import request from "../utils/request";
import YouTube from "react-youtube";

export default function () {
  let history = useHistory();
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingBottom: 40,
      paddingTop: 20
    }}>

      <div style={{padding: "50px 0px"}} className="cantwait">Beta users go here -> <a style={{textDecoration:"underline"}} href="/login">go to app</a>.</div>

      <YouTube
        videoId={"OZEUbsy-Z4o"}
        // opts={{
        //   height: "60",
        //   width: "60",
        // }}
        // onReady={setYoutubeElement}
        // onStateChange={func}
      />
      
      <div className="cantwait">Want to try? <a style={{textDecoration:"underline"}} href="https://calendly.com/larskarbo/slapper-beta">Schedule a demo call</a>.</div>
    
    </div>
  );
}
