

import SpotifyApi from "spotify-web-api-js";
import qs from "query-string";

import { PARSE_SERVER_BASE } from "./Main"
import { compare } from "js-deep-equals";




export default class Spotify {

	constructor(opts = {}) {
		this.api = new SpotifyApi()
		this.credentials = false
		this.parseLocation()
		this.ready = false
		this.loading = true
		this.devices = []
		this.me = {}
		this.playerId = null
		this.accessToken = localStorage.getItem("access_token");
		this.refreshToken = localStorage.getItem("refresh_token");
		this.isPlaying = false
		this.currentTrack = null

		console.log('this.accessToken: ', this.accessToken);
		console.log('this.refreshToken: ', this.refreshToken);

		this.api.setAccessToken(this.accessToken);

		this.api.setOnRenew(this.renewToken)
		// this.renewToken()
		if (this.accessToken && this.refreshToken) {
			this.initMe()
				.then(() => {
					this.credentials = true
					this.startSpotifyEngine()
				})
		}

		this.onUpdatePlaybackState = () => { }
		this.onUpdateDevices = () => { }
		this.onGood = () => { }
	}

	// onError = (asdf) => {
	// 	console.error('Unhandled error: ', asdf);
	// }

	initMe = async () => {
		const me = await this.api.getMe();
		console.log("me: ", me);
		if (me.product != "premium") {
			window.alert("Sorry, you'll need spotify premium to use FocusMonkey")
			this.logOut()
			window.location.reload()
		}
		this.me = me
	}

	setAccessToken = (accessToken) => {
		if (accessToken == null) {
			console.log('NOOOOOOOOOOOOOOOOO')
		}
		console.log('setting accessToken: ', accessToken);
		localStorage.setItem("access_token", accessToken);
		console.log("👌", localStorage.getItem("access_token"))
		this.accessToken = accessToken
		this.api.setAccessToken(this.accessToken);
	}

	setRefreshToken = (refreshToken) => {
		localStorage.setItem("refresh_token", refreshToken);
		this.refreshToken = refreshToken
	}

	parseLocation = () => {
		const hash = qs.parse(window.location.hash)
		if (hash.access_token && hash.access_token.length > 10) {
			console.log('hash.access_token: ');
			this.setAccessToken(hash.access_token)
			this.setRefreshToken(hash.refresh_token)
			window.location.hash = '';
		}
	}

	startSpotifyEngine = async () => {

		// await new Promise(r => setTimeout(r, 2000))
		// const devices = await this.s.getMyDevices()

		const initPlayer = () => {
			console.log('initing onSpo.')
			window.onSpotifyWebPlaybackSDKReady = () => {
				const token = this.accessToken;
				const player = new window.Spotify.Player({
					name: 'Slapper.io',
					getOAuthToken: async cb => {
						cb(await this.renewToken());
					}
				});
				window.larsPlayer = player

				// Error handling
				player.addListener('initialization_error', (error) => { console.error(error, error.message); });
				player.addListener('authentication_error', ({ message }) => {
					console.error('message: ', message);
					// this.logOut()
					// window.location.reload()
				});
				player.addListener('account_error', ({ message }) => { console.error(message); });
				player.addListener('playback_error', ({ message }) => { console.error(message); });

				// Playback status updates
				player.addListener('player_state_changed', state => { console.log(state); });

				// Ready
				player.addListener('ready', ({ device_id }) => {
					console.log('Ready with Device ID', device_id);
					this.playerId = device_id

				});

				// Not Ready
				player.addListener('not_ready', ({ device_id }) => {
					console.log('Device ID has gone offline', device_id);
				});

				// Connect to the player!
				player.connect();
			};
			var s = document.createElement('script');
			s.setAttribute('src', "https://sdk.scdn.co/spotify-player.js");
			document.body.appendChild(s);
		}

		const poll = async () => {
			await this.api
				.getMyCurrentPlaybackState()
				.catch(e => {
					console.error("e: ", e.response);
				})
				.then(playbackState => {
					this.playbackState = playbackState
					this.isPlaying = playbackState.is_playing
					this.currentTrack = playbackState?.item?.id
					this.onUpdatePlaybackState(playbackState)
				})

			await this.api
				.getMyDevices()
				.then(({ devices }) => {
					if (!compare(devices, this.devices)) {
						this.devices = devices
						this.onUpdateDevices(devices)
					}
				});


		}

		initPlayer()
		await poll()
		setInterval(poll, 1500)
		this.ready = true
		this.onGood()

	};

	playPauseWhatever = (allItems) => {
		if (!this.ready) {
			return
		}
		const items = allItems.filter(i => i.trackId) // ← only get spotify items

		if (items.every(i => i.state == "paused")) {

			if (this.playbackState.is_playing) {
				console.log('need to pause')
				this.api.pause()
			}
			return
		}


		if (items.filter(i => i.state == "playing").length > 1) {
			throw new Error("You can only play one at the time!")
		}

		const playingItem = items.find(i => i.state == "playing")

		if (!this.isPlaying) {
			// no playback, start song!
			this.api.play({
				uris: ["spotify:track:" + playingItem.trackId],
				position_ms: playingItem.position
			});
			this.isPlaying = true
			this.currentTrack = playingItem.trackId
		}

		if (this.isPlaying) {
			// is it the same song?
			if (this.currentTrack == playingItem.trackId) {
			} else {
				this.api.play({
					uris: ["spotify:track:" + playingItem.trackId],
					position_ms: playingItem.position
				});
				this.isPlaying = false
				this.currentTrack = playingItem.trackId
			}
		}

	}



	renewToken = async () => {
		console.log('renewing token')
		const query = qs.stringify({
			refresh_token: localStorage.getItem("refresh_token")
		});
		const res = await window
			.fetch(PARSE_SERVER_BASE + "/refresh_token?" + query)
			.then(a => a.json())
			.catch(a => {
				console.log('Errror', a)
			})
		// if(!res){
		// 	// this.logOut()
		// 	return
		// }
		console.log('res: ', res);
		this.setAccessToken(res.access_token)
		return res.access_token
	};

	logOut = () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		window.location.reload()
	};
}
