import React, { useEffect, useRef, useState } from "react";

import { TText } from "../utils/font";
import { request } from "../utils/request";

export default function ({ user }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user) {
      request("GET", "fauna/users/allUsers")
        .then((res:any) => {
          console.log("res: ", res);
          setUsers(
            res.map((r) => ({
              ...r.data,
              id: r.ref["@ref"].id,
            }))
          );
        })
        .catch((error) => {
          console["error"]("error: ", error);
        });
    }
  }, [user]);

  if (!user || user.username != "larskarbo") {
    return <TText>Forbidden</TText>;
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
            maxWidth: 800,
            width: "100%",
            padding: 25,
            backgroundColor: "white",
            borderRadius: 10,
            boxShadow:
              "0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06)",
          }}
        >
          <table>
            {users.map((u) => (
              <User key={u.id} user={u} />
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}

const User = ({ user }) => {
  const [slaps, setSlaps] = useState(null);

  useEffect(() => {
    if (user) {
      request("GET", "fauna/collectionsByUser/" + user.username)
        .then((res:any) => {
          console.log("res: ", res);
          setSlaps(
            res.map((r) => ({
              ...r.data,
              id: r.ref["@ref"].id,
            }))
          );
        })
        .catch((error) => {
          console["error"]("error: ", error);
        });
    }
  }, [user]);

  return (
    <tr>
      <td>
        <TText>{user.username}</TText>
      </td>
      <td>
        <TText>{user.email}</TText>
      </td>
      <td>
        <TText>{user.emailUpdates ? "email✅" : "👻"}</TText>
      </td>
      <td>
        <TText>{slaps?.length}</TText>
      </td>
    </tr>
  );
};
