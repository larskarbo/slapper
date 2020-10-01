import Authorize from "./Authorize";
import DeviceSelector from "./DeviceSelector";
import Spotify from "./Spotify";

import React, { useState } from "react";
import Croaker from "./Croaker";
import { Text, View } from "react-native";
import defSlaps from "./slaps";

export const PARSE_SERVER_BASE = "http://localhost:1337";
// export const PARSE_SERVER_BASE = "https://server.focusmonkey.io";

export default function Main (){
  // const [spotify, setSpotify] = useState(new Spotify());
  const [activeSlap, setActiveSlap] = useState("Modulations 🚀");
	const [slaps, setSlaps] = useState(defSlaps.map(s => ({
		...s,
		items: s.items.map(item => ({
			...item,
			state: "paused"
		}))
  })));
  
  // console.log('slaps: ', JSON.stringify(slaps));
  

  // const s = spotify.s;

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

  // spotify.onUpdateState = () => {
  //   // this.setState({
  //   // 	spotify: this.state.spotify,
  //   // });
  // };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* <Authorize spotify={this.state.spotify} /> */}

      {/* {this.state.spotify.credentials &&
					<DeviceSelector spotify={this.state.spotify} />
				} */}

      <div
        style={{
          width: 200,
          height: "100vh",
          marginRight: 30,
          backgroundColor: "#f7f6f2",
          paddingTop: 100,
        }}
      >
        <div>
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
        </div>

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
          {slaps.map((slap) => {
            const active = slap.name == activeSlap;
            return (
              <View
                style={{
                  paddingVertical: 6,
                  backgroundColor: active && "#dddddd",
								}}
								onClick={() => setActiveSlap(slap.name)}
              >
                <Text
                  style={{
                    fontSize: 12,
                    paddingLeft: 20,
                    fontWeight: active ? 700 : 400,
                  }}
                >
                  {slap.name}
                </Text>
              </View>
            );
          })}
        </div>
      </div>
      <Croaker
			// spotify={spotify}
			slap={slaps.find(s => s.name == activeSlap)}
			setItems={(items) => {
				setSlaps(slaps.map((es) => {
					if(es.name==activeSlap){
						return {
							...es,
							items
						}
					}
					return es
				}))
			}}
			/>
    </div>
  );
};