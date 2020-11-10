import React, { useRef } from "react";
import play from "./play.svg";
import pause from "./pause.svg";

import styled from "styled-components/native";
import { ImPause2, ImVolumeMedium, ImPlay3 } from "react-icons/im";
import useHover from "@react-hook/hover";
import { DEFAULT_BLACK } from "../utils/font";

const NoButton = styled.Pressable`
  background: transparent;
  border: none;
`;

export default function Play({ playing, onPress, small=false, disabled, style }) {
  const myRef = useRef(null);
  const isHoveringHook = useHover(myRef);
  const isHovering = disabled ? false : isHoveringHook;

  const iconProps = {
    size: small ? 8 : 12,
    color: disabled ? "#5a5a5a" : DEFAULT_BLACK
  }

  return (
    <NoButton
      ref={myRef}
      onPress={onPress}
      style={{
        borderStyle: "solid",
        borderColor: isHovering ? DEFAULT_BLACK : "#5a5a5a",
        ...(disabled && {borderColor: "#5a5a5a"}),
        borderWidth: isHovering ? 2 : 1,
        borderRadius: "100%",
        width: small ? 15 : 30,
        height: small ? 15 : 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: isHovering ? "scale(1.07)" : "scale(1)",
        transition: "transform 0.1s ease",
        ...style
      }}
    >
      {isHovering && (
        <>
          {playing ? <ImPause2 {...iconProps} /> : <ImPlay3  {...iconProps} style={{marginLeft:small ? 1 :2}} />}
        </>
      )}
      {!isHovering && (
        <>
          {playing ? <ImVolumeMedium  {...iconProps} /> : <ImPlay3  {...iconProps} style={{marginLeft:small ? 1 :2}} />}
        </>
      )}
    </NoButton>
  );
}
