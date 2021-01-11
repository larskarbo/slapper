// src/playingNow-context.js
import * as React from 'react'
import Spotify from '../Spotify';
import { Item } from '../Croaker';
import { useState, useEffect } from 'react';
import { usePlayingNowState } from './players/player-context';
import { request } from './utils/request';
import { useIdentityContext } from 'react-netlify-identity';
import { generateHeaders } from './utils/request';


const UserContext = React.createContext(null)

// const spotifyOriginal = new Spotify()


export function UserProvider({ children }) {
  const {
    isConfirmedUser,
    authedFetch,
    getFreshJWT,
    user: nUser,
  } = useIdentityContext();
  console.log('nUser: ', nUser);

  const [user, setUser] = useState(null);

  const getUserFromServer = async () => {
    generateHeaders(await getFreshJWT());
    console.log("heuy")
    await request("GET", "fauna/users/getMe")
      .then((res) => {
        if (res.id) {

          setUser(res);
        } else {


          throw new Error("No res.id");
        }
      })
      .catch((error) => {
        console.log("Error with user")
      });
  };

  useEffect(() => {
    if (nUser && isConfirmedUser) {
      // setLoadingUser(false)
      getUserFromServer();
    }
  }, [nUser, isConfirmedUser]);
  
  
  return (
    <UserContext.Provider value={{user, isAuthenticated: !!nUser}}>
        {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error('usePlayingNowState must be used within a PlayingNowProvider')
  }
  return context
}