import SpotifyApi from "spotify-web-api-js";
import qs from "query-string";
import delay from "delay"

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
    this.api.setOnError(this.onError);
    // this.renewToken()
    if (this.accessToken && this.refreshToken) {
      
      this.initMe().then(() => {
        this.credentials = true;
        this.startSpotifyEngine();
      });
    }

    this.onUpdatePlaybackState = () => {};
    this.onUpdateDevices = () => {};
    this.onGood = () => {};
  }

  onError = (error) => {
    console.log('error: ', error);
    console.log("Error from spotify js")
    if(error.includes("Unknown error: Player command failed: Restriction violated")){
      console.log('oooops')
    } else {
      console["error"](error)
    }
  }

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

  estimatePosition = () => {
    
    if(this.playbackState){
      if(this.playbackState.is_playing){
        const timeSinceUpdate = new Date().getTime() - this.lastUpdatePlaybackState.getTime()
        return this.playbackState.progress_ms + timeSinceUpdate
      } else {
        return this.playbackState.progress_ms
      }
    }
  }

  pause = async () => {
    try{
      await this.api.pause()
    } catch(e){

    }
  }
	
	play = async (opts) => {
    console.log('playing')
    const playbackState = await this.api.getMyCurrentPlaybackState()
    console.log('playbackState: ', playbackState);
		if(!playbackState?.device){
			if(this.devices.length){
				
        
        let foundDevice = this.devices.find(d => !d.name.includes("Slapper"))
        if(!foundDevice){
          foundDevice = this.devices[0]
        }
        console.log('transfering device')
				await this.api.transferMyPlayback([foundDevice.id])
			}
    }
    console.log('play it')
    for(const i of [1,2,3]){
      const playbackState = await this.api.getMyCurrentPlaybackState()
      console.log('playbackState: ', playbackState);
      if(playbackState?.device){
        await this.api.play(opts);
        this.isPlaying = true;
        return
      } else {
        await delay(500)
      }
    }
    throw new Error("Couldn't play!")
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
