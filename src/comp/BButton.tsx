import React, {  } from "react";
import RBButton from "react-bootstrap/Button";

export const BButton = ({ children, ...props }) => (
  <RBButton
    {...props}
    variant="light"
    style={{
      ...props.style
    }}
  >
    {children}
  </RBButton>
);