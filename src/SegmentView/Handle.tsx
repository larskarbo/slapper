import React, { Component } from "react";
import { PADDING_SV } from "./SegmentView";
const HANDLE_WIDTH = 7

function getPosition(e) {
  if (typeof e.touches !== "undefined") {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  } else {
    return {
      x: e.clientX,
      y: e.clientY
    };
  }
}

function getCoordinates(position, element) {
  var boundingRect = element.getBoundingClientRect();
  // use window.devicePixelRatio because if a retina screen, canvas has more pixels
  // than the getCoordinates
  var dpr = 1// typeof window !== "undefined" ? window.devicePixelRatio : 1;
  return {
    x: (position.x - boundingRect.left) * dpr,
    y: (position.y - boundingRect.top) * dpr
  };
}


class Handle extends Component {
  constructor() {
    super()
  }

  xToMS = (x) => {
    const width = this.props.parent.getBoundingClientRect().width - (PADDING_SV*2)
    return Math.round(((x - PADDING_SV) / width) * (this.props.duration))
  }

  down = (e, prop) => {
    const coords = getCoordinates(getPosition(e), this.props.parent)
    this.props.updateValue(this.xToMS(coords.x))

    this.downProp = prop
    if (this.props.onDown) {
      this.props.onDown()
    }
    window.addEventListener("mousemove", this.move)
    window.addEventListener("mouseup", this.up)
  }

  up = () => {
    window.removeEventListener("mousemove", this.move)
    window.removeEventListener("mouseup", this.up)
    if (this.props.onUp) {
      this.props.onUp()
    }
  }

  move = (e) => {
    e.preventDefault()
    const coords = getCoordinates(getPosition(e), this.props.parent)
    this.props.updateValue(this.xToMS(coords.x))
  }

  render() {
    let w
    if (!this.props.parent) {
      w = 0
    } else {
      w = this.props.parent.getBoundingClientRect().width - (PADDING_SV * 2)
    }

    const handlePos = PADDING_SV + (this.props.value / this.props.duration) * w

    // const handle_width = this.props.isHovering ? HANDLE_WIDTH : 1
    const handle_width = 30
    if(!this.props.isHovering){
      return null
    }
    return (
      <>
        <div className="handle" style={{
          height: handle_width,
          width: handle_width,
          background: this.props.color || "#898989",
          position: 'absolute',
          left: handlePos - handle_width / 2 + "px",
          // top: 45,
          zIndex: 10,
          ...(this.props.topMargin && {
            top: this.props.topMargin - handle_width/2
          }),
          opacity: 0,
          borderRadius: "100%",
          ...this.props.style
        }}
          onMouseDown={(e) => {
            this.down(e, "start")
          }}
        />
        <div className="handle" style={{
          height: 10,
          width: 10,
          background: this.props.color || "#898989",
          position: 'absolute',
          left: handlePos - 10 / 2 + "px",
          // top: 45,
          ...(this.props.topMargin && {
            top: this.props.topMargin - 10/2
          }),
          borderRadius: "100%",
          ...this.props.style
        }}
        />
      </>
    )
    
  }
};

export default Handle;
