import SpotifyApi from "spotify-web-api-js";
import qs from "query-string";
import delay from "delay"

import { compare } from "js-deep-equals";

export const NO_DEVICE_ERROR_MESSAGE = "No device connected"
export default class Spotify {
  constructor(opts = {}) {
    this.api = new SpotifyApi();
    this.credentials = false;
    this.parseLocation();
    this.ready = false;
    this.loading = true;
    this.devices = [];
    this.me = null;
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

    this.onUpdatePlaybackState = () => { };
    this.onUpdateDevices = () => { };
    this.onGood = () => { };
    this.mustOpenMenu = () => {};
  }

  onError = (error) => {
    
    
    if (error.includes("Unknown error: Player command failed: Restriction violated")) {
      
    } else {
      console["error"](error)
    }
  }

  initMe = async () => {
    const me = await this.api.getMe();

    if (me.product != "premium") {
      window.alert("Sorry, you'll need spotify premium to use Slapper");
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
          this.onUpdatePlaybackState(playbackState);
        });

    };


    initPlayer();
    await poll();
    setInterval(poll, 1500);
    await this.pollDevices();
    // setInterval(pollDevices, 10000);

    this.ready = true;
    this.onGood();
  };

  pollDevices = async () => {

    return await this.api.getMyDevices().then(({ devices }) => {
      
      this.devices = devices;
      // this.onUpdateDevices(devices);
      return devices
    });

  };

  estimatePosition = () => {

    if (this.playbackState) {
      if (this.playbackState.is_playing) {
        const timeSinceUpdate = new Date().getTime() - this.lastUpdatePlaybackState.getTime()
        return this.playbackState.progress_ms + timeSinceUpdate
      } else {
        return this.playbackState.progress_ms
      }
    }
  }

  pause = async () => {
    try {
      await this.api.pause()
    } catch (e) {

    }
  }


  play = async (opts) => {
    
    if (!this.devices.find(d => d.is_active)) {
      // const playbackState = await this.api.getMyCurrentPlaybackState()
      // 
      
      throw new Error(NO_DEVICE_ERROR_MESSAGE)
      return
    }
    
    for (const i of [1, 2, 3]) {
      const playbackState = await this.api.getMyCurrentPlaybackState()
      
      if (playbackState?.device) {
        await this.api.play(opts);
        this.isPlaying = true;
        return
      } else {
        await delay(500)
      }
    }


    const playbackState = await this.api.getMyCurrentPlaybackState()
    if (!playbackState.device) {
      
      throw new Error(NO_DEVICE_ERROR_MESSAGE)
      return
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

  authorize = () => {
    window.open("/.netlify/functions/spotify-auth/login?redirect=" + window.location.pathname, "_self");
  }

  logOut = () => {
    localStorage.removeItem("spotify_a_token");
    localStorage.removeItem("spotify_r_token");
    window.location.reload();
  };
}
