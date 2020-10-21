import ky from "ky";
import netlifyIdentity from "netlify-identity-widget";

const user = netlifyIdentity.currentUser();

const BASE = `/.netlify/functions/`

export default function (method, functionName, data?) {
  return generateHeaders().then((headers) => {
    return ky(BASE + functionName, {
      method: method,
      json: data,
      headers,
    }).json();
  });
}

const generateHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  if (netlifyIdentity.currentUser()) {
    return netlifyIdentity
      .currentUser()
      .jwt()
      .then((token) => {
        return { ...headers, Authorization: `Bearer ${token}` };
      });
  }
  return Promise.resolve(headers);
};
