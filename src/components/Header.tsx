"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ── Configura aquí la fecha del evento ──────────────────────────────────────
const TARGET_DATE = new Date("2025-12-31T00:00:00");
const MONO = "'JetBrains Mono', 'Courier New', monospace";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Header() {
  const [time, setTime] = useState("--:--:--");
  const [days, setDays] = useState(0);
  const [hms, setHms] = useState({ h: 0, m: 0, s: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const now = new Date();
      setTime(
        `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
      );

      const diff = TARGET_DATE.getTime() - now.getTime();
      if (diff > 0) {
        setDays(Math.floor(diff / 86_400_000));
        setHms({
          h: Math.floor((diff % 86_400_000) / 3_600_000),
          m: Math.floor((diff % 3_600_000) / 60_000),
          s: Math.floor((diff % 60_000) / 1_000)
        });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35, ease: "easeOut" }}
      style={{
        fontFamily: MONO,
        borderBottom: "1px solid rgba(255,255,255,0.07)"
      }}
      className="shrink-0 flex items-center justify-between
                 px-3 py-2 md:px-6 md:py-3
                 bg-[#050505]/95 backdrop-blur-sm"
    >
      {/* ── LEFT: identity ── */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        {/* Pulse dot */}
        <motion.div
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
          className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#FF0000]"
        />
        {/* Project label */}
        <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#FF0000] truncate">
          PROJECT_27.LOG
        </span>
        {/* Operator — hidden on very small screens */}
        <span className="hidden sm:inline text-[10px] text-[#444]">|</span>
        <span className="hidden sm:inline text-[10px] text-[#555] truncate">
          OP: Andrea_dev
        </span>
      </div>

      {/* ── CENTER: countdown — compact on mobile ── */}
      <div className="flex items-center gap-1.5 mx-2 md:mx-0">
        <span className="text-[9px] md:text-[10px] text-[#444] hidden sm:inline">
          T−
        </span>

        {/* Mobile: only days */}
        <div
          className="flex sm:hidden items-center px-2 py-0.5 gap-1
                     border border-[#FF0000]/30 bg-[#FF0000]/5"
          style={{ boxShadow: "0 0 8px rgba(255,0,0,0.08)" }}
        >
          <span className="text-[11px] font-bold tabular-nums text-[#FF0000]">
            {pad(days)}
          </span>
          <span className="text-[9px] text-[#FF0000]/70">D</span>
        </div>

        {/* Desktop: full countdown */}
        <div
          className="hidden sm:flex items-center gap-1 px-3 py-1
                     border border-[#FF0000]/30 bg-[#FF0000]/5"
          style={{ boxShadow: "0 0 10px rgba(255,0,0,0.08)" }}
        >
          <span className="text-[11px] md:text-xs font-bold tabular-nums text-[#FF0000]">
            {pad(days)}
            <span className="text-[#FF0000]/50 mx-0.5">d</span>
            {pad(hms.h)}
            <span className="text-[#FF0000]/50 mx-0.5">h</span>
            {pad(hms.m)}
            <span className="text-[#FF0000]/50 mx-0.5">m</span>
            {mounted ? (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="tabular-nums"
              >
                {pad(hms.s)}
              </motion.span>
            ) : (
              pad(hms.s)
            )}
            <span className="text-[#FF0000]/50 ml-0.5">s</span>
          </span>
        </div>
      </div>

      {/* ── RIGHT: clock + status ── */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* Clock */}
        <span
          className="text-[11px] md:text-sm font-bold tabular-nums text-white"
          aria-label="System clock"
        >
          {time}
        </span>
        {/* Status badge — hidden on mobile */}
        <div className="hidden md:flex items-center gap-1.5">
          <span className="text-[9px] text-[#333]">|</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41]" />
          <span className="text-[10px] text-[#00FF41]">ALL_GO</span>
        </div>
      </div>
    </motion.header>
  );
}
