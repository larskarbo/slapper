import Spotify from "./Spotify";

import React, { useEffect, useMemo, useState } from "react";
import Croaker from "./Croaker";
import { Text, View } from "react-native";
import request from "./utils/request";
import "./index.css";
import useLocalStorage from "react-use-localstorage";
import { useParams, Link, Route, Switch } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Main() {
  const { collection } = useParams();
  

  const spotify = useMemo(() => new Spotify(), []);
  

  // s.setOnError((error) => {
  //   
  //   
  //   // firebase.analytics().logEvent('api-error', {error});
  //   if (error.includes("Invalid access token")) {
  //     // this.state.spotify.logOut();
  //     
  //   } else {
  //     
  //   }
  // });

  spotify.onUpdateState = () => {
    
    // this.setState({
    // 	spotify: this.state.spotify,
    // });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        backgroundColor: "white",
      }}
    >
      <Sidebar />
      <div>
        <Switch>
          <Route exact path="/c">
            <h3>Please select a collection.</h3>
          </Route>
          <Route path={`/c/:collection`}>
            <Croaker spotify={spotify} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
