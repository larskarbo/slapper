export class TimerMan {
  timer: any;
  clipRepeat: boolean;
  onPlay: () => {};
  onPause: () => {};
  [prop: string]: any

  constructor(clipRepeat, onPlay, onPause) {
    this.timer = setTimeout(() => {});
    this.clipRepeat = clipRepeat;
    this.onPlay = onPlay;
    this.onPause = onPause;
  }

  whatToDo = (playingNow, items) => {
    if (!playingNow || playingNow?.state !== "playing") {
      clearTimeout(this.timer);
      
      return;
    }

    if (playingNow.type != "clip") {
      clearTimeout(this.timer);
      
      return;
    }

    if (!playingNow?.position) {
      clearTimeout(this.timer);
      
      return;
    }

    const realClip = items
      .find((i) => playingNow.item.id == i.id)
      ?.clips.find((c) => playingNow.clip.id == c.id);

    if (!realClip) {
      // something wrong
      clearTimeout(this.timer);
      
      return;
    }

    const timeUntilPause = realClip.to - (window.guessingPosition || playingNow.position);
    
    if (timeUntilPause > 0) {
      clearTimeout(this.timer);
      this.playingNow = playingNow
      this.realClip = realClip
      this.timer = setTimeout(this.stopOrLoop, timeUntilPause);

      
    } else {
      
    }
  };

  stopOrLoop = () => {
    // if (lastId != playingNow.item.id) {
    //   clearTimeout(this.timer);
    //   
    //   return;
    // }
    if (this.clipRepeat) {
      const playable = {
        type: "clip",
        item: this.playingNow.item,
        clip: this.realClip,
      };
      this.onPlay(playable);
    } else {
      this.onPause();
    }
  };
}
