import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { useParams, useHistory, Link, Route, Switch } from "react-router-dom";
import request from "./utils/request";

import netlifyIdentity from "netlify-identity-widget";
const Sidebar = ({ spotify }) => {
  let history = useHistory();
  const { collectionId } = useParams();
  // const [activeSlap, setActiveSlap] = useState(null);
  const activeSlap = collectionId;

  const [slaps, setSlaps] = useState([]);
  const [updateCounter, setUpdateCounter] = useState(0);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    request("GET", "fauna/collections").then((res) => {
      console.log("res: ", res);

      setSlaps(
        res.map((r) => ({
          ...r.data,
          id: r.ref["@ref"].id,
        }))
      );
      // setActiveSlap(279439751993360901);
    });
  }, [updateCounter]);

  const newSlapCollection = () => {
    request("POST", "fauna/collection", {
      title: "",
      description: "",
      items: [],
      user: netlifyIdentity.currentUser().id,
    }).then((res) => {
      console.log("res: ", res);
      history.replace({ pathname: "/s/" + res.ref["@ref"].id });
      setUpdateCounter(updateCounter + 1);
    });
  };

  useEffect(() => {
    // const user = netlifyIdentity.currentUser()
    request("GET", "fauna/users/findAll").then((asdf) => {
      setAllUsers(asdf);
    });
  }, []);

  // useEffect(() => {
  //   if(allUsers.length){
  //     console.log('allUsers: ', allUsers);
  //     // const user = netlifyIdentity.currentUser()
  //     // request("GET", "fauna/users/findAll" ).then(asdf => {
  //     //   console.log('asdf: ', asdf);

  //     // })
  //   }
  // },[allUsers])

  // netlifyIdentity.open()
  return (
    <div
      // className="reveal"
      style={{
        width: 200,
        height: "100vh",
        marginRight: 30,
        backgroundColor: "#f7f6f2",
      }}
    >
      <div style={{ paddingTop: 100 }}></div>
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

      {allUsers
        .sort((a, b) => {if(a.data.id == netlifyIdentity.currentUser().id){return -10}})
        .map((u) => (
          <>
            <User id={u.data.id} />
            {slaps
              .filter((s) => s.user == u.data.id)
              .map((slap) => {
                const active = slap.id == activeSlap;

                return (
                  <Link key={slap.id} to={"/s/" + slap.id}>
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

            {u.data.id == netlifyIdentity.currentUser().id && (
              <div
                style={{
                  paddingTop: 10,
                }}
              >
                <button onClick={newSlapCollection}>New collection +</button>
              </div>
            )}
          </>
        ))}
    </div>
  );
};

const User = ({ id }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // const user = netlifyIdentity.currentUser()
    request("GET", "fauna/users/find/" + id).then((asdf) => {
      console.log("userrrr: ", asdf);
      setUser(asdf.data);
    });
  }, []);

  return (
    <div
      style={{
        paddingTop: 50,
      }}
      onClick={() => {
        netlifyIdentity.open();

        netlifyIdentity.on("logout", () => {
          location.reload();
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
        🥳 {user?.name}
      </Text>
    </div>
  );
};

export default Sidebar;
