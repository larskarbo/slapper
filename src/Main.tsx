import Spotify from "./Spotify";

import React, { useEffect, useMemo, useState } from "react";
import Croaker from "./Croaker";
import { Text, View } from "react-native";
import { request } from "./utils/request";
import "./index.css";
import useLocalStorage from "react-use-localstorage";
import { useParams, Link, Route, Switch } from "react-router-dom";
import Sidebar from "./Sidebar";
import "react-contexify/dist/ReactContexify.min.css";
export default function Main({ user, loadingUser }) {
  const spotify = useMemo(() => new Spotify(), []);

  return <Croaker loadingUser={loadingUser} user={user} spotify={spotify} />;
}
