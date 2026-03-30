"use client";

import { useState, useEffect } from "react";
import StreamingDrawer from "./StreamingDrawer";

const STORAGE_KEY = "ss-links-v2";

export default function MobileStreamingPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    // Small delay to let the page render first
    const timer = setTimeout(() => setOpen(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  return <StreamingDrawer isOpen={open} onClose={handleClose} />;
}
