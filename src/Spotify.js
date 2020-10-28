import SpotifyApi from "spotify-web-api-js";
import qs from "query-string";

import { PARSE_SERVER_BASE } from "./Main";
import { compare } from "js-deep-equals";

export default class Spotify {
  constructor(opts = {}) {
    this.api = new SpotifyApi();
    this.credentials = false;
    this.parseLocation();
    this.ready = false;
    this.loading = true;
    this.devices = [];
    this.me = {};
    this.playerId = null;
    this.accessToken = localStorage.getItem("spotify_a_token");
    this.refreshToken = localStorage.getItem("spotify_r_token");
    this.isPlaying = false;
		this.currentTrack = null;
    this.weAreInControl = false
    this.lastUpdatePlaybackState = null

    
    

    this.api.setAccessToken(this.accessToken);

    this.api.setOnRenew(this.renewToken);
    // this.renewToken()
    if (this.accessToken && this.refreshToken) {
      console.log('this.accessToken && this.refreshToken: ', this.accessToken, this.refreshToken);
      this.initMe().then(() => {
        this.credentials = true;
        this.startSpotifyEngine();
      });
    }

    this.onUpdatePlaybackState = () => {};
    this.onUpdateDevices = () => {};
    this.onGood = () => {};
  }

  // onError = (asdf) => {
  // 	
  // }

  initMe = async () => {
    const me = await this.api.getMe();
    
    if (me.product != "premium") {
      window.alert("Sorry, you'll need spotify premium to use FocusMonkey");
      this.logOut();
      window.location.reload();
    }
    this.me = me;
  };

  setAccessToken = (accessToken) => {
    if (accessToken == null) {
      console.log("SETTING TO NULL!! -- SETTING TO NULL!! -- SETTING TO NULL!!")
    }
    
    localStorage.setItem("spotify_a_token", accessToken);
    
    this.accessToken = accessToken;
    this.api.setAccessToken(this.accessToken);
  };

  setRefreshToken = (refreshToken) => {
    localStorage.setItem("spotify_r_token", refreshToken);
    this.refreshToken = refreshToken;
  };

  parseLocation = () => {
    const hash = qs.parse(window.location.hash);
    console.log('hash: ', hash);
    if (hash.spotify_a_token && hash.spotify_a_token.length > 10) {
      
      this.setAccessToken(hash.spotify_a_token);
      this.setRefreshToken(hash.spotify_r_token);
      window.location.hash = "";
    }
  };

  startSpotifyEngine = async () => {
    // await new Promise(r => setTimeout(r, 2000))
    // const devices = await this.s.getMyDevices()

    const initPlayer = () => {
      
      window.onSpotifyWebPlaybackSDKReady = () => {
        const token = this.accessToken;
        const player = new window.Spotify.Player({
          name: "Slapper.io",
          getOAuthToken: async (cb) => {
            cb(await this.renewToken());
          },
        });
        window.larsPlayer = player;

        // Error handling
        player.addListener("initialization_error", (error) => {
          
        });
        player.addListener("authentication_error", ({ message }) => {
          
          // this.logOut()
          // window.location.reload()
        });
        player.addListener("account_error", ({ message }) => {
          
        });
        player.addListener("playback_error", ({ message }) => {
          
        });

        // Playback status updates
        player.addListener("player_state_changed", (state) => {
          
        });

        // Ready
        player.addListener("ready", ({ device_id }) => {
          
          this.playerId = device_id;
        });

        // Not Ready
        player.addListener("not_ready", ({ device_id }) => {
          
        });

        // Connect to the player!
        player.connect();
      };
      var s = document.createElement("script");
      s.setAttribute("src", "https://sdk.scdn.co/spotify-player.js");
      document.body.appendChild(s);
    };

    const poll = async () => {
      await this.api
        .getMyCurrentPlaybackState()
        .catch((e) => {
          
        })
        .then((playbackState) => {
          this.playbackState = playbackState;
          this.lastUpdatePlaybackState = new Date()
          this.isPlaying = playbackState?.is_playing;
          this.currentTrack = playbackState?.item?.id;
          this.onUpdatePlaybackState(playbackState);
        });

      await this.api.getMyDevices().then(({ devices }) => {
        if (!compare(devices, this.devices)) {
          this.devices = devices;
          this.onUpdateDevices(devices);
        }
      });
    };

    initPlayer();
    await poll();
    setInterval(poll, 1500);
    this.ready = true;
    this.onGood();
  };

  playPauseWhatever = (allItems) => {
    if (!this.ready) {
      return;
    }
    const items = allItems.filter((i) => i.trackId); // ← only get spotify items

    if (items.every((i) => i.state == "paused")) {
      if (this.playbackState?.is_playing) {
        if(this.weAreInControl){
					this.api.pause();
				}
      }
      return;
		}
		
		this.weAreInControl = true

    if (items.filter((i) => i.state == "playing").length > 1) {
      throw new Error("You can only play one at the time!");
    }

    const playingItem = items.find((i) => i.state == "playing");

    if (!this.isPlaying) {
      // no playback, start song!
      this.play({
        uris: ["spotify:track:" + playingItem.trackId],
        position_ms: playingItem.position,
      });
      this.currentTrack = playingItem.trackId;
    }

    if (this.isPlaying) {
      // is it the same song?
      if (this.currentTrack == playingItem.trackId) {
      } else {
        this.play({
          uris: ["spotify:track:" + playingItem.trackId],
          position_ms: playingItem.position,
        });
        this.currentTrack = playingItem.trackId;
      }
    }
  };
  
  estimatePosition = () => {
    console.log('this.playbackState: ', this.playbackState);
    if(this.playbackState){
      if(this.playbackState.is_playing){
        const timeSinceUpdate = new Date().getTime() - this.lastUpdatePlaybackState.getTime()
        return this.playbackState.progress_ms + timeSinceUpdate
      } else {
        return this.playbackState.progress_ms
      }
    }
  }
	
	play = async (opts) => {
    const playbackState = await this.api.getMyCurrentPlaybackState()
		if(!playbackState?.device){
			if(this.devices.length){
				console.log('this.devices: ', this.devices);
        console.log('choose a device')
        let foundDevice = this.devices.find(d => !d.name.includes("Slapper"))
        if(!foundDevice){
          foundDevice = this.devices[0]
        }
        
				await this.api.transferMyPlayback([foundDevice.id])
			}
		}
		await this.api.play(opts);
		this.isPlaying = true;
	}

  renewToken = async () => {
    
    const query = qs.stringify({
      spotify_r_token: localStorage.getItem("spotify_r_token"),
    });
    const res = await window
      .fetch("/.netlify/functions/spotify-auth/refresh_token?" + query)
      .then((a) => a.json())
      .catch((a) => {
        
      });
    // if(!res){
    // 	// this.logOut()
    // 	return
    // }
    
    this.setAccessToken(res.spotify_a_token);
    return res.spotify_a_token;
  };

  logOut = () => {
    localStorage.removeItem("spotify_a_token");
    localStorage.removeItem("spotify_r_token");
    window.location.reload();
  };
}
