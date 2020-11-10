import { Text } from "react-native";
import React, {  } from "react";


export const sansSerif = {
  fontFamily:`-apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, Oxygen-Sans, Ubuntu, Cantarell,
  "Helvetica Neue", sans-serif`
}


export const CleanInput = ({ style, ...props }) => (
  <input
    {...props}
    style={{
      outline: "none",
      borderWidth: 0,
      ...sansSerif,
      ...style,
    }}
    type="text"
  />
);

export const DEFAULT_BLACK = "#171717"

export const TText = ({ children, ...props }) => (
  <Text
    // {...props}
    style={{
      ...sansSerif,
      color: "#171717",
      ...props.style
    }}
  >
    {children}
  </Text>
);


