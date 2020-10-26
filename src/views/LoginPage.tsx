import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Login from "./RoutingAndAuth";
import Main from "./src/Main";
import netlifyIdentity from "netlify-identity-widget";
import { useHistory, useLocation, Route, Switch } from "react-router-dom";

export default function () {
  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };
  const login = () => {
    
    netlifyIdentity.open();
    netlifyIdentity.on("login", (user) => {
      console.log("user: ", user);
      history.replace(from);
    });
  }

  return (
    <View>
      log in
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>Beta log in</button>
    </View>
  );
}
