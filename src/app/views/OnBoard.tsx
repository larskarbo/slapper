import React, { useEffect, useRef, useState } from "react";
import netlifyIdentity from "netlify-identity-widget";

import { TText } from "../utils/font";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import { FaGoogle, FaUser } from "react-icons/fa";
import { request } from "../utils/request";
import { Redirect } from '@reach/router';

export default function ({ user, register = false }) {
  const formRef = useRef();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setMsg("");
  }, [register]);

  const continueToSlapper = () => {
    const username = formRef.current.username.value;
    const emailUpdates = formRef.current.emailUpdates.value;
    console.log('username: ', username);
    if(username.length < 4){
      return alert("Please have at least 4 letters in your username")
    }
    // const password = formRef.current.password.value;

    request("POST", "fauna/users/setMe", {
      username:username,
      emailUpdates:emailUpdates,
    })
      .then((user:any) => {
        console.log("Success! Signed up", user);
        window.location.href="/s";
      })
      .catch((err) => {
        if(err.message.includes("instance not unique")){
          setMsg("Username not available, please choose something else")
        } else {
          setMsg("Error: " + err.message)
        }
      });
  };

  let { from } = location.state || { from: { pathname: "/s" } };
  if (!from.pathname.includes("/s")) {
    from = { pathname: "/s" };
  }

  if (user && user.username) {
    return <Redirect to={from} />;
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
      <div
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
        <div
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
          <form ref={formRef} onSubmit={(e) => {
            e.preventDefault()
            continueToSlapper()
          }}>
            <TText>Choose a username:</TText>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">
                  <FaUser />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                required
                name="username"
                placeholder="username"
                aria-label="username"
                aria-describedby="basic-addon1"
              />
            </InputGroup>



            <InputGroup className="mb-3">
              <Form.Check
                name="emailUpdates"
                type="switch"
                id="custom-switch"
                label="Receive occasional updates about Slapper"
              />
            </InputGroup>

            <button
              style={{
                width: "100%",
              }}
              onPress={continueToSlapper}
              variant="secondary"
            >
              Continue to Slapper
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
