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
       <div id="mc_embed_signup">
          <form
            action="https://focusmonkey.us10.list-manage.com/subscribe/post?u=acdb4ec8fee41765027ff12e3&amp;id=b2ce7d8d57"
            method="post"
            id="mc-embedded-subscribe-form"
            name="mc-embedded-subscribe-form"
            className="validate"
            target="_blank"
            noValidate
          >
            <div id="mc_embed_signup_scroll">
              <label htmlFor="mce-EMAIL">Sign up for beta access</label>
              <input
                type="email"
                // value=""
                name="EMAIL"
                className="email"
                id="mce-EMAIL"
                placeholder="email address"
                required
              />
              <div style={{position: "absolute", left: "-5000px"}} aria-hidden="true">
                <input
                  type="text"
                  name="b_acdb4ec8fee41765027ff12e3_b2ce7d8d57"
                  tabIndex="-1"
                  value=""
                />
              </div>
              <div className="clear">
                <input
                  type="submit"
                  value="Be on the list"
                  name="subscribe"
                  id="mc-embedded-subscribe"
                  className="button"
                />
              </div>
            </div>
          </form>
        </div>
      
      <div className="cantwait">Want to try? <a style={{textDecoration:"underline"}} href="https://calendly.com/larskarbo/slapper-beta">Schedule a demo call</a>.</div>
    
    </div>
  );
}
