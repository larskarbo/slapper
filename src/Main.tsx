import Authorize from "./Authorize";
import DeviceSelector from "./DeviceSelector";
import Spotify from "./Spotify";

import React, { useEffect, useMemo, useState } from "react";
import Croaker from "./Croaker";
import { Text, View } from "react-native";
import defSlaps from "./slaps";
import request from "./utils/request";
import "./index.css";
import { SpotifyFucker } from "./SpotifyFucker";
import { SpotifyBox } from "./SpotifyBox";
export const PARSE_SERVER_BASE = "http://localhost:1337";
// export const PARSE_SERVER_BASE = "https://server.focusmonkey.io";

export default function Main() {
  const spotify = useMemo(() => new Spotify(), []);
  const [activeSlap, setActiveSlap] = useState(null);
  const [slaps, setSlaps] = useState([]);

  useEffect(() => {
    request("GET", "fauna").then((res) => {
      console.log("res: ", res);
      setSlaps(
        res.map((r) => ({
          ...r.data,
          id: r.ref["@ref"].id,
        }))
      );
      setActiveSlap(279439751993360901);
    });
  }, []);

  const newSlapCollection = () => {
    request("POST", "fauna/newSlapCollection", {
      title: "",
      description: "",
      items: [],
    }).then((res) => {
      console.log("res: ", res);
    });
  };

  // s.setOnError((error) => {
  //   console.log(error);
  //   console.log("Invalid access token");
  //   // firebase.analytics().logEvent('api-error', {error});
  //   if (error.includes("Invalid access token")) {
  //     // this.state.spotify.logOut();
  //     console.log("this.state.spotify.logOut: ");
  //   } else {
  //     console.error("UNHANDLED ERROR:", error);
  //   }
  // });

  spotify.onUpdateState = () => {
    console.log('update')
    // this.setState({
    // 	spotify: this.state.spotify,
    // });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
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
        >
          <Text
            style={{
              fontSize: 12,
              paddingLeft: 20,
            }}
          >
            {/* slaps: */}
          </Text>
        </div>

        <div
          style={{
            paddingTop: 10,
          }}
        >
          <button onClick={newSlapCollection}>New slapcollection</button>
          {slaps.map((slap) => {
            const active = slap.id == activeSlap;

            return (
              <View
                key={slap.id}
                style={{
                  paddingVertical: 6,
                  backgroundColor: active && "#dddddd",
                }}
                onClick={() => setActiveSlap(slap.id)}
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
            );
          })}
        </div>
      </div>

      <div>
        
        <SpotifyBox spotify={spotify} />

        {activeSlap && (
          <Croaker
            spotify={spotify}
            slap={slaps.find((s) => s.id == activeSlap)}
            setItems={(items) => {
              setSlaps(
                slaps.map((es) => {
                  if (es.title == activeSlap) {
                    return {
                      ...es,
                      items,
                    };
                  }
                  return es;
                })
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
