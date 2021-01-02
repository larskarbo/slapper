import React, {  } from "react";


export const sansSerif = {
  fontFamily:`-apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, Oxygen-Sans, Ubuntu, Cantarell,
  "Helvetica Neue", sans-serif`
}


export const CleanInput = ({ style,onChange, ...props }) => (
  <input
    {...props}
    style={{
      outline: "none",
      borderWidth: 0,
      width:"100%",
      ...sansSerif,
      ...style,
    }}
    type="text"
    onChange={(e) => onChange(e.target.value)}
  />
);

export const DEFAULT_BLACK = "#171717"

export const TText = ({ children, ...props }) => (
  <span
    // {...props}
    style={{
      ...sansSerif,
      color: "#171717",
      ...props.style
    }}
  >
    {children}
  </span>
);



