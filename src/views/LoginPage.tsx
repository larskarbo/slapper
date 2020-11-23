import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import netlifyIdentity from "netlify-identity-widget";
import {
  useHistory,
  useLocation,
  Route,
  Switch,
  Redirect,
  Link,
} from "react-router-dom";

import { useIdentityContext } from "react-netlify-identity";
import { View } from "react-native";
import { TText } from "../utils/font";
import { BButton } from "../comp/BButton";
import { FormControl, InputGroup } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";

export default function ({ user, register = false }) {
  let history = useHistory();
  let location = useLocation();
  const {
    isConfirmedUser,
    loginUser,
    signupUser,
    loginProvider,
    user: nUser,
  } = useIdentityContext();
  console.log("nUser: ", nUser);
  const formRef = useRef();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setMsg("");
  }, [register]);

  const signup = () => {
    const email = formRef.current.email.value;
    const password = formRef.current.password.value;

    signupUser(email, password)
      .then((user) => {
        console.log("Success! Signed up", user);
        // navigate("/dashboard");
      })
      .catch((err) => setMsg("Error: " + err.message));
  };

  const login = () => {
    const email = formRef.current.email.value;
    const password = formRef.current.password.value;

    loginUser(email, password)
      .then((user) => {
        console.log("Success! Signed up", user);
        // navigate("/dashboard");
      })
      .catch((err) => setMsg("Error: " + err.message));
  };

  let { from } = location.state || { from: { pathname: "/s" } };
  if (!from.pathname.includes("/s")) {
    from = { pathname: "/s" };
  }

  if (user && user.username) {
    return <Redirect to={from} />;
  } else if (user) {
    return <Redirect to={{ pathname: "/onboarding" }} />;
  }

  return (
    <div
      style={{
        // width: "100%",
        height: "100%",
        display: "flex",
        padding: 100,
        backgroundColor: "oldlace",
      }}
    >
      <View
        style={{
          width: "100%",
          alignItems: "center",
        }}
      >
        <TText
          style={{
            fontWeight: 500,
            paddingBottom: 20,
          }}
        >
          Slapper.io
        </TText>
        <View
          style={{
            maxWidth: 400,
            width: "100%",
            padding: 25,
            backgroundColor: "white",
            borderRadius: 10,
            boxShadow:
              "0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06)",
          }}
        >
          {msg && (
            <TText
              style={{
                color: "red",
              }}
            >
              {msg}
            </TText>
          )}
          {!isConfirmedUser && nUser ? (
            <TText>Check your email and confirm it!</TText>
          ) : (
            <>
              <form ref={formRef} onSubmit={register ? signup : login}>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">📤</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    name="email"
                    placeholder="email"
                    aria-label="email"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">🔒</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    name="password"
                    placeholder="password"
                    type="password"
                    aria-label="password"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>

                <BButton
                  style={{
                    width: "100%",
                  }}
                  onPress={register ? signup : login}
                  variant="secondary"
                >
                  Continue with mail
                </BButton>
              </form>

              <hr />
              <BButton onPress={() => {
                loginProvider("google")
              }}>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    padding: 5,
                  }}
                >
                  <View>
                    <FaGoogle />
                  </View>
                  <View>
                    <TText
                      style={
                        {
                          // color:
                        }
                      }
                    >
                      Sign {register ? "up" : "in"} with Google
                    </TText>
                  </View>
                  <View>
                    <TText></TText>
                  </View>
                </View>
              </BButton>
            </>
          )}
        </View>
        <TText
          style={{
            paddingTop: 10,
          }}
        >
          {register ? (
            <>
              Already got an account? <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              No account yet? <Link to="/register">Register</Link>
            </>
          )}
        </TText>
      </View>
    </div>
  );
}
