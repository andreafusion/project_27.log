"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Config ──────────────────────────────────────────────────────────────────
const ACTIVE_DAY = 1;
const TOTAL_DAYS = 27;
const MONO = "'JetBrains Mono', 'Courier New', monospace";

/** Milestone labels shown inside key day cells */
const MILESTONES: Record<number, string> = {
  1: "INIT",
  5: "AUDIT",
  9: "DEPLOY",
  14: "PIVOT",
  18: "SCALE",
  22: "REFINE",
  27: "IGNITE"
};

// ── Lockpad SVG ─────────────────────────────────────────────────────────────
function LockIcon() {
  return (
    <svg
      width="9"
      height="11"
      viewBox="0 0 9 11"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="1"
        y="4.5"
        width="7"
        height="6"
        rx="0.6"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="0.9"
      />
      <path
        d="M2.5 4.5V3.2a2 2 0 014 0v1.3"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="0.9"
      />
    </svg>
  );
}

// ── DayCard ──────────────────────────────────────────────────────────────────
interface DayCardProps {
  day: number;
  isActive: boolean;
  isLocked: boolean;
  index: number;
}

function DayCard({ day, isActive, isLocked, index }: DayCardProps) {
  const [pressed, setPressed] = useState(false);
  const label = MILESTONES[day];

  // Stagger entrance — faster on mobile (keep delays short)
  const entryDelay = index * 0.018;

  return (
    <motion.div
      // Entrance
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: entryDelay, duration: 0.22, ease: "easeOut" }}
      // Touch feedback via whileTap (Framer) + manual state for border
      whileTap={!isLocked ? { scale: 0.93 } : {}}
      onTapStart={() => setPressed(true)}
      onTap={() => setTimeout(() => setPressed(false), 180)}
      onTapCancel={() => setPressed(false)}
      // Accessibility
      role={isActive ? "status" : "listitem"}
      aria-label={`Day ${day}${isActive ? " — active" : isLocked ? " — locked" : ""}`}
      className="relative flex flex-col items-center justify-center
                 select-none touch-manipulation"
      style={{
        aspectRatio: "1 / 1",
        fontFamily: MONO,
        // Border: red when active or pressed-unlocked, else subtle
        border: isActive
          ? "1px solid #FF0000"
          : pressed && !isLocked
            ? "1px solid rgba(255,0,0,0.7)"
            : "1px solid rgba(255,255,255,0.07)",
        background: isActive
          ? "rgba(255,0,0,0.05)"
          : pressed && !isLocked
            ? "rgba(255,0,0,0.04)"
            : "rgba(255,255,255,0.015)",
        opacity: isLocked ? 0.32 : 1,
        // Hardware-accelerated tap transition
        transition:
          "border-color 60ms linear, background 60ms linear, opacity 0.2s",
        // Red glow on press (mobile touch feedback)
        boxShadow:
          pressed && !isLocked ? "0 0 0 1px rgba(255,0,0,0.35) inset" : "none"
      }}
    >
      {/* ── Active pulse border ─────────────────────────────────────────── */}
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }}
          style={{
            border: "1px solid #FF0000",
            boxShadow:
              "0 0 14px rgba(255,0,0,0.35) inset, 0 0 8px rgba(255,0,0,0.25)"
          }}
        />
      )}

      {/* ── Lock icon (top-right) ────────────────────────────────────────── */}
      {isLocked && (
        <div className="absolute top-1 right-1 md:top-1.5 md:right-1.5">
          <LockIcon />
        </div>
      )}

      {/* ── Active ▶ badge ───────────────────────────────────────────────── */}
      {isActive && (
        <div
          className="absolute top-1 right-1 md:top-1.5 md:right-1.5
                     text-[8px] font-bold leading-none px-1 py-px"
          style={{ background: "#FF0000", color: "#050505" }}
        >
          ▶
        </div>
      )}

      {/* ── Day number ───────────────────────────────────────────────────── */}
      <span
        className="text-base md:text-xl font-bold tabular-nums leading-none"
        style={{ color: isActive ? "#FF0000" : "rgba(255,255,255,0.5)" }}
      >
        {String(day).padStart(2, "0")}
      </span>

      {/* ── Milestone label ──────────────────────────────────────────────── */}
      {label && (
        <span
          className="mt-0.5 text-[7px] md:text-[9px] tracking-widest leading-none"
          style={{ color: isActive ? "#FF0000" : "rgba(255,255,255,0.22)" }}
        >
          {label}
        </span>
      )}

      {/* ── Hover tooltip (desktop only) ─────────────────────────────────── */}
      <AnimatePresence>
        {pressed && isLocked && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2
                       px-2 py-px text-[8px] whitespace-nowrap z-20 pointer-events-none"
            style={{
              background: "#141414",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#666"
            }}
          >
            LOCKED
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Grid ─────────────────────────────────────────────────────────────────────
export default function Grid() {
  const progress = ((ACTIVE_DAY / TOTAL_DAYS) * 100).toFixed(1);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.35 }}
      aria-label="Execution matrix"
      className="flex-1 flex flex-col p-3 md:p-4 min-h-0"
      style={{ fontFamily: MONO }}
    >
      {/* ── Section header ─────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between mb-2 pb-2 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-white truncate">
            EXECUTION_MATRIX
          </span>
          <span className="text-[10px] text-[#555] hidden sm:inline">
            27 DAYS
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4 text-[9px] md:text-[10px] text-[#555] shrink-0">
          <span>
            <span className="text-[#FF0000]">■</span>
            <span className="ml-1 hidden sm:inline">ACTIVE</span>
          </span>
          <span>
            <span className="text-[#333]">■</span>
            <span className="ml-1 hidden sm:inline">LOCKED</span>
          </span>
          <span>
            <span className="text-[#FF0000]">
              {String(ACTIVE_DAY).padStart(2, "0")}
            </span>
            <span className="text-[#444]">/27</span>
          </span>
        </div>
      </div>

      {/* ── Progress bar ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <div
          className="flex-1 h-px"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 0.6, duration: 0.9, ease: "easeOut" }}
            className="h-full"
            style={{ background: "#FF0000", boxShadow: "0 0 6px #FF0000" }}
          />
        </div>
        <span className="text-[9px] text-[#555] shrink-0">{progress}%</span>
      </div>

      {/* ── Responsive grid ────────────────────────────────────────────────
          Mobile  → 3 columns  (big, thumb-friendly cells)
          Desktop → 9 columns  (original layout, fills the width)
      ─────────────────────────────────────────────────────────────────────── */}
      <div
        role="list"
        className="grid grid-cols-3 md:grid-cols-9
                   gap-2 md:gap-2.5
                   flex-1 min-h-0 content-start md:content-stretch"
      >
        {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day, idx) => (
          <DayCard
            key={day}
            day={day}
            isActive={day === ACTIVE_DAY}
            isLocked={day > ACTIVE_DAY}
            index={idx}
          />
        ))}
      </div>
    </motion.section>
  );
}
