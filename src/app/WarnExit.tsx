import React, { useEffect, useState } from "react";
import { useSlapData } from "./slapdata-context";

const handleBeforeunload = (evt) => {
  evt.preventDefault()
  evt.returnValue = "You have unsaved changes"
}

export default function WarnExit({ }) {
  const { dirtySlaps } = useSlapData()
  useEffect(() => {
    if (Object.values(dirtySlaps).some(Boolean)) {
      window.addEventListener('beforeunload', handleBeforeunload);
      return () => window.removeEventListener('beforeunload', handleBeforeunload)
    }
  }, [dirtySlaps])

  return (
    null
  );
}

const NotFound = () => <div>not found</div>;
