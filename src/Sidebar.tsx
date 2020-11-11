import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import {
  useParams,
  useHistory,
  Link,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import { request } from "./utils/request";
import netlifyIdentity from "netlify-identity-widget";
import { TText } from "./utils/font";
import { BButton } from "./comp/BButton";

const Sidebar = ({ user, loadingUser }) => {
  console.log('user: ', user);
  let history = useHistory();
  let location = useLocation();
  const { collectionId } = useParams();
  // const [activeSlap, setActiveSlap] = useState(null);
  const activeSlap = collectionId;

  const [slaps, setSlaps] = useState([]);
  const [updateCounter, setUpdateCounter] = useState(0);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    request("GET", "fauna/collections").then((res) => {
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
      user: user.id,
    }).then((res) => {
      history.replace({ pathname: "/s/" + res.ref["@ref"].id });
      setUpdateCounter(updateCounter + 1);
    });
  };

  useEffect(() => {
    request("GET", "fauna/users/findAll").then((asdf) => {
      setAllUsers(asdf);
    });
  }, []);

  return (
    <div
      style={{
        width: 200,
        marginRight: 30,
        backgroundColor: "#f7f6f2",
      }}
    >
      <div style={{ paddingTop: 100 }}></div>
      <TText
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
      </TText>

      {(!loadingUser && !user) &&
      <View style={{
        paddingTop: 20,
        paddingHorizontal: 10
      }}>
        <Text>With a slapper account you can create your own shareable collections!</Text>
        <BButton
        variant="secondary"
          onClick={() => {
            history.push("/login", { from: location });
          }}
        >
          Login/sign up
        </BButton>
      </View>
      }

      {allUsers
        .sort((a, b) => {
          if (a.data.id == user?.id) {
            return -10;
          }
        })
        .map((u) => (
          <div key={u.data.id}>
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
                      <TText
                        style={{
                          fontSize: 12,
                          paddingLeft: 20,
                          fontWeight: active ? 700 : 400,
                        }}
                      >
                        {slap.title.length ? slap.title : "Untitled"}
                      </TText>
                    </View>
                  </Link>
                );
              })}

            {u.data.id == user?.id && (
              <div
                style={{
                  paddingTop: 10,
                }}
              >
                <button onClick={newSlapCollection}>New collection +</button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

const User = ({ id }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    request("GET", "fauna/users/find/" + id).then((asdf) => {
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
          // location.reload();
        });
      }}
    >
      <TText
        style={{
          fontSize: 16,
          paddingLeft: 20,
          fontWeight: 900,
          letterSpacing: "-1px",
        }}
      >
        🥳 {user?.name}
      </TText>
    </div>
  );
};

export default Sidebar;
