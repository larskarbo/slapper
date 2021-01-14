import React, { useEffect, useRef, useState } from "react";
import netlifyIdentity from "netlify-identity-widget";

import { TText } from "../utils/font";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import { FaGoogle, FaUser } from "react-icons/fa";
import { request } from "../utils/request";
import { Redirect } from '@reach/router';
import { useUser } from "../user-context";
import { navigate } from "gatsby";

export default function ({ }) {
  const formRef = useRef();
  const [msg, setMsg] = useState("");
  const { user, isAuthenticated } = useUser()

  if(!isAuthenticated){
    navigate("/app/login")
  }

  if(user?.userName){
    navigate("/app/")
  }

  const continueToSlapper = () => {
    const username = formRef.current.username.value;
    const emailUpdates = formRef.current.emailUpdates.value;
    console.log('username: ', username);
    if (username.length < 4) {
      return alert("Please have at least 4 letters in your username")
    }
    // const password = formRef.current.password.value;

    request("POST", "fauna/users/setMe", {
      username: username,
      emailUpdates: emailUpdates,
    })
      .then((user: any) => {
        console.log("Success! Signed up", user);
        navigate("/app")
      })
      .catch((err) => {
        if (err.message.includes("instance not unique")) {
          setMsg("Username not available, please choose something else")
        } else {
          setMsg("Error: " + err.message)
        }
      });
  };

  return (

    <div className="w-full min-h-screen h-full flex flex-col items-center justify-center bg-yellow-50">
      <h1 className="text-2xl font pb-12">
        Just one more step...
      </h1>
      <div className="w-full px-4 py-8 pt-5 mx-3 bg-white rounded-lg shadow sm:w-96">
        {msg && (
          <div className="text-red-500 mb-3"
          >
            {msg}
          </div>
        )}
        <form ref={formRef} onSubmit={(e) => {
          e.preventDefault()
          continueToSlapper()
        }}>
          <label
            htmlFor="username"
            className="block text-sm font-medium leading-5 text-gray-700"
          >
            Choose a username:
          </label>
          <div className="mt-1 rounded-md shadow-sm">
            <input
              id="username"
              type="text"
              tabIndex="1"
              name="username"
              placeholder=""
              required=""
              className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out
                border border-gray-300 rounded-md appearance-none focus:outline-none
                focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
            />
          </div>

          <label className="flex items-center pb-2 my-2">
            <input type="checkbox" name="emailUpdates" className="rounded" />
            <span className="ml-2">
            Receive occasional updates about Slapper
            </span>
          </label>


            <button
            type="submit"
            className="shadow-sm w-full flex justify-center cursor-pointer py-2 px-4 border
                border-transparent text-sm font-medium rounded-md text-white bg-gray-700
                 focus:outline-none focus:border-gray-700 focus:shadow-outline-indigo active:bg-gray-700 transition duration-150 ease-in-out"
          >
            Continue to Slapper
          </button>
        </form>
      </div>


      <div className="pb-16"></div>
    </div>

  );
}
