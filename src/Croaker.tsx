import React, { useState, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import KeyboardEventHandler from "react-keyboard-event-handler";
import urlParser from "js-video-url-parser";
import request from "./utils/request";
import { SpotifyFucker } from "./SpotifyFucker";
import { YoutubeFucker } from "./YoutubeFucker";
import { v4 as uuidv4 } from "uuid";
import Players from "./players/Players";
import { useParams, Link, Route } from "react-router-dom";


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
  position: number;
  state: "paused" | "playing";
  id: string;
  clips: Clip[];
  text: string;
  metaInfo: {
    duration: number;
    title: string;
  };
}

export default function Croaker({ spotify }) {
  // const [input, setInput] = useState("spotify:track:0bXpmJyHHYPk6QBFj25bYF")
  const { collection } = useParams();
  const [input, setInput] = useState(
    // "https://www.youtube.com/watch?time_continue=13&v=XUQiSBRgX7M&feature=emb_title"
    ""
  );

  const [saveCount, setSaveCount] = useState(0);

  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState([]);
  const [description, setDescription] = useState([]);

  useEffect(() => {
    
    request("GET", "fauna/" + collection).then((res) => {
      

      setItems(
        res.data.items.map((i) => {
          const newItem: Item = {
            videoId: i.videoId,
            trackId: i.trackId,
            position: 0,
            state: "paused",
            id: i.id,
            clips: (i.clips || []).map(clip => {
              const newClip: Clip = {
                from: clip.from,
                to: clip.to,
                title: clip.title,
                id: clip.id,
                color: clip.color,
              }
              return newClip
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
    });
  }, [collection]);

  useEffect(() => {
    if (saveCount == 0) {
      return;
    }
    
    request("PUT", "fauna/" + collection, {
      title,
      description,
      items: itemsForServer(items),
    }).then((res) => {
      
    });
  }, [saveCount]);

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

  const play = (s) => {
    setItems((items) =>
      items.map((y) => {
        if (y.id == s.id) {
          return {
            ...y,
            state: "playing",
          };
        }
        return {
          ...y,
          state: "paused",
        };
      })
    );
  };

  const pause = (s) => {
    setItems((items) =>
      items.map((y) => {
        if (y.id == s.id) {
          return {
            ...y,
            state: "paused",
          };
        }
        return y;
      })
    );
  };

  const addClip = (item) => {
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
                color: "#B3EBE7",
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
              if ((clipOld.id = clip.id)) {
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
    <View style={{ paddingTop: 20 }}>
      <button
        onClick={() => {
          setSaveCount(saveCount + 1);
        }}
      >
        save
      </button>
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
          onPause: () => pause(item),
          onPlay: () => play(item),
          onSetPosition: (position) => updateItem(item, { position: position }),
          onSetSegment: (segment) =>
            updateItem(item, {
              from: segment.from,
              to: segment.to,
            }),
          onSetText: (text) => updateItem(item, { text: text }),
          onSetTitle: (title) => updateItem(item, { title: title }),
          onAddClip: () => addClip(item),
          onUpdateClip: (clip, whatever) => updateClip(item, clip, whatever),
        };

        if (item.videoId) {
          return (
            <YoutubeFucker
              autoplay={false}
              key={item.videoId}
              {...commonProps}
            />
          );
        } else {
          return (
            <SpotifyFucker
              autoplay={false}
              spotify={spotify}
              key={item.trackId}
              {...commonProps}
            />
          );
        }
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

      <Players
        spotify={spotify}
        items={items}
        onSetMetaInfo={(item, metaInfo) =>
          updateItem(item, { metaInfo: metaInfo })
        }
      />
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
