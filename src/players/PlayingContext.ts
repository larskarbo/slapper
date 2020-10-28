import { createContext } from 'react'

const PlayingContext = createContext({
  state: "",
  play: () => {},
  pause: () => {}
})

export default PlayingContext