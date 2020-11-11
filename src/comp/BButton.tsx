import React, {  } from "react";
import RBButton from "react-bootstrap/Button";

export const BButton = ({ children, ...props }) => (
  <RBButton
  variant="light"
    {...props}
    style={{
      ...props.style
    }}
  >
    {children}
  </RBButton>
);