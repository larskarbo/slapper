import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import netlifyIdentity from "netlify-identity-widget";
import { useHistory, useLocation, Route, Switch, Redirect } from "react-router-dom";
import termsFrPath from "../../src/welcome.md";
import marked from "marked";
import {request} from "../utils/request";

export default function ({user}) {
  let history = useHistory();
  let location = useLocation();


  const register = async (user) => {
    await request("POST", "fauna/users/register", {
      id: user.id,
      email: user.email,
      name: user.user_metadata.full_name,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    history.replace(from);
  };

  useEffect(() => {
    netlifyIdentity.open();
  }, [])
  


  return (
    <div
      style={{
        // width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        padding: 100,
      }}
    >

      <div>
        <button onClick={() => {netlifyIdentity.open();
        }}>Show login/signup box</button>
      </div>
    </div>
  );
}
