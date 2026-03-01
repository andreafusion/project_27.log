"use client";
import { useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import type { LogEntry } from "./LogDetail";

// ── Config ───────────────────────────────────────────────────────────────────
export const ACTIVE_DAY = 1;
const TOTAL_DAYS = 27;
const MONO = "'JetBrains Mono', 'Courier New', monospace";

export const LOG_ENTRIES: Record<number, LogEntry> = {
  1: {
    id: "LOG_ENTRY_01",
    title: "SYSTEM_GENESIS",
    day: 1,
    status: "COMPLETED",
    details:
      "Despliegue de infraestructura Project_27.log. Auditoría técnica de milfshakes.es completada. Optimización de Performance y Core Web Vitals iniciada. Stack definido: Astro 5 + Tailwind + Framer Motion.",
    snippet: "Init(Andrea_DNA + Milfshake_Hype);",
    tags: ["infrastructure", "audit", "performance", "day-01"]
  }
};

const MILESTONES: Record<number, string> = {
  1: "INIT",
  5: "AUDIT",
  9: "DEPLOY",
  14: "PIVOT",
  18: "SCALE",
  22: "REFINE",
  27: "IGNITE"
};

// ── Lock icon ────────────────────────────────────────────────────────────────
function LockIcon() {
  return (
    <svg
      width="8"
      height="10"
      viewBox="0 0 8 10"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="0.75"
        y="4"
        width="6.5"
        height="5.5"
        rx="0.5"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="0.85"
      />
      <path
        d="M2 4V3a2 2 0 014 0v1"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="0.85"
      />
    </svg>
  );
}

// ── Laser scan overlay ───────────────────────────────────────────────────────
function LaserScan({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        // Clip the laser to the cell bounds
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-none">
          {/* The scanning line */}
          <motion.div
            initial={{ top: "-4px" }}
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{
              duration: 1.1,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="absolute left-0 right-0"
            style={{
              height: "2px",
              background:
                "linear-gradient(90deg, transparent 0%, #FF0000 20%, #FF4444 50%, #FF0000 80%, transparent 100%)",
              boxShadow:
                "0 0 6px 2px rgba(255,0,0,0.55), 0 0 14px 4px rgba(255,0,0,0.25)"
            }}
          />

          {/* Trailing glow band — follows the laser, wider and softer */}
          <motion.div
            initial={{ top: "-20px" }}
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{
              duration: 1.1,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
              delay: 0.04 // slight lag behind the sharp line
            }}
            className="absolute left-0 right-0"
            style={{
              height: "20px",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(255,0,0,0.12) 50%, transparent 100%)",
              filter: "blur(2px)"
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}

// ── DayCard ──────────────────────────────────────────────────────────────────
interface DayCardProps {
  day: number;
  isActive: boolean;
  isLocked: boolean;
  index: number;
  onClick?: (entry: LogEntry) => void;
}

function DayCard({ day, isActive, isLocked, index, onClick }: DayCardProps) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isClickable = isActive && !!onClick;
  const entry = LOG_ENTRIES[day];
  const label = MILESTONES[day];

  const handleInteraction = () => {
    if (isClickable && entry) onClick(entry);
  };

  return (
    <motion.div
      // ── Entrance ────────────────────────────────────────────────────────
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.016, duration: 0.2, ease: "easeOut" }}
      // ── Press feedback ──────────────────────────────────────────────────
      whileTap={isClickable ? { scale: 0.91 } : isLocked ? {} : { scale: 0.96 }}
      // ── Hover / tap handlers ────────────────────────────────────────────
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onTapStart={() => setPressed(true)}
      onTap={() => {
        handleInteraction();
        setTimeout(() => setPressed(false), 200);
      }}
      onTapCancel={() => setPressed(false)}
      onClick={isClickable ? handleInteraction : undefined}
      // ── A11y ────────────────────────────────────────────────────────────
      role={isClickable ? "button" : "listitem"}
      tabIndex={isClickable ? 0 : -1}
      aria-label={
        isActive
          ? `Day ${day} — active. Click to view log.`
          : isLocked
            ? `Day ${day} — locked`
            : `Day ${day}`
      }
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " "))
          handleInteraction();
      }}
      className="relative flex flex-col items-center justify-center
                 select-none touch-manipulation focus:outline-none
                 w-full h-full"
      style={{
        // Mobile: square cells. Desktop: fill grid row height naturally
        minHeight: "clamp(64px, 13vw, 96px)",
        fontFamily: MONO,
        cursor: isClickable ? "pointer" : "default",

        border: isActive
          ? `1px solid ${hovered || pressed ? "#FF4444" : "#FF0000"}`
          : pressed && !isLocked
            ? "1px solid rgba(255,0,0,0.45)"
            : "1px solid rgba(255,255,255,0.07)",

        background: isActive
          ? pressed
            ? "rgba(255,0,0,0.12)"
            : hovered
              ? "rgba(255,0,0,0.08)"
              : "rgba(255,0,0,0.04)"
          : pressed && !isLocked
            ? "rgba(255,0,0,0.03)"
            : "rgba(255,255,255,0.013)",

        opacity: isLocked ? 0.3 : 1,
        transition: "border-color 55ms linear, background 55ms linear",
        boxShadow:
          isActive && hovered
            ? "0 0 20px rgba(255,0,0,0.18) inset, 0 0 8px rgba(255,0,0,0.1)"
            : isActive
              ? "0 0 8px rgba(255,0,0,0.06) inset"
              : "none"
      }}
    >
      {/* ── Laser scan (only on active + hovered) ──────────────────────── */}
      <LaserScan active={isActive && hovered} />

      {/* ── Active pulse border (only when NOT hovered) ──────────────────── */}
      {isActive && !hovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [1, 0.12, 1] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          style={{
            border: "1px solid #FF0000",
            boxShadow: "0 0 12px rgba(255,0,0,0.3) inset"
          }}
        />
      )}

      {/* ── Top-right badge ──────────────────────────────────────────────── */}
      {isLocked ? (
        <div className="absolute top-1 right-1">
          <LockIcon />
        </div>
      ) : isActive ? (
        <motion.div
          animate={hovered ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-1 right-1 text-[8px] font-bold
                     leading-none px-1 py-px z-10"
          style={{ background: "#FF0000", color: "#050505" }}
        >
          ▶
        </motion.div>
      ) : null}

      {/* ── Day number ───────────────────────────────────────────────────── */}
      <span
        className="relative z-10 text-base md:text-lg font-bold tabular-nums leading-none"
        style={{
          color: isActive ? "#FF0000" : "rgba(255,255,255,0.45)",
          textShadow:
            isActive && hovered ? "0 0 8px rgba(255,0,0,0.7)" : "none",
          transition: "text-shadow 150ms ease"
        }}
      >
        {String(day).padStart(2, "0")}
      </span>

      {/* ── Milestone label ──────────────────────────────────────────────── */}
      {label && (
        <span
          className="relative z-10 mt-1 text-[7px] md:text-[9px] tracking-widest leading-none"
          style={{
            color: isActive ? "rgba(255,80,80,0.9)" : "rgba(255,255,255,0.2)"
          }}
        >
          {label}
        </span>
      )}

      {/* ── Desktop hover hint ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isActive && hovered && (
          <motion.span
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute bottom-1 text-[7px] tracking-widest
                       text-[#FF0000]/80 pointer-events-none z-10"
          >
            OPEN
          </motion.span>
        )}
      </AnimatePresence>

      {/* ── Locked tap chip ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {pressed && isLocked && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute -top-7 left-1/2 -translate-x-1/2
                       px-2 py-0.5 text-[8px] whitespace-nowrap z-20
                       pointer-events-none"
            style={{
              background: "#111",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#555"
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
interface GridProps {
  onDayClick: (entry: LogEntry) => void;
}

export default function Grid({ onDayClick }: GridProps) {
  const progress = ((ACTIVE_DAY / TOTAL_DAYS) * 100).toFixed(1);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.28, duration: 0.3 }}
      aria-label="Execution matrix — 27 days"
      className="flex flex-col h-full min-h-0 overflow-hidden"
      style={{ fontFamily: MONO }}
    >
      {/* ── Header (sticky) ──────────────────────────────────────────────── */}
      <div
        className="shrink-0 px-3 md:px-4 pt-3 pb-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] md:text-xs font-bold tracking-widest text-white">
              EXECUTION_MATRIX
            </span>
            <span className="hidden sm:inline text-[10px] text-[#444]">
              27 DAYS
            </span>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-[#555] shrink-0">
            <span>
              <span className="text-[#FF0000]">■</span>
              <span className="hidden sm:inline ml-1">ACTIVE</span>
            </span>
            <span>
              <span className="text-[#282828]">■</span>
              <span className="hidden sm:inline ml-1">LOCKED</span>
            </span>
            <span>
              <span className="text-[#FF0000]">
                {String(ACTIVE_DAY).padStart(2, "0")}
              </span>
              <span className="text-[#383838]">/27</span>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="h-full"
              style={{ background: "#FF0000", boxShadow: "0 0 5px #FF0000" }}
            />
          </div>
          <span className="text-[9px] text-[#555] shrink-0 tabular-nums">
            {progress}%
          </span>
        </div>
      </div>

      {/* ── Scrollable on mobile, fills height on desktop ────────────────
          - Mobile  (< md): overflow-y-auto + scroll-snap by row
          - Desktop (≥ md): overflow-hidden, grid stretches to fill panel
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden
                   px-3 md:px-4 py-3
                   md:flex md:flex-col"
        style={{
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain"
        }}
      >
        <div
          role="list"
          className="grid grid-cols-3 md:grid-cols-9
                     gap-2 md:gap-3
                     md:flex-1 md:h-full"
          style={{
            // Desktop: explicit 3 equal rows filling the container
            gridTemplateRows: undefined
          }}
        >
          {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map(
            (day, idx) => (
              <div
                key={day}
                className="md:min-h-0"
                style={{ scrollSnapAlign: idx % 3 === 0 ? "start" : undefined }}
              >
                <DayCard
                  day={day}
                  isActive={day === ACTIVE_DAY}
                  isLocked={day > ACTIVE_DAY}
                  index={idx}
                  onClick={day === ACTIVE_DAY ? onDayClick : undefined}
                />
              </div>
            )
          )}
        </div>

        {/* Scroll hint (mobile only, auto-fades) */}
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="flex md:hidden justify-center pt-3 pointer-events-none"
        >
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="text-[8px] text-[#333] tracking-widest"
          >
            ↓ SCROLL
          </motion.span>
        </motion.div>
      </div>
    </motion.section>
  );
}
