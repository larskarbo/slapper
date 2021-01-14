import React, { Component } from "react";
import { request } from "./utils/request";
import { useUser } from "./user-context";
import {loadStripe} from '@stripe/stripe-js/pure';

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

const Profile = ({ }) => {
  const { user } = useUser()

  const upgrade = () => {
    return request("POST", "money/checkout", {
      priceId: location.href.includes("localhost") ? "price_1HoUBFAtEfCrIWZMucoYP33X" : "price_1HoawrAtEfCrIWZMEehEeLtN",
    }).then(async function (result: any) {
      

      const stripe = await loadStripe(process.env.GATSBY_STRIPE_PUB_KEY);
      stripe
        .redirectToCheckout({
          sessionId: result.sessionId,
        })
        .then((res) => {
          
        });
    });
  };

  const isPremium = user.plan == "premium";

  return (
    <div>
      <div>Name: {user.name}</div>
      <div>Email: {user.email}</div>
      <div>Current plan: {user.plan || "Standard"}</div>
      <div>Last payment: {user.lastPayment ? new Date(user.lastPayment.date["@ts"]).toLocaleDateString("en-US") : "?"}</div>

      <div className="flex my-8">
        <div
          className="w-64 mr-8 bg-gray-50 border rounded p-4 border-gray-500"
        >
          <div className="font-bold">
            Standard plan
          </div>
          <div
            className="text-3xl py-3 text-gray-700"
          >
            0$
          </div>
          {standard.map((s) => (
            <div
              key={s}
              className="pb-3"
            >
              - {s}
            </div>
          ))}
          {isPremium ? (
            <form method="POST" action={"/.netlify/functions/money/customer-portal/" + user.stripeCustomerId}>
              <button className="button  bg-gray-400 hover:bg-gray-500" type="submit">Downgrade</button>
            </form>

          ) : (
              <button className="button  bg-gray-400">Current plan</button>
            )}
        </div>


        <div
          className="w-64 mr-8 bg-gray-50 border rounded p-4 border-gray-500"
        >
          <div className="font-bold">
            Premium plan
          </div>
          <div
            className="text-3xl py-3 text-gray-700"
          >
            5$/month
          </div>
          {premium.map((s) => (
            <div
              key={s}
              className="pb-3"
            >
              - {s}
            </div>
          ))}
          {isPremium ? (
            <button className="button  bg-green-500 " onClick={() => { }}>Current plan</button>
          ) : (
              <button onClick={upgrade} className="button  bg-blue-600 hover:bg-blue-700">Upgrade</button>
            )}
        </div>
      </div>

    </div>
  );
};

export default Profile;
