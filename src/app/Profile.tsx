import React, { Component } from "react";
import { BButton } from "./comp/BButton";
import { TText } from "./utils/font";
import netlifyIdentity from "netlify-identity-widget";
import ky from "ky";
import { BASE, request } from "./utils/request";

const standard = [
  "Up to 5 songs per slap",
  "Shareable slap links",
  "Connect with Youtube and Spotify",
];
const premium = [
  "Unlimited songs per slap",
  "First to try new features",
  "Influence new decisions",
  "++ More premium perks coming",
  "Support the development of Slapper ♥",
];

const Profile = ({ user }) => {
  console.log("user: ", user);

  const upgrade = () => {
    return request("POST", "money/checkout", {
      priceId: location.href.includes("localhost") ? "price_1HoUBFAtEfCrIWZMucoYP33X" : "price_1HoawrAtEfCrIWZMEehEeLtN",
    }).then(function (result: any) {
      console.log('result: ', result);
      // stripe
      //   .redirectToCheckout({
      //     sessionId: result.sessionId,
      //   })
      //   .then((res) => {
      //     console.log("res: ", res);
      //   });
    });
  };

  const isPremium = user.plan == "premium";

  return (
    <div
      style={{
        // marginBottom: 30,
        // backgroundColor: "#333333",
        paddingTop: 200,
      }}
    >
      <h3>Profile</h3>
      <TText>Name: {user.name}</TText>
      <TText>Email: {user.email}</TText>
      <TText>Current plan: {user.plan || "Standard"}</TText>

      <div
        style={{
          flexDirection: "row",
          paddingTop: 20,
        }}
      >
        <div
          style={{
            width: 250,
            marginRight: 30,
            backgroundColor: "#FAFAFA",
            border: "solid 1px black",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <TText
            style={{
              fontWeight: "bold",
            }}
          >
            Standard plan
          </TText>
          <TText
            style={{
              fontSize: 30,
              paddingTop: 8,
              paddingBottom: 8,
              color: "#545454",
            }}
          >
            0$
          </TText>
          {standard.map((s) => (
            <TText
              key={s}
              style={{
                paddingBottom: 10,
              }}
            >
              - {s}
            </TText>
          ))}
          {isPremium ? (
            <BButton variant="light" onPress={() => {
              alert("Still a bit early in development, but just shoot me a message on mail@larskarbo.no or DM me at Twitter, and I will fix it!")
            }}>Downgrade</BButton>
          ) : (
            <BButton variant="secondary">Current plan</BButton>
          )}
        </div>
        <div
          style={{
            width: 250,
            marginRight: 30,
            backgroundColor: "#FAFAFA",
            border: "solid 1px black",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <TText
            style={{
              fontWeight: "bold",
            }}
          >
            Premium plan
          </TText>
          <TText
            style={{
              fontSize: 30,
              paddingTop: 8,
              paddingBottom: 8,
              color: "#545454",
            }}
          >
            5$/month
          </TText>
          {premium.map((s) => (
            <TText
              key={s}
              style={{
                paddingBottom: 10,
              }}
            >
              - {s}
            </TText>
          ))}

          {isPremium ? (
            <BButton variant="secondary">Current plan</BButton>
          ) : (
            <BButton variant="primary" onClick={upgrade}>
              Upgrade
            </BButton>
          )}
        </div>
      </div>

      <BButton
        style={{
          marginTop: 25,
        }}
        onClick={() => {
          window.location.href = "/logout"
        }}
      >
        Log out
      </BButton>
    </div>
  );
};

export default Profile;
