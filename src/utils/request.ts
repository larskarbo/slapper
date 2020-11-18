import ky from "ky";

export const BASE = `/.netlify/functions/`;
import Constants from 'expo-constants';
console.log('Constants: ', Constants);

let headers = {};

export const stripe = window.Stripe(Constants.manifest.extra.STRIPE_PUB_KEY)

export function generateHeaders(nUser) {
  return nUser
    .jwt()
    .then((token) => {
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
    });
}

export function request(method, functionName, data?) {
  return ky(BASE + functionName, {
    method: method,
    json: data,
    headers,
  }).json()
  .catch(async error => {
  
    throw new Error(error.response.status + ": " + error.message + " " + (await error.response.json())?.error?.message);

  })
}
