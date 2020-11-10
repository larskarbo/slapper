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
          <div style={{height:100, position:"absolute", bottom:0, right: 0, left: 0}}>
        <Footer
          playingNow={{"type":"item","item":{"trackId":"5cF0dROlMOK5uNZtivgu50","id":"192638bc-4928-41ef-a87f-8371c4513e3e","clips":[{"from":49740,"to":67241,"title":"Clip","id":"77ee7a70-bcb8-45c5-b63e-a533dbe7b5f1","color":"#B3EBE7"},{"from":66934,"to":87813,"title":"Clip","id":"8a7a281a-66e7-4fdc-ae5e-9ddadcede7bc","color":"#EDB7C4"}],"metaInfo":{"duration":208786,"title":"Attention","image":"https://i.scdn.co/image/ab67616d0000b273897f73256b9128a9d70eaf66","artist":"Charlie Puth"}},"action":null,"clientUpdate":0.21938923806654387,"state":"playing","scrub":23365,"position":28271}}
          items={[{"trackId":"7zkA4TSmYO1Bko2PnFn0YB","id":"ccfc11f7-ffc4-4c04-b8ac-69bc030316ab","clips":[],"metaInfo":{"duration":134025,"title":"Steven Universe","image":"https://i.scdn.co/image/ab67616d0000b273a5f5cb76ee8ddfc272aec550","artist":"L.Dre"}},{"trackId":"5ThIEmdSSlQarAm4QLev5j","id":"1e3336ed-2cb4-4717-9f0b-e4a296ae852e","clips":[],"text":"from sasha's story","metaInfo":{"duration":286826,"title":"Feels Like","image":"https://i.scdn.co/image/ab67616d0000b273e8a627f6f15094b2eb0deba5","artist":"Nao"}},{"trackId":"45r7mbXRbpFAYZavAoX6tk","id":"1c14c995-5d93-4c75-8c29-8ce03d359530","clips":[],"metaInfo":{"duration":214933,"title":"Crockett's Theme - From \"Miami Vice II\" Soundtrack","image":"https://i.scdn.co/image/ab67616d0000b273e943d965e240f8385a2e5ec3","artist":"Jan Hammer"}},{"trackId":"4mZzGxy85VLtKsYDThZCT1","id":"9c0ee290-ee34-4585-8836-69a2076acab6","clips":[],"metaInfo":{"duration":251453,"title":"Close Encounters","image":"https://i.scdn.co/image/ab67616d0000b273446fd6ea5a609ac91228af4d","artist":"HuntorPrey"}},{"videoId":"ZOtj5WtkR1Q","id":"4fcd575c-0a3a-43ce-b69f-c44ffac0f468","clips":[{"from":24353,"to":46941,"title":"Clip","id":"ba1136e1-a5e7-4d7c-81ea-a4c74bacf70a","color":"#B3EBE7"}],"text":"ableton push","metaInfo":{"duration":240000,"title":"Decap Push 1 Performance"}},{"videoId":"dpOEfYwbWUg","id":"c0091228-3a2a-4a53-b956-00489de062ac","clips":[{"from":206000,"to":232800,"title":"Clip","id":"8ee1f377-1c70-4077-bb7b-c954a3236ba5","color":"#B3EBE7"}],"text":"drum part","metaInfo":{"duration":272000,"title":"Ableton Push 2 Live Performance: Changing Spaces- JokerB"}},{"trackId":"5cF0dROlMOK5uNZtivgu50","id":"192638bc-4928-41ef-a87f-8371c4513e3e","clips":[{"from":49740,"to":67241,"title":"Clip","id":"77ee7a70-bcb8-45c5-b63e-a533dbe7b5f1","color":"#B3EBE7"},{"from":66934,"to":87813,"title":"Clip","id":"8a7a281a-66e7-4fdc-ae5e-9ddadcede7bc","color":"#EDB7C4"}],"metaInfo":{"duration":208786,"title":"Attention","image":"https://i.scdn.co/image/ab67616d0000b273897f73256b9128a9d70eaf66","artist":"Charlie Puth"}}]}
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
                              state: { from: props.location }
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
