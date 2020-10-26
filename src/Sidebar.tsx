import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { useParams, Link, Route, Switch } from "react-router-dom";
import request from "./utils/request";

import netlifyIdentity from "netlify-identity-widget";
const Sidebar = ({ spotify }) => {
  const { collection } = useParams();
  // const [activeSlap, setActiveSlap] = useState(null);
  const activeSlap = collection;

  const [slaps, setSlaps] = useState([]);

  useEffect(() => {
    request("GET", "fauna").then((res) => {
      
      setSlaps(
        res.map((r) => ({
          ...r.data,
          id: r.ref["@ref"].id,
        }))
      );
      // setActiveSlap(279439751993360901);
    });
  }, []);

  const newSlapCollection = () => {
    request("POST", "fauna/newSlapCollection", {
      title: "",
      description: "",
      items: [],
    }).then((res) => {
      
    });
	};
	
	// netlifyIdentity.open()
  return (
    <div
      // className="reveal"
      style={{
        width: 200,
        height: "100vh",
        marginRight: 30,
        backgroundColor: "#f7f6f2",
        paddingTop: 100,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: 200,
          paddingLeft: 20,
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
      </Text>

      <div
        style={{
          paddingTop: 50,
				}}
				onClick={() =>{
          netlifyIdentity.open()
          
          netlifyIdentity.on("logout", () => {
            location.reload()
          });
				}}
      >
        <Text
          style={{
            fontSize: 16,
            paddingLeft: 20,
            fontWeight: 900,
            letterSpacing: "-1px",
          }}
        >
          🥳 Lars Karbo:
        </Text>
      </div>

      <div
        style={{
          paddingTop: 10,
        }}
      >
        {slaps.map((slap) => {
          const active = slap.id == activeSlap;

          return (
            <Link key={slap.id} to={"/c/" + slap.id}>
              <View
                style={{
                  paddingVertical: 6,
                  backgroundColor: active && "#dddddd",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    paddingLeft: 20,
                    fontWeight: active ? 700 : 400,
                  }}
                >
                  {slap.title.length ? slap.title : "Untitled"}
                </Text>
              </View>
            </Link>
          );
        })}
        <button onClick={newSlapCollection}>New collection +</button>
      </div>
    </div>
  );
};

export default Sidebar;
