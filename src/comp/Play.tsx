import React, { useRef } from "react";
import play from "./play.svg";
import pause from "./pause.svg";

import styled from "styled-components/native";
import { ImPause2, ImVolumeMedium, ImPlay3 } from "react-icons/im";
import useHover from "@react-hook/hover";

const NoButton = styled.Pressable`
  background: transparent;
  border: none;
`;

export default function Play({ playing, onPress }) {
  const myRef = useRef(null);
  const isHovering = useHover(myRef);

  return (
    <NoButton
      ref={myRef}
      onPress={onPress}
      style={{
        border: "1px solid black",
        borderColor: isHovering ? "black" : "#5a5a5a",
        borderWidth: isHovering ? 2 : 1,
        borderRadius: "100%",
        width: 30,
        height: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: isHovering ? "scale(1.07)" : "scale(1)",
        transition: "transform 0.1s ease",
      }}
    >
      {isHovering && (
        <>
          {playing ? <ImPause2 /> : <ImPlay3 style={{marginLeft:2}} />}
        </>
      )}
      {!isHovering && (
        <>
          {playing ? <ImVolumeMedium /> : <ImPlay3 style={{marginLeft:2}} />}
        </>
      )}
    </NoButton>
  );
}
