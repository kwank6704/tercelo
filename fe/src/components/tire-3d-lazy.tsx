"use client";

import dynamic from "next/dynamic";

// three.js only runs in the browser; server components import this wrapper.
const Tire3DLazy = dynamic(() => import("./tire-3d"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 animate-pulse rounded-full bg-white/[0.02]" />,
});

export default Tire3DLazy;
