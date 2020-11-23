import React, {  } from "react";
import RBButton from "react-bootstrap/Button";

export const BButton = ({ variant, children, onPress, ...props }) => {
  if(props.onClick){
    console.warn("Please use onPress instead of onClick")
  }
  const _variant = variant || "light"
  return (
  <RBButton
    {...props}
    variant={_variant}
    onClick={onPress || props.onClick}
    style={{
      ...props.style,
      ...(_variant == "light" && {
        border: "1px solid cadetblue"
      })
    }}
  >
    {children}
  </RBButton>
)};