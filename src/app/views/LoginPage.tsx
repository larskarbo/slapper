import React, { useEffect, useRef, useState } from "react";

import { useIdentityContext } from "react-netlify-identity";
import { FaGoogle } from "react-icons/fa";
import { request } from "../utils/request";
import { navigate } from "gatsby";

export default function () {
  return (
    <div className="w-full min-h-screen h-full flex flex-col items-center justify-center bg-yellow-50">
      <h1 className="text-2xl font pb-12">
        <span className="font-bold">Slapper</span> is waiting for you
      </h1>
      <Form />

      <div className="pb-16"></div>
    </div>
  );
}

function Form({}) {
  const {
    loginUser,
    signupUser,
    loginProvider,
    user: nUser,
  } = useIdentityContext();
  console.log("nUser: ", nUser);
  const formRef = useRef();
  const [msg, setMsg] = useState("");

  const [state, setState] = useState("email");

  const onSubmit = (e) => {
    e.preventDefault();

    if (state == "login") {
      return login();
    } else if (state == "signup") {
      return signup();
    }

    console.log("formRef: ", formRef);

    request(
      "GET",
      "fauna/users/doesEmailExist/" + formRef.current.email.value
    ).then((hey: any) => {
      console.log("hey: ", hey);
      if (hey.exists) {
        setState("login");
      } else {
        setState("signup");
      }
    });
  };

  const signup = () => {
    const email = formRef.current.email.value;
    const password = formRef.current.password.value;

    signupUser(email, password)
      .then((user) => {
        console.log("Success! Signed up", user);
        setState("emailVerification");
        // navigate("/dashboard");
      })
      .catch((err) => setMsg("Error: " + err.message));
  };

  const login = () => {
    const email = formRef.current.email.value;
    const password = formRef.current.password.value;

    loginUser(email, password)
      .then((user) => {
        console.log("Success! Signed up", user);
        navigate("/app");
      })
      .catch((err) => setMsg("Error: " + err.message));
  };

  let { from } = location?.state || { from: { pathname: "/s" } };
  if (!from.pathname.includes("/s")) {
    from = { pathname: "/s" };
  }

  let content = (
    <>
      <form ref={formRef} onSubmit={onSubmit}>
        {state == "signup" && (
          <div className="font-medium mb-2">Creating a new account:</div>
        )}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-5 text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1 rounded-md shadow-sm">
            <input
              id="email"
              type="email"
              tabIndex="1"
              name="email"
              placeholder="you@domain.com"
              required=""
              className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out
                border border-gray-300 rounded-md appearance-none focus:outline-none
                focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
            />
          </div>

          {(state == "login" || state == "signup") && (
            <div className="mt-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="password"
                  type="password"
                  tabIndex="1"
                  name="password"
                  placeholder="********"
                  required=""
                  className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out
                border border-gray-300 rounded-md appearance-none focus:outline-none
                focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                />
              </div>
            </div>
          )}
        </div>
        <div className="mt-3">
          <button
            type="submit"
            className="shadow-sm w-full flex justify-center cursor-pointer py-2 px-4 border
                border-transparent text-sm font-medium rounded-md text-white bg-gray-700
                 focus:outline-none focus:border-gray-700 focus:shadow-outline-indigo active:bg-gray-700 transition duration-150 ease-in-out"
          >
            {state == "email" && "Continue"}
            {state == "login" && "Log in"}
            {state == "signup" && "Sign up"}
          </button>
        </div>
      </form>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm leading-5">
          <span className="px-2 text-gray-500 bg-white">Or</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <span className="inline-flex w-full rounded-md shadow-sm">
          <button
            onClick={() => loginProvider("google")}
            type="button"
            className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-600 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-700 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue"
          >
            <FaGoogle />
            <div className="flex-1">Sign in with Google</div>
            <div className="w-5"></div>
          </button>
        </span>
      </div>
    </>
  );

  if (state == "emailVerification") {
    content = (
      <div className="pt-4 text-sm">
        <div className="text-lg font-bold mb-2">
          Verification email is sent!
        </div>
        <div>Click the link in the email to continue to Slapper.</div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 pt-5 mx-3 bg-white rounded-lg shadow sm:w-96">
      {content}
    </div>
  );
}
