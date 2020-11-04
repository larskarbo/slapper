import Spotify from "./Spotify";

import React, { useEffect, useMemo, useState } from "react";
import Croaker from "./Croaker";
import { Text, View } from "react-native";
import {request} from "./utils/request";
import "./index.css";
import useLocalStorage from "react-use-localstorage";
import { useParams, Link, Route, Switch } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Main({user}) {
  const spotify = useMemo(() => new Spotify(), []);

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
      <Sidebar user={user} />
      <div>
        <Switch>
          <Route exact path="/s">
            <h3>Select a collection or create one to get started.</h3>
          </Route>
          <Route path={`/s/:collectionId`}>
            <Croaker user={user} spotify={spotify} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
