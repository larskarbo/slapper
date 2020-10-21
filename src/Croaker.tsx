import React, { useState, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import KeyboardEventHandler from "react-keyboard-event-handler";
import urlParser from "js-video-url-parser";
import request from "./utils/request";
import { SpotifyFucker } from "./SpotifyFucker";
import { YoutubeFucker } from "./YoutubeFucker";
import { v4 as uuidv4 } from 'uuid';

const itemsForServer = (items) => {
  const forServer = JSON.parse(JSON.stringify(items))

  
  return forServer.map(i => {
    delete i.state
    delete i.position
    return i
  })
}

export default function Croaker({ spotify, slap }) {
  // const [input, setInput] = useState("spotify:track:0bXpmJyHHYPk6QBFj25bYF")
  const [input, setInput] = useState(
    // "https://www.youtube.com/watch?time_continue=13&v=XUQiSBRgX7M&feature=emb_title"
    ""
  );

  const [saveCount, setSaveCount] = useState(0);

  const [items, setItems] = useState([]);
  const [title, setTitle] = useState([]);
  const [description, setDescription] = useState([]);

  useEffect(() => {
    console.log("slap.id: ", slap.id);
    request("GET", "fauna/" + slap.id).then((res) => {
      console.log("res: ", res);

      setItems(res.data.items.map(i => {
        return {
          ...i,
          state: "paused",
          position: i.from ? i.from : 0,
          id: uuidv4()
        }
      }));
      setDescription(res.data.description);
      setTitle(res.data.title);
    });
  }, [slap.id]);

  useEffect(() => {
    if (saveCount == 0) {
      return;
    }
    console.log("save!");
    request("PUT", "fauna/" + slap.id, {
      title,
      description,
      items: itemsForServer(items),
    }).then((res) => {
      console.log("res: ", res);
    });
  }, [saveCount]);

  useEffect(() => spotify.playPauseWhatever(items), [items])

  const go = () => {
    let trackId;
    let parsed = urlParser.parse(input);
    const id = uuidv4()

    if (input.split(":").length == 3) {
      trackId = input.split(":")[2];
      setItems([
        ...items,
        {
          trackId,
          state: "paused",
          id
        },
      ]);
    } else if (input.includes("https://open.spotify.com")) {
      trackId = input.split("track/")[1].split("?")[0];
      console.log("trackId: ", trackId);
      setItems([
        ...items,
        {
          trackId,
          state: "paused",
          id
        },
      ]);
    } else if (parsed) {
      setItems([
        ...items,
        {
          videoId: parsed.id,
          state: "paused",
          id
        },
      ]);
    } else {
      alert("couldn't parse link");
      return;
    }

    setInput("");
  };

  const play = (s) => {
    setItems(items =>
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
    setItems(items =>
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

  const setSegment = (s, segment) => {
    setItems(items =>
      items.map((y) => {
        if (y.id == s.id) {
          return {
            ...y,
            from: segment.from,
            to: segment.to,
          };
        }
        return y;
      })
    );
  };

  const setPosition = (s, position) => {
    setItems(items =>
      items.map((y) => {
        if (y.id == s.id) {
          return {
            ...y,
            position
          };
        }
        return y;
      })
    );
  };

  const onSetText = (s, text) => {
    setItems(items =>
      items.map((y) => {
        if (y.id == s.id) {
          return {
            ...y,
            text: text,
          };
        }
        return y;
      })
    );
  };

  return (
    <View style={{paddingTop:20}}>
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
      {items
        .filter((i) => i.videoId)
        .map((s, i) => (
          <YoutubeFucker
            autoplay={false}
            key={s.videoId}
            s={s}
            onPause={() => pause(s)}
            onPlay={() => play(s)}
            setSegment={(segment) => setSegment(s, segment)}
            onSetText={(text) => onSetText(s, text)}
          />
        ))}
      {items
        .filter((i) => i.trackId)
        .map((s) => (
          <SpotifyFucker
            autoplay={false}
            spotify={spotify}
            key={s.trackId}
            s={s}
            onPause={() => pause(s)}
            onPlay={() => play(s)}
            setPosition={(position) => setPosition(s, position)}
            setSegment={(segment) => setSegment(s, segment)}
            onSetText={(text) => onSetText(s, text)}
          />
        ))}

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

      {/* <Players /> */}
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
