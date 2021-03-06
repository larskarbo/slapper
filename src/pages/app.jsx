import React, { useContext, useEffect, useState } from "react";

import { Router, Redirect } from "@reach/router"
import { Link, navigate } from "gatsby"

import LoginPage from "../app/views/LoginPage";
import { request, generateHeaders } from "../app/utils/request";
import Croaker from "../app/Croaker";

import {
  IdentityContextProvider,
  useIdentityContext,
} from "react-netlify-identity";
import OnBoard from "../app/views/OnBoard";
import Admin from "../app/views/Admin";
import App from '../app/Main';
import { UserProvider, useUser } from "../app/user-context";
const url = "https://slapper.io";


export default function AppRouter() {
  return (
    <IdentityContextProvider url={url}>
      <UserProvider>
        <Routing />
      </UserProvider>
    </IdentityContextProvider>
  );
}

function Routing() {

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return null;
  }

  return (
    <>
      
      <Router basepath="/app">
        <LogOut path="/logout" />
        <LoginRoute component={LoginPage} path="/login" />
        <OnBoard path="/onboarding" />
        <Admin path="/admin" />
        <App default />
        {/* <Croaker default loadingUser={loadingUser} user={user} /> */}
      </Router>
    </>
  );
}

const LoginRoute = ({ component: Component, location, ...rest }) => {
  const { isAuthenticated } = useUser()
  if (isAuthenticated) {
    navigate("/app", { replace: true })
    return null
  }
  return <Component {...rest} />
}

export const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const { isAuthenticated } = useUser()
  if (!isAuthenticated && location.pathname !== `/app/login`) {
    navigate("/app/login", { replace: true })
    return null
  }
  return <Component {...rest} />
}


const LogOut = () => {
  const { logoutUser } = useIdentityContext();

  useEffect(() => {
    logoutUser();
  });
  return <div>Logged out</div>;
};
