import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Main from "./src/Main";

import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import netlifyIdentity from "netlify-identity-widget";
import LoginPage from "./src/views/LoginPage";
import IntroPage from "./src/views/IntroPage";

window.netlifyIdentity = netlifyIdentity;
console.log("netlifyIdentity: ", netlifyIdentity);
// You must run this once before trying to interact with the widget
netlifyIdentity.init();


export default function App() {




  return (
    <View style={styles.container}>
      <Router>
        <Switch>
          <PrivateRoute path={["/s/:collectionId","/s"]}>
            <Main />
          </PrivateRoute>
          <PrivateRoute path="/u/:user">{/* <User /> */}</PrivateRoute>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/">
            <IntroPage />
          </Route>
          <PrivateRoute path="*">
            <NotFound />
          </PrivateRoute>
        </Switch>
      </Router>
      <StatusBar style="auto" />
    </View>
  );
}

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
      netlifyIdentity.currentUser() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

const NotFound = () => <Text>404 not found</Text>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "red",
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
