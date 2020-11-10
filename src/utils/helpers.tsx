

export const isClipPlaying = (playingNow, clip) => (
  playingNow?.type == "clip" &&
                playingNow?.clip.id == clip.id &&
                playingNow?.state == "playing"
)