import React, { useState, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import KeyboardEventHandler from "react-keyboard-event-handler";
import urlParser from "js-video-url-parser";
import { request } from "./utils/request";
import { v4 as uuidv4 } from "uuid";
import Players from "./players/Players";
import { useParams, Link, Route } from "react-router-dom";
import { SlapItem } from "./SlapItem";

import { useThrottle } from "use-throttle";

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

export default function Croaker({ spotify, user }) {
  // const [input, setInput] = useState("spotify:track:0bXpmJyHHYPk6QBFj25bYF")
  const { collectionId } = useParams();

  const [input, setInput] = useState(
    // "https://www.youtube.com/watch?time_continue=13&v=XUQiSBRgX7M&feature=emb_title"
    ""
  );
  const [playingNow, setPlayingNow] = useState(null);

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
    setPlayingNow({
      ...playingNow,
      ...playable,
      action: "wantToPlay",
      clientUpdate: Math.random(),
    });
  };

  const scrub = (to) => {
    setPlayingNow({
      ...playingNow,
      scrub: to,
    });
  };

  const pause = () => {
    setPlayingNow({
      ...playingNow,
      action: "wantToPause",
      clientUpdate: Math.random(),
    });
  };

  const addClip = (item) => {
    const colors = ["#B3EBE7", "#EDB7C4", "#E2EDB7"];
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
                color: colors[previousClips.length],
                from: 10000,
                to: 20000,
              },
            ],
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
            clips: y.clips.map((clipOld) => {
              if (clipOld.id == clip.id) {
                return {
                  ...clipOld,
                  ...object,
                };
              }
              return clipOld;
            }),
          };
        }
        return y;
      })
    );
  };

  return (
    <View
      style={{
        paddingTop: 20,
        height: "100vh",
        maxHeight: "100vh",
        justifyContent: "space-between",
      }}
    >
      {loaded && (
        <>
          <View style={{ overflow: "scroll", height: "calc(100vh - 200px)" }}>
            {user?.id != slapUserId && (
              <Text style={{ color: "red" }}>
                You don't own this slap, so it won't be saved.
              </Text>
            )}
            <CleanInput
              style={{
                paddingBottom: 20,
                paddingTop: 100,
                fontSize: 20,
              }}
              placeholder="Untitled"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Text
              style={{
                paddingBottom: 10,
                paddingTop: 0,
                fontSize: 13,
                maxWidth: 400,
                // fontWeight: 200,
              }}
            >
              {description}
            </Text>

            {items.map((item, i) => {
              const commonProps = {
                item: item,
                playingNow: playingNow,
                onPause: () => pause(),
                onPlay: play,
                onScrub: scrub,
                onSetSegment: (segment) =>
                  updateItem(item, {
                    from: segment.from,
                    to: segment.to,
                  }),
                onSetText: (text) => updateItem(item, { text: text }),
                onSetTitle: (title) => updateItem(item, { title: title }),
                onAddClip: () => addClip(item),
                onUpdateClip: (clip, whatever) =>
                  updateClip(item, clip, whatever),
              };

              return (
                <SlapItem
                  item={item}
                  duration={item.metaInfo?.duration}
                  title={item.metaInfo?.title}
                  text={item.text}
                  key={item.videoId || item.trackId}
                  {...commonProps}
                />
              );
            })}

            {/* <Splat
        title="test song"
        duration={50000}
        pointerAt={20000}
        playing={true}
        loading={false}
      >
        <Text>Image</Text>
      </Splat> */}

            <KeyboardEventHandler handleKeys={["Enter"]} onKeyEvent={go}>
              <CleanInput
                style={{
                  fontSize: input.length ? 12 : 25,
                  height: 60,
                  width: 500,
                  padding: 20,
                }}
                placeholder="Paste youtube or spotify link here"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </KeyboardEventHandler>
          </View>
          <View style={{ height: 200 }}>
            <Players
              spotify={spotify}
              playingNow={playingNow}
              items={items}
              onSetMetaInfo={(item, metaInfo) =>
                updateItem(item, { metaInfo: metaInfo })
              }
              onSetPlayingNow={(pn) => setPlayingNow({ ...playingNow, ...pn })}
            />
          </View>
        </>
      )}
    </View>
  );
}

const CleanInput = ({ style, ...props }) => (
  <input
    {...props}
    style={{
      outline: "none",
      borderWidth: 0,
      ...style,
    }}
    type="text"
  />
);
