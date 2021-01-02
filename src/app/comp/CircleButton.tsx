import React, { useRef } from "react";
import play from "./play.svg";
import pause from "./pause.svg";

import styled from "styled-components";
import { ImPause2, ImVolumeMedium, ImPlay3 } from "react-icons/im";
import useHover from "@react-hook/hover";
import { DEFAULT_BLACK } from "../utils/font";

const NoButton = styled.button`
  background: transparent;
  border: none;
`;

export default function CircleButton({ children, Icon, onPress, small=false, disabled, style, inverted=false }) {
  const myRef = useRef(null);
  const isHovering = disabled ? false : useHover(myRef);

  const iconProps = {
    size: small ? 8 : 12,
    color: disabled ? "#5a5a5a" : DEFAULT_BLACK
  }

  if(inverted){
    iconProps.color = "white"
  }

  return (
    <NoButton
      ref={myRef}
      onPress={onPress}
      style={{
        borderStyle: "solid",
        borderColor: isHovering ? DEFAULT_BLACK : "#5a5a5a",
        ...(disabled && {borderColor: "#5a5a5a"}),
        ...(inverted && {backgroundColor: DEFAULT_BLACK}),
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
      <Icon {...iconProps} />
    </NoButton>
  );
}
