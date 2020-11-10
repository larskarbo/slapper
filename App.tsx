import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Main from "./src/Main";

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
import Footer from "./src/Footer";

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
          <Route exact path="/test">
            <div
              style={{
                height: 100,
                position: "absolute",
                bottom: 0,
                right: 0,
                left: 0,
              }}
            >
              <Footer
                playingNow={{
                  type: "item",
                  item: {
                    trackId: "5cF0dROlMOK5uNZtivgu50",
                    id: "192638bc-4928-41ef-a87f-8371c4513e3e",
                    clips: [
                      {
                        from: 49740,
                        to: 67241,
                        title: "Clip",
                        id: "77ee7a70-bcb8-45c5-b63e-a533dbe7b5f1",
                        color: "#B3EBE7",
                      },
                      {
                        from: 66934,
                        to: 87813,
                        title: "Clip",
                        id: "8a7a281a-66e7-4fdc-ae5e-9ddadcede7bc",
                        color: "#EDB7C4",
                      },
                    ],
                    metaInfo: {
                      duration: 208786,
                      title: "Attention",
                      image:
                        "https://i.scdn.co/image/ab67616d0000b273897f73256b9128a9d70eaf66",
                      artist: "Charlie Puth",
                    },
                  },
                  action: null,
                  clientUpdate: 0.21938923806654387,
                  state: "playing",
                  scrub: 23365,
                  position: 28271,
                }}
                items={[
                  
                  {
                    trackId: "5cF0dROlMOK5uNZtivgu50",
                    id: "192638bc-4928-41ef-a87f-8371c4513e3e",
                    clips: [
                      {
                        from: 49740,
                        to: 63241,
                        title: "Clip",
                        id: "77ee7a70-bcb8-45c5-b63e-a533dbe7b5f1",
                        color: "#B3EBE7",
                      },
                      {
                        from: 66934,
                        to: 87813,
                        title: "Clip",
                        id: "8a7a281a-66e7-4fdc-ae5e-9ddadcede7bc",
                        color: "#EDB7C4",
                      },
                    ],
                    metaInfo: {
                      duration: 208786,
                      title: "Attention",
                      image:
                        "https://i.scdn.co/image/ab67616d0000b273897f73256b9128a9d70eaf66",
                      artist: "Charlie Puth",
                    },
                  },
                ]}
                // onUpdateClip={updateClip}
                // onScrub={scrub}
              />
            </div>
          </Route>
          <Route exact path="/">
            <IntroPage />
          </Route>

          <Route path="/">
            {/* <IntroPage /> */}
            {loadingUser ? (
              "loading..."
            ) : (
              <>
                <Switch>
                  <Route exact path="/login">
                    <LoginPage user={user} />
                  </Route>
                  {user ? (
                    <Route path={["/s/:collectionId", "/s"]}>
                      <Main user={user} />
                    </Route>
                  ) : (
                    <Switch>
                      <Route
                        render={(props) => (
                          <Redirect
                            to={{
                              pathname: "/login",
                              state: { from: props.location },
                            }}
                          />
                        )}
                      />
                    </Switch>
                  )}
                </Switch>
              </>
            )}
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
