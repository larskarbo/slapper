import React, {  } from "react";
import RBButton from "react-bootstrap/Button";

export const BButton = ({ children, onPress, ...props }) => {
  if(props.onClick){
    console.warn("Please use onPress instead of onClick")
  }
  return (
  <RBButton
  variant="light"
    {...props}
    onClick={onPress || props.onClick}
    style={{
      ...props.style
    }}
  >
    {children}
  </RBButton>
)};