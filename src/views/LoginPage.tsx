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
  
  
  let { from } = location.state || { from: { pathname: '/s' } };
  if(!from.pathname.includes("/s")){
    from = { pathname: '/s' }
  }

  if(user){
    return <Redirect to={from} />
  }


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
