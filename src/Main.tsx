import Authorize from "./Authorize";
import DeviceSelector from "./DeviceSelector";
import Spotify from "./Spotify"

import React from "react";
import Croaker from "./Croaker";

export const PARSE_SERVER_BASE = "http://localhost:1337";
// export const PARSE_SERVER_BASE = "https://server.focusmonkey.io";



class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			token: false,
			playables: [],
			noactivedevice: false,
			seconds: 0,
			running: false,
			custmusic: false,
			errored: false,
			spotify: new Spotify()
		};

		console.log('this: ', this);
		console.log('this.state.spotify: ', this.state.spotify);
		this.s = this.state.spotify.s

		this.s.setOnError(this.onError)
		console.log("this.state.token: ", this.state.token);

		this.state.spotify.onUpdateState = () => {
			// this.setState({
			// 	spotify: this.state.spotify,
			// });
		};

	}

	onError = (error) => {
		console.log(error);
		console.log("Invalid access token")
		// firebase.analytics().logEvent('api-error', {error});
		if(error.includes("Invalid access token")){
			this.state.spotify.logOut()
		} else {
			console.error("UNHANDLED ERROR:", error)
		}
	}

	componentDidMount() {

	}

	autoSetDevice = async () => {
		if (!this.state.spotify.devices.some(d => d.is_active)) {
			// no active, set first

			if(this.state.spotify.playerId){
				await this.s.transferMyPlayback([this.state.spotify.playerId])
			} else {
				await this.s.transferMyPlayback([this.state.spotify.devices[0].id])
			}
			await new Promise(r => setTimeout(r, 1000))
		}
	}

	play = async (songObj) => {
		const {uri, seek } = songObj
		console.log('uri: ', uri);
		try {
			if(uri.includes("playlist")){
				const h = await this.s.play({
					context_uri: uri,
				});
			} else if(uri.includes("track")){
				const h = await this.s.play({
					uris: [uri],
					position_ms: seek
				});
			} else {
				console.error("what", uri)
			}
		} catch (e) {
			console.log(e);
		}
	};

	render() {
		if (!this.state.spotify.ready && this.state.spotify.credentials && this.state.playables) {
			return <div size="small" theme="inverse">💠💠💠</div>
		}
		return (
			<div style={{ width: "100%", height: "100%" }}>


				{/* <Authorize spotify={this.state.spotify} /> */}

				{this.state.spotify.credentials &&
					<DeviceSelector spotify={this.state.spotify} />
				}
{/* 
				<div style={{ padding: 25 }}></div>
				<div style={{ padding: 50 }}></div>
				<div style={{ padding: 50 }}></div> */}
				<Croaker spotify={this.state.spotify} />
			</div>
		);
	}
}

export default Main;
