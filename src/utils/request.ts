import ky from "ky";

const BASE = `/.netlify/functions/`;

let headers = {};

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
  }).json();
}
