import React, { useEffect, useState } from "react";
import { Router } from "@reach/router";
import Home from "./views/Home";
import logo from "./Slapper.svg";
import Sidebar from "./Sidebar";
import Croaker from "./Croaker";
import Footer from "./Footer";
import { PlayingNowProvider } from "./players/player-context";
import Settings from "./views/Settings";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LoginPage from "./views/LoginPage";
import Lists from "./views/Lists";
import { SlapDataProvider } from "./slapdata-context";
import { useUser } from "./user-context";
import ClipSection from "./ClipSection";
import { ClipProvider } from "./clip-context";

const FOOTER_HEIGHT = 100;

export default function App({}) {
  const { user } = useUser();

  return (
    <PlayingNowProvider>
      <SlapDataProvider>
        <ClipProvider>
          <DndProvider backend={HTML5Backend}>
            <div>
              <div className="w-full flex flex-row">
                <div
                  className="border-r flex flex-col border-gray-200 flex-shrink-0"
                  style={{
                    width: 220,
                    height: `calc(100vh - ${FOOTER_HEIGHT}px)`,
                  }}
                >
                  {user ? <Sidebar /> : null}
                </div>

                <div
                  className="flex flex-col"
                  style={{
                    height: `calc(100vh - ${FOOTER_HEIGHT}px)`,
                  }}
                >
                  <div className="flex flex-grow p-20 overflow-y-scroll">
                    {/* <h1>Home</h1> */}
                    {user ? (
                      <Router basepath="/app">
                        <Home path="/" />
                        {/* <SlapperLists path="/my-slaps" /> */}
                        <Lists path="/my-slaps" />
                        <Settings path="/settings" />
                        <Croaker type="slapper" path="/slap/:collectionId" />
                        <Croaker
                          type="spotify"
                          path="/spotify/playlist/:collectionId"
                        />
                        <NotFound default />
                      </Router>
                    ) : null}
                  </div>
                  <ClipSection />
                </div>
              </div>
              <div
                className="border-t border-gray-200"
                style={{
                  height: FOOTER_HEIGHT,
                }}
              >
                <Footer />
              </div>
            </div>
          </DndProvider>
        </ClipProvider>
      </SlapDataProvider>
    </PlayingNowProvider>
  );
}

const NotFound = () => <div>not found</div>;
