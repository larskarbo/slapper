import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { BsFullscreen } from 'react-icons/bs';
import Bar from './Bar';
import { usePlayingNowState } from '../players/player-context';
import SegmentView from './SegmentView';

function TimelineLeg() {
  const [pointerAtRolling, setPointerAtRolling] = useState(0);
  // const [duration, setDuration] = useState(0);
  const lineRef = useRef(null);

  const { playingNow, seek } = usePlayingNowState()
  console.log('playingNow: ', playingNow);

  const onSeek = (ms) => {
    console.log('ms: ', ms);
    seek(ms)
  }

  return (
    <>
      {playingNow.item ?
      <SegmentView
        clips={playingNow.item.clips}
        duration={playingNow.item.metaInfo.duration || 0}
        pointerAt={playingNow.position.ms || 0}
        playing={playingNow.state == "playing"}
        playingNow={playingNow}
        onScrub={onSeek}
        onPlay={(clip) => {
          // const playable = {
          //   type: "clip",
          //   item: playingNow?.item,
          //   clip: clip,
          // };
          // onPlay(playable);
        }}
        onPause={() => {}}
        item={playingNow.item}
        onAddClip={() => {}}
        onDeleteClip={() => {}}
        onUpdateClip={(clip, whatever) => {
          console.log('clip: ', clip);
          // onUpdateClip(playingNow?.item, clip, whatever)
        }}
      />
      : "no"}
      {/* {playingNow &&
        <>
          <div className="w-12 text-xs flex justify-center text-gray-500 font-light"><Time playing={playingNow.state == "playing"} position={playingNow.position} /></div>
          <div ref={lineRef} className="flex relative items-center flex-grow h-full">

            {playingNow.item &&
              <Bar parent={lineRef.current} duration={playingNow.item.metaInfo.duration} value={playingNow.position?.ms || 0}
                onUp={(ms) => onSeek(ms)
                }
                isPlaying={playingNow.state == "playing"}
              />
            }

          </div>
          <div className="w-12 text-xs flex justify-center text-gray-500 font-light">{msToTime(playingNow.item?.metaInfo.duration)}</div>
        </>
      } */}
    </>
  );
}


export const msToTime = (ms) => {
  if (!ms) {
    return ""
  }
  const secondsTot = Math.round(ms / 1000)
  const minutes = Math.floor(secondsTot / 60)
  const seconds = secondsTot % 60 + ""
  return minutes + ":" + seconds.padStart(2, "0")
};

const getTime = (position) => {
  if (!position) {
    return null
  }
  const timeSinceSampling = Date.now() - position.timestamp
  return msToTime(position.ms + timeSinceSampling)
}

const Time = ({ position, playing }) => {
  const [time, setTime] = useState(getTime(position))

  useEffect(() => {
    setTime(getTime(position));
    if (playing) {
      const interval = setInterval(() => {
        setTime(getTime(position));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [position, playing]);

  return <>{time}</>
}

export default TimelineLeg;
