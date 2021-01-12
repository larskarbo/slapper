

export const spotifyTrackToSlapperTrack = (spotifyTrack) => {
  return {
    clips: [],
    metaInfo: {
      duration: spotifyTrack.duration_ms,
      title: spotifyTrack.name,
      artist: spotifyTrack.artists[0].name,
      image: spotifyTrack.album.images[2].url,
    },
    type: "spotify",
    trackId: spotifyTrack.id,
  }

}