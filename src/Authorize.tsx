import React, { Component } from "react";

import connect from "./connect.png";
import qs from "qs";


const Authorize = ({ spotify }) => {
	let content

	if (!spotify.credentials) {
		content = <div>
			{/* <div style={{ fontSize: 14, marginBottom: 6 }}>Hello 👋<br/>Please connect to Spotify in order to get started. <br />PS: Spotify Premium required </div> */}
			<img
				width="200px"
				onClick={a => {
					window.open("/.netlify/functions/spotify-auth/login","_self");
				}}
				src={connect}
			></img>
		</div>
	}

	if(spotify.ready){
		return null
	}
	return (
		<div className="Authorize" style={{
			// marginBottom: 30,
			// backgroundColor: "#333333",
			// padding: 24
		}}>
			{/* {spotify.loading &&
				<div>Loading</div>
			} */}
			{content}

		</div>
	);
};

export default Authorize;
