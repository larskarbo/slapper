import React, { useState, useEffect, useRef, useCallback } from "react";
import { useClip } from "./clip-context";



export default function ClipSection({ }) {
  const { clipNow } = useClip()
  console.log('clipNow: ', clipNow);

  return (
    <>
      {clipNow &&

        <div className="flex-shrink-0 w-full h-32 bg-red-800">
          {clipNow.clip.title}
        </div>
      }
    </>
  )
}
