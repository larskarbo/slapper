import React from "react";
import play from "./play.svg";
import pause from "./pause.svg";

import styled from 'styled-components/native'

const NoButton = styled.Pressable`
  background: transparent;
  border: none;
`

export default function Play({playing, onPress}) {
  return (
    <NoButton onPress={onPress}>
      {playing ? 
        <img src={pause} style={{
          width: "32px"
        }} />:
      <img src={play} style={{
        width: "32px"
      }} />
    }
      
    </NoButton>
  );
}
