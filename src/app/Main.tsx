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
import Lists from "./views/Lists";
import { SlapDataProvider } from "./slapdata-context";
import { useUser } from "./user-context";
import ClipSection from "./ClipSection";
import { ClipProvider } from "./clip-context";
import { PrivateRoute } from "../pages/app";
import WarnExit from './WarnExit';
import Feedback from './Feedback';
import { YoutubeProvider } from './youtube-context';
import { YoutubeBox } from './players/YoutubeBox';
import { navigate } from "gatsby";

const FOOTER_HEIGHT = 100;

export default function App({ }) {
  const { user } = useUser();

  if(user && !user.username){
    navigate("/app/onboarding")
  }

  return (
    <YoutubeProvider>
      <PlayingNowProvider>
        <SlapDataProvider>
          <ClipProvider>
            <DndProvider backend={HTML5Backend}>
              <div>
                <div className="w-full flex flex-row">
                  <WarnExit />
                  <div
                    className="border-r flex flex-col border-gray-200 flex-shrink-0"
                    style={{
                      width: 260,
                      height: `calc(100vh - ${FOOTER_HEIGHT}px)`,
                    }}
                  >
                    <Sidebar />
                  </div>

                  <div
                    className="flex flex-col"
                    style={{
                      height: `calc(100vh - ${FOOTER_HEIGHT}px)`,
                    }}
                  >
                    <div className="flex flex-grow p-20 overflow-y-scroll">
                      {/* <h1>Home</h1> */}
                      <Router basepath="/app">
                        <Home path="/" />
                        {/* <Feedback path="/feedback" /> */}
                        {/* <SlapperLists path="/my-slaps" /> */}
                        <PrivateRoute component={Lists} path="/my-slaps" />
                        <PrivateRoute component={Settings} path="/settings" />
                        <Croaker listType="slapper" path="/slap/:slapId" />
                        <Croaker
                          listType="spotify"
                          path="/spotify/playlist/:slapId"
                        />
                        <NotFound default />
                      </Router>
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
                <YoutubeBox />
              </div>
            </DndProvider>
          </ClipProvider>
        </SlapDataProvider>
      </PlayingNowProvider>
    </YoutubeProvider>
  );
}

const NotFound = () => <div>not found</div>;
