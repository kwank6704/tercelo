"use client";

import { useEffect, useState } from "react";

/** Live countdown to the end of the given day (Bangkok time). */
export default function Countdown({ end }: { end: string }) {
  const target = new Date(`${end}T23:59:59+07:00`).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- start the clock after mount to avoid a hydration mismatch
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const left = Math.max(0, target - (now ?? target));
  const units = [
    { v: Math.floor(left / 86400000), l: "วัน" },
    { v: Math.floor(left / 3600000) % 24, l: "ชั่วโมง" },
    { v: Math.floor(left / 60000) % 60, l: "นาที" },
    { v: Math.floor(left / 1000) % 60, l: "วินาที" },
  ];

  return (
    <div className="flex gap-2 sm:gap-3" aria-label="เวลาที่เหลือ">
      {units.map((u) => (
        <div key={u.l} className="min-w-[64px] rounded-2xl border border-line bg-card px-3 py-3 text-center sm:min-w-[84px]">
          <p className="font-display text-3xl font-black italic tabular-nums sm:text-4xl">{now === null ? "--" : String(u.v).padStart(2, "0")}</p>
          <p className="text-[11px] text-mute">{u.l}</p>
        </div>
      ))}
    </div>
  );
}
