export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 bg-amber px-3 py-1.5 text-coal ${className}`}>
      <svg viewBox="0 0 40 24" className="h-5 w-8" aria-hidden>
        <path d="M2 20 L14 4 L20 4 L10 20Z M12 20 L24 4 L30 4 L20 20Z M22 20 L34 4 L38 4 L28 20Z" fill="currentColor" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-black italic tracking-tight">TERCELO</span>
        <span className="self-end text-[8px] font-semibold italic tracking-wide">Rolling Forward</span>
      </span>
    </span>
  );
}
