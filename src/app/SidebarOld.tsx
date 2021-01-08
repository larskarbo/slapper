import React, { useEffect, useState } from "react";

import { request } from "./utils/request";
import { TText } from "./utils/font";
import { BButton } from "./comp/BButton";

const Sidebar = ({ user, loadingUser }) => {
  let history = useHistory();
  let location = useLocation();
  const { collectionId } = useParams();
  // const [activeSlap, setActiveSlap] = useState(null);
  const activeSlap = collectionId;

  const [slaps, setSlaps] = useState([]);
  const [updateCounter, setUpdateCounter] = useState(0);

  useEffect(() => {
    if ((location.pathname == "/s" || location.pathname == "/s/") && user && !collectionId && slaps.length) {
      const userSlaps = slaps.filter((slap) => slap.user == user.id);
      if (userSlaps.length) {
        history.push("/s/" + userSlaps[0].id);
      } else {
        newSlapCollection();
      }
    }
  }, [collectionId, user, slaps]);

  useEffect(() => {
    if(user){
      request("GET", "fauna/myCollections").then((res:any) => {
        setSlaps(
          res.map((r) => ({
            ...r.data,
            id: r.ref["@ref"].id,
          }))
        );
        // setActiveSlap(279439751993360901);
      }).catch((error) => {
        console["error"]('error: ', error);
  
      })

    }
  }, [user, updateCounter]);

  const newSlapCollection = () => {
    request("POST", "fauna/collection", {
      title: "",
      description: "",
      items: [],
      user: user.id,
      visibility: "public",
    }).then((res:any) => {
      history.replace({ pathname: "/s/" + res.ref["@ref"].id });
      setUpdateCounter(updateCounter + 1);
    });
  };

  return (
    <div
      style={{
        width: 200,
        marginRight: 30,
        backgroundColor: "#f7f6f2",
      }}
    >
      <div style={{ paddingTop: 100 }}></div>
      <Logo />

      <Link to={"/s/browse"}>
        <div
          style={{
            paddingTop: 6,
            paddingBottom: 6,
            backgroundColor: null && "#dddddd",
          }}
        >
          <TText
            style={{
              fontSize: 12,
              paddingLeft: 20,
              fontWeight: false ? 700 : 400,
            }}
          >
            Browse popular slaps
          </TText>
        </div>
      </Link>

      {!loadingUser && !user && (
        <div
          style={{
            paddingTop: 20,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <Text>
            With a slapper account you can create your own shareable
            collections!
          </Text>
          <BButton
            variant="secondary"
            onClick={() => {
              history.push("/login", { from: location });
            }}
          >
            Login/sign up
          </BButton>
        </div>
      )}

      {user && (
        <div>
          <User isMe={true} id={user.id} />
          {slaps
            .filter((s) => s.user == user.id)
            .map((slap) => {
              const active = slap.id == activeSlap;

              return (
                <Link key={slap.id} to={"/s/" + slap.id}>
                  <div
                    style={{
                      paddingTop: 6,
                      paddingBottom: 6,
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
                  </div>
                </Link>
              );
            })}

          <div
            style={{
              paddingTop: 10,
            }}
          >
            <button onClick={newSlapCollection}>New collection +</button>
          </div>
        </div>
      )}
    </div>
  );
};

const User = ({ id, isMe }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    request("GET", "fauna/users/find/" + id).then((asdf: any) => {
      setUser(asdf.data);
    });
  }, []);

  const content = (
    <div
      style={{
        paddingTop: 50,
      }}
      onClick={() => {}}
    >
      <TText
        style={{
          fontSize: 16,
          paddingLeft: 20,
          fontWeight: 900,
          letterSpacing: "-1px",
        }}
      >
        {user?.username}
      </TText>
    </div>
  );
  if (isMe) {
    return <Link to="/s/profile">{content}</Link>;
  }
  return content;
};

export default Sidebar;

export const Logo = () => (
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
);
