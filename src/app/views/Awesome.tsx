import React, { useEffect, useState } from "react";
import netlifyIdentity from "netlify-identity-widget";
import { useHistory, useLocation, Route, Switch } from "react-router-dom";
import termsFrPath from "../../src/welcome.md";
import marked from "marked";
import request from "../utils/request";
import { TText } from "../utils/font";

export default function () {
  let history = useHistory();
  let location = useLocation();
  const [markdown, setMarkdown] = useState(null);

  let { from } = location.state || { from: { pathname: "/" } };
  if (!from.pathname.includes("/s")) {
    from.pathname = "/s";
  }

  const go = async (user) => {
    await request("POST", "fauna/users/register", {
      id: user.id,
      email: user.email,
      name: user.user_metadata.full_name,
    })
      .then((res:any) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    history.replace(from);
  };

  useEffect(() => {
    if (netlifyIdentity.currentUser()) {
      go(netlifyIdentity.currentUser());
    }
  }, [netlifyIdentity.currentUser()]);

  const login = () => {
    netlifyIdentity.open();
  };
  
  useEffect(() => {
    netlifyIdentity.on("init", (user) => go(user));
    netlifyIdentity.on("login", (user) => go(user));
  });

  useEffect(() => {
    fetch(termsFrPath)
      .then((response) => response.text())
      .then((text) => {
        setMarkdown(marked(text));
      });
  });

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
      <TText
        style={{
          fontSize: 20,
          fontWeight: 200,
        }}
      >
        <span
          style={{
            fontWeight: 700,
          }}
        >
          Slapper
        </span>
        .io
      </TText>

      <div
        style={{
          fontFamily:
            '"Segoe UI", Candara, "Bitstream Vera Sans", "DejaVu Sans", "Bitstream Vera Sans", "Trebuchet MS", Verdana, "Verdana Ref", sans-serif        ',
          color: "#1d1d1d",
          maxWidth: 600,
        }}
        dangerouslySetInnerHTML={{ __html: markdown }}
      ></div>

      <br />
      <div>
        <button onClick={login}>Get started</button>
      </div>
    </div>
  );
}
