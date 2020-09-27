import React, { useState, useEffect } from 'react';
import { View } from 'react-native';


export default class Players extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {

    return (
      <View style={{
        paddingTop: 200
      }}>
        <div>Players:</div>
        <div style={{ display: 'flex' }}>
          <Spotify />
          <Youtube />
        </div>

      </View>
    );
  }

}


const Spotify = ({ }) => {

  return (
    <div>

      spotify
    </div>
  )
}

const Youtube = ({ }) => {

  return (
    <div>

      youtube
    </div>
  )
}