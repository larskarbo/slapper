import React, { useEffect, useState } from "react";
import { Router } from "@reach/router"
import Home from "./views/Home";
import logo from "./Slapper.svg"
import Sidebar from "./Sidebar";
import Croaker from "./Croaker";
import Footer from "./Footer";
import { PlayingNowProvider } from "./players/player-context";
import Settings from './views/Settings';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import LoginPage from "./views/LoginPage";
import Lists from "./views/Lists";
import { SlapDataProvider } from './slapdata-context';
import { useUser } from './user-context';

const FOOTER_HEIGHT = 100

export default function App({  }) {
  const user = useUser()
  return (
    <PlayingNowProvider>
      <SlapDataProvider>
        <DndProvider backend={HTML5Backend}>
          <div>
            <div className="w-full flex flex-row">
              <div className="border-r border-gray-200 flex-shrink-0 overflow-y-scroll" style={{
                width: 220,
                height: `calc(100vh - ${FOOTER_HEIGHT}px)`,
                paddingBottom: FOOTER_HEIGHT
              }}>
                {user ?
                  <Sidebar /> : null
                }
              </div>
              <div className="flex flex-grow p-20 overflow-y-scroll" style={{
                height: `calc(100vh - ${FOOTER_HEIGHT}px)`,
                paddingBottom: FOOTER_HEIGHT
              }}>
                {/* <h1>Home</h1> */}
                {user ?
                  <Router basepath="/app">
                    <Home path="/" />
                    {/* <SlapperLists path="/my-slaps" /> */}
                    <Lists path="/my-slaps" />
                    <Settings path="/settings" />
                    <Croaker type="slapper" path="/slap/:collectionId" />
                    <Croaker type="spotify" path="/spotify/playlist/:collectionId" />
                    <NotFound default />
                  </Router>
                  : null
                }

              </div>
            </div>
            <div className="border-t border-gray-200" style={{
              height: FOOTER_HEIGHT
            }}>
              <Footer />
            </div>
          </div>

        </DndProvider>
      </SlapDataProvider>
    </PlayingNowProvider>
  );
}

const NotFound = () => <div>not found</div>