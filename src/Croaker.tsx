import React, { useState, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import KeyboardEventHandler from "react-keyboard-event-handler";
import urlParser from "js-video-url-parser";
import { request } from "./utils/request";
import { v4 as uuidv4 } from "uuid";
import Players, { PlayingNow, PlayIntent } from "./players/Players";
import { useParams, Link, Route, Switch } from "react-router-dom";
import { SlapItem } from "./SlapItem";
import { useThrottle } from "use-throttle";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { FeedbackFish } from "@feedback-fish/react";
import Authorize from "./Authorize";
import { sansSerif } from "./utils/font.tsx";
import { CleanInput, TText } from "./utils/font";

import LinkShare from "./comp/LinkShare";
import { BButton } from "./comp/BButton";
import { Helmet } from "react-helmet";

export const FOOTER_HEIGHT = 120;
const itemsForServer = (items) => {
  const forServer = JSON.parse(JSON.stringify(items));

  return forServer.map((i) => {
    delete i.state;
    delete i.position;
    return i;
  });
};

export interface Clip {
  from: number;
  to: number;
  title: string;
  id: string;
  color: string;
}

export interface Item {
  videoId?: string;
  trackId?: string;
  id: string;
  clips: Clip[];
  text: string;
  metaInfo: {
    duration: number;
    title: string;
  };
}

export default function Croaker({ spotify, loadingUser, user }) {
  // const [input, setInput] = useState("spotify:track:0bXpmJyHHYPk6QBFj25bYF")
  const { collectionId } = useParams();

  const [input, setInput] = useState(
    // "https://www.youtube.com/watch?time_continue=13&v=XUQiSBRgX7M&feature=emb_title"
    ""
  );
  const [playingNow, setPlayingNow] = useState<PlayingNow>(null);
  const [playIntent, setPlayIntent] = useState<PlayIntent>(null);

  const [items, setItems] = useState<Item[]>([]);
  const [slapUserId, setSlapUserId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const throttledItems = useThrottle(items, 1000);
  const [title, setTitle] = useState([]);
  const throttledTitle = useThrottle(title, 1000);
  const [description, setDescription] = useState([]);
  const throttledDescription = useThrottle(description, 1000);

  useEffect(() => {
    setLoaded(false);
    request("GET", "fauna/collection/" + collectionId).then((res) => {
      setItems(
        res.data.items.map((i) => {
          const newItem: Item = {
            videoId: i.videoId,
            trackId: i.trackId,
            id: i.id,
            clips: (i.clips || []).map((clip) => {
              const newClip: Clip = {
                from: clip.from,
                to: clip.to,
                title: clip.title,
                id: clip.id,
                color: clip.color,
              };
              return newClip;
            }),
            text: i.text,
            metaInfo: {
              duration: i.metaInfo?.duration,
              title: i.metaInfo?.title,
            },
          };
          return newItem;
        })
      );
      setDescription(res.data.description);
      setTitle(res.data.title);
      setSlapUserId(res.data.user);
      setLoaded(true);
    });
  }, [collectionId]);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    if (user?.id != slapUserId) {
      return;
    }
    request("PUT", "fauna/collection/" + collectionId, {
      title,
      description,
      items: itemsForServer(items),
      user: user.id,
    }).then((res) => {});
  }, [throttledItems, throttledDescription, throttledTitle]);

  const go = () => {
    let trackId;
    let parsed = urlParser.parse(input);
    const id = uuidv4();

    if (input.split(":").length == 3) {
      trackId = input.split(":")[2];
      setItems([
        ...items,
        {
          trackId,
          state: "paused",
          id,
        },
      ]);
    } else if (input.includes("https://open.spotify.com")) {
      trackId = input.split("track/")[1].split("?")[0];

      setItems([
        ...items,
        {
          trackId,
          state: "paused",
          id,
        },
      ]);
    } else if (parsed) {
      setItems([
        ...items,
        {
          videoId: parsed.id,
          state: "paused",
          id,
        },
      ]);
    } else {
      alert("couldn't parse link");
      return;
    }

    setInput("");
  };

  const play = (playable) => {
    setPlayIntent({
      ...playable,
      action: "play",
    });
  };

  const scrub = (to) => {
    setPlayIntent({
      action: "scrub",
      to: to,
    });
  };

  const pause = () => {
    setPlayIntent({
      ...playingNow,
      action: "pause",
    });
  };

  const addClip = (item, clipProps) => {
    setItems((items: Item[]) =>
      items.map((y) => {
        if (y.id == item.id) {
          const previousClips = y.clips || [];
          return {
            ...y,
            clips: [
              ...previousClips,
              {
                id: uuidv4(),
                title: "Clip",
                ...clipProps,
              },
            ].sort((a, b) => a.from - b.from),
          };
        }
        return y;
      })
    );
  };

  const deleteItem = (item) => {
    setItems((items) => items.filter((y) => y.id !== item.id));
  };

  const deleteClip = (item, clip) => {
    setItems((items: Item[]) =>
      items.map((y) => {
        if (y.id == item.id) {
          const previousClips = y.clips || [];
          return {
            ...y,
            clips: previousClips.filter((y) => y.id !== clip.id),
          };
        }
        return y;
      })
    );
  };

  const updateItem = (item, object) => {
    setItems((items) =>
      items.map((y) => {
        if (y.id == item.id) {
          return {
            ...y,
            ...object,
          };
        }
        return y;
      })
    );
  };

  const updateClip = (item, clip, object) => {
    setItems((items) =>
      items.map((y) => {
        if (y.id == item.id) {
          return {
            ...y,
            clips: y.clips
              .map((clipOld) => {
                if (clipOld.id == clip.id) {
                  return {
                    ...clipOld,
                    ...object,
                  };
                }
                return clipOld;
              })
              .sort((a, b) => a.from - b.from),
          };
        }
        return y;
      })
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          width: "100%",
          // height: "100%",
          display: "flex",
          flexDirection: "row",
          backgroundColor: "white",
          overflow: "scroll",
          height: `calc(100vh - ${FOOTER_HEIGHT}px)`,
        }}
      >
        <Helmet>
          {title.length && <title>{title} - Slapper.io</title>}
          {description.length && (
            <meta name="description" content={description} />
          )}
        </Helmet>
        <Sidebar loadingUser={loadingUser} user={user} />
        <div>
          <Switch>
            <Route exact path="/s">
              <h3>Select a collection or create one to get started.</h3>
            </Route>
            <Route path={`/s/:collectionId`}>
              <View
                style={{
                  paddingTop: 20,
                  justifyContent: "space-between",
                }}
              >
                {loaded && (
                  <View>
                    <View
                      style={{
                        paddingTop: 100,
                      }}
                    >
                      {user?.id != slapUserId && (
                        <TText style={{ color: "red" }}>
                          You don't own this slap, so it won't be saved.
                        </TText>
                      )}
                      <LinkShare
                        link={"https://slapper.io/s/" + collectionId}
                      />
                      {!spotify.credentials && items.find((i) => i.trackId) && (
                        <View
                          style={{
                            border: "1px solid black",
                            width: "fit-content",
                            padding: 10,
                          }}
                        >
                          <TText>Connect with spotify to play this Slap</TText>
                          <Authorize spotify={spotify} />
                        </View>
                      )}
                      <CleanInput
                        style={{
                          marginTop: 10,
                          paddingBottom: 20,
                          fontSize: 24,
                          fontWeight: 900,
                          color: "#313131",
                        }}
                        placeholder="Untitled"
                        value={title}
                        onChange={(value) => setTitle(value)}
                      />
                      <CleanInput
                        style={{
                          paddingBottom: 30,
                          fontSize: 16,
                        }}
                        placeholder="Description"
                        value={description}
                        onChange={(value) => setDescription(value)}
                      />

                      {items.map((item, i) => (
                        <SlapItem
                          item={item}
                          duration={item.metaInfo?.duration}
                          title={item.metaInfo?.title}
                          text={item.text}
                          key={item.videoId || item.trackId}
                          playingNow={playingNow}
                          onPause={() => pause()}
                          onPlay={play}
                          disabled={item.trackId && !spotify.credentials}
                          onScrub={scrub}
                          onSetSegment={(segment) => {
                            updateItem(item, {
                              from: segment.from,
                              to: segment.to,
                            });
                          }}
                          onSetText={(text) => updateItem(item, { text: text })}
                          onSetTitle={(title) =>
                            updateItem(item, { title: title })
                          }
                          onDeleteClip={(clip) => deleteClip(item, clip)}
                          onDeleteItem={() => deleteItem(item)}
                          onUpdateClip={(clip, whatever) =>
                            updateClip(item, clip, whatever)
                          }
                        />
                      ))}

                      <KeyboardEventHandler
                        handleKeys={["Enter"]}
                        onKeyEvent={go}
                      >
                        <CleanInput
                          style={{
                            fontSize: input.length ? 12 : 25,
                            height: 60,
                            width: 500,
                            padding: 20,
                          }}
                          placeholder="Paste youtube or spotify link here"
                          value={input}
                          onChange={(value) => setInput(value)}
                        />
                      </KeyboardEventHandler>
                      <FeedbackFish projectId="84e4f29205e0f4">
                        <BButton style={{ marginTop: 150 }}>
                          Send instant feedback ⚡
                        </BButton>
                      </FeedbackFish>
                    </View>
                  </View>
                )}
              </View>
            </Route>
          </Switch>
        </div>
      </div>
      <div
        style={{
          height: FOOTER_HEIGHT,
        }}
        className="footer"
      >
        <Footer
          playingNow={playingNow}
          items={items}
          onUpdateClip={updateClip}
          onScrub={scrub}
          onPlay={play}
          onPause={() => pause()}
          onAddClip={addClip}
          onDeleteClip={deleteClip}
        >
          <Players
            spotify={spotify}
            playingNow={playingNow}
            playIntent={playIntent}
            items={items}
            onSetMetaInfo={(item, metaInfo) =>
              updateItem(item, { metaInfo: metaInfo })
            }
            onSetPlayingNow={(pn) => setPlayingNow({ ...playingNow, ...pn })}
          />
        </Footer>
      </div>
    </div>
  );
}
