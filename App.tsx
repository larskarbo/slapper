import React, { useEffect, useState } from "react";

import "./src/index.css";
import "./src/styles.css";
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
// import { Helmet } from "react-helmet";
import { BButton } from "./src/comp/BButton";
import { TText } from "./src/utils/font";

import {
  IdentityContextProvider,
  useIdentityContext,
} from "react-netlify-identity";
import OnBoard from "./src/views/OnBoard";
import Admin from "./src/views/Admin";
const url = "https://slapper.io";

// You must run this once before trying to interact with the widget
// netlifyIdentity.init();

export default function App() {
  return (
    <IdentityContextProvider url={url}>
      <Routing />
    </IdentityContextProvider>
  );
}

function Routing() {
  const {
    isConfirmedUser,
    authedFetch,
    getFreshJWT,
    user: nUser,
  } = useIdentityContext();
  const [user, setUser] = useState(null);
  
  const [loadingUser, setLoadingUser] = useState(true);

  const getUserFromServer = async () => {
    generateHeaders(await getFreshJWT());
    await request("GET", "fauna/users/getMe")
      .then((res: any) => {
        if (res.id) {
          
          setUser(res);
        } else {
          
          
          throw new Error("No res.id");
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (nUser && isConfirmedUser) {
      
      getUserFromServer();
    }
  }, [nUser, isConfirmedUser]);

  // useEffect(() => {
  //   netlifyIdentity.on("login", (user) => {
  //     netlifyIdentity.close();
  //     getUserFromServer(user);
  //   });
  // }, []);

  // useEffect(() => {
  //   netlifyIdentity.on("logout", (user) => {
  //     
  //     setUser(null);
  //   });
  // }, []);

  useEffect(() => {
    // const nUser = netlifyIdentity.currentUser();
    // 
    // if (!nUser) {
    //   setLoadingUser(false);
    //   return;
    // }
    // getUserFromServer(nUser).finally(() => {
    //   setLoadingUser(false);
    // });
  }, []);

  return (
    <div>
      {/* <Helmet>
        <meta
          name="description"
          content="Organize and annotate songs and segments from Spotify, Youtube, Soundcloud in interactive, shareable documents"
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dfzqjzusj/image/upload/c_fill,g_north,h_630,w_1200/v1605177986/CleanShot_2020-11-12_at_11.45.29_2x.png"
        />
        <meta
          property="twitter:image"
          content="https://res.cloudinary.com/dfzqjzusj/image/upload/c_fill,g_north,h_630,w_1200/v1605177986/CleanShot_2020-11-12_at_11.45.29_2x.png"
        />
      </Helmet> */}

      <Router>
        <Switch>
          <Route exact path="/">
            <IntroPage />
          </Route>

          <Route exact path="/logout">
            <LogOut />
          </Route>
          <Route exact path="/login">
            <LoginPage user={user} />
          </Route>
          <Route exact path="/register">
            <LoginPage user={user} register />
          </Route>
          <Route exact path="/onboarding">
            <OnBoard user={user} />
          </Route>
          <Route exact path="/admin">
            <Admin user={user} />
          </Route>
          <Route path={["/s/profile", "/s/browse", "/s/:collectionId", "/s"]}>
            {user && !user.username ? (
              <Redirect to="/onboarding" />
            ) : (
              <Croaker loadingUser={loadingUser} user={user} />
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
    </div>
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

const NotFound = () => <div>404 not found</div>;

const LogOut = () => {
  const { logoutUser } = useIdentityContext();

  useEffect(() => {
    logoutUser();
  });
  return <div>Logged out</div>;
};
