import React, { Component } from "react";
import { PADDING_SV } from "./SegmentView";
import { getCoordinates, getPosition, xToMS } from "./util";




class Handle extends Component {
  constructor() {
    super()
  }


  down = (e, prop) => {
    const coords = getCoordinates(getPosition(e), this.props.parent)
    this.props.updateValue(xToMS(coords.x, this.props.duration, this.props.parent))

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
    this.props.updateValue(xToMS(coords.x, this.props.duration, this.props.parent))
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
          ...(this.props.bottomMargin && {
            bottom: this.props.bottomMargin - handle_width/2
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
          ...(this.props.bottomMargin && {
            bottom: this.props.bottomMargin - 10/2
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
