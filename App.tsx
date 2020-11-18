import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import "./src/index.css";
import "react-contexify/dist/ReactContexify.min.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import netlifyIdentity from "netlify-identity-widget";
import LoginPage from "./src/views/LoginPage";
import IntroPage from "./src/views/IntroPage";
import { request, generateHeaders } from "./src/utils/request";
import Croaker from "./src/Croaker";
import { BButton } from "./src/comp/BButton";

// You must run this once before trying to interact with the widget
netlifyIdentity.init();

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const getUserFromServer = async (nUser) => {
    await generateHeaders(nUser);
    await request("POST", "fauna/users/getMe")
      .then((res: any) => {
        if (res.id) {
          console.log("res.id: ", res.id);
          setUser(res);
        } else {
          console.log("here");
          console.log("res: ", res);
          throw new Error("No res.id");
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    netlifyIdentity.on("login", (user) => {
      netlifyIdentity.close();
      getUserFromServer(user);
    });
  }, []);

  useEffect(() => {
    netlifyIdentity.on("logout", (user) => {
      console.log("logging out");
      setUser(null);
    });
  }, []);

  useEffect(() => {
    const nUser = netlifyIdentity.currentUser();
    console.log("nUser: ", nUser);
    if (!nUser) {
      setLoadingUser(false);
      return;
    }
    getUserFromServer(nUser).finally(() => {
      setLoadingUser(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Router>
        <Switch>
          <Route exact path="/">
            <IntroPage />
          </Route>

          <Route exact path="/login">
            <LoginPage user={user} />
          </Route>
          <Route path={["/s/profile","/s/browse", "/s/:collectionId", "/s"]}>
            <Croaker loadingUser={loadingUser} user={user} />
          </Route>
          {/* <Switch>
            <Route path="/login">
              <LoginPage user={user} />
            </Route>
            <Route path={["/s/:collectionId", "/s"]}>
              <Main user={user} />
            </Route>
          </Switch> */}
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Router>
      <StatusBar style="auto" />
    </View>
  );
}

function PrivateRoute({ children, user, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
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
