"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LogEntry } from "./LogDetail";
import Day02_LCP from "./Day02_LCP";
import CreativeXRay from "./CreativeXRay";

const MONO = "'JetBrains Mono', 'Courier New', monospace";

// ── Module state types ────────────────────────────────────────────────────────
export type ModuleStatus = "ONLINE" | "DEPLOYING" | "ENCRYPTED";

// ── Log entries for ONLINE modules ───────────────────────────────────────────
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
  },
  2: {
    id: "LOG_ENTRY_02",
    title: "THE_LCP_KILLER",
    day: 2,
    status: "COMPLETED",
    details:
      "Análisis de carga: El LCP de 7.7s penaliza la conversión. Implemento compresión quirúrgica y carga asíncrona, eliminando 570 KiB de basura digital sin sacrificar estética.",
    snippet: "Compress(PNG_570KiB).convert('webp').lazyLoad();",
    tags: ["performance", "LCP", "webp", "core-web-vitals", "day-02"],
    customContent: <Day02_LCP />
  },
  3: {
    id: "LOG_ENTRY_03",
    title: "CREATIVE_DIRECTION",
    day: 3,
    status: "COMPLETED",
    details:
      "En batido.xyz la imagen es ley. Implementamos un pipeline multimedia que reduce el Total Blocking Time en un 94% (de 1,520ms a 90ms), permitiendo que el video sea el protagonista sin que la CPU sufra.",
    snippet: "Pipeline(video).codec('av1').async().unblockMainThread();",
    tags: ["multimedia", "TBT", "av1", "pipeline", "creative", "day-03"],
    customContent: <CreativeXRay />
  }
};

// ── Module config (state per day number) ─────────────────────────────────────
function getStatus(day: number): ModuleStatus {
  if (day <= 3) return "ONLINE";
  if (day === 4) return "DEPLOYING";
  return "ENCRYPTED";
}

// ── Visual tokens per state ───────────────────────────────────────────────────
const STATE_CONFIG: Record<
  ModuleStatus,
  {
    borderColor: string;
    bg: string;
    textColor: string;
    statusLabel: string;
    opacity: number;
  }
> = {
  ONLINE: {
    borderColor: "#FF0000",
    bg: "rgba(255,0,0,0.05)",
    textColor: "#FF0000",
    statusLabel: "ONLINE",
    opacity: 1
  },
  DEPLOYING: {
    borderColor: "rgba(255,100,0,0.7)",
    bg: "rgba(255,80,0,0.04)",
    textColor: "rgba(255,120,0,0.9)",
    statusLabel: "DEPLOYING",
    opacity: 1
  },
  ENCRYPTED: {
    borderColor: "rgba(255,255,255,0.1)",
    bg: "rgba(255,255,255,0.01)",
    textColor: "rgba(255,255,255,0.25)",
    statusLabel: "ENCRYPTED",
    opacity: 0.32
  }
};

// ── Corner HUD decoration ─────────────────────────────────────────────────────
function CornerTL({ color }: { color: string }) {
  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
    >
      <path d="M0 8V0h8" stroke={color} strokeWidth="1" opacity="0.7" />
    </svg>
  );
}
function CornerBR({ color }: { color: string }) {
  return (
    <svg
      className="absolute bottom-0 right-0 pointer-events-none"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
    >
      <path d="M8 0v8H0" stroke={color} strokeWidth="1" opacity="0.7" />
    </svg>
  );
}

// ── Denied overlay for encrypted clicks ──────────────────────────────────────
function DeniedFlash({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="denied"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.6, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, times: [0, 0.1, 0.5, 1] }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
          style={{ background: "rgba(255,0,0,0.07)" }}
        >
          <span className="text-[7px] font-bold tracking-widest text-[#FF0000]">
            ACCESS
          </span>
          <span className="text-[7px] font-bold tracking-widest text-[#FF0000]">
            DENIED
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── DayCell ───────────────────────────────────────────────────────────────────
interface DayCellProps {
  day: number;
  index: number;
  onClick: (entry: LogEntry) => void;
}

function DayCell({ day, index, onClick }: DayCellProps) {
  const [hovered, setHovered] = useState(false);
  const [denied, setDenied] = useState(false);
  const status = getStatus(day);
  const cfg = STATE_CONFIG[status];
  const entry = LOG_ENTRIES[day];
  const isOnline = status === "ONLINE";
  const isDeploying = status === "DEPLOYING";
  const isEncrypted = status === "ENCRYPTED";

  const handleClick = () => {
    if (isOnline && entry) {
      onClick(entry);
      return;
    }
    if (!isOnline) {
      setDenied(true);
      setTimeout(() => setDenied(false), 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: cfg.opacity, scale: 1 }}
      transition={{ delay: index * 0.014, duration: 0.22, ease: "easeOut" }}
      whileTap={isOnline ? { scale: 0.93 } : {}}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleClick}
      role={isOnline ? "button" : "listitem"}
      tabIndex={isOnline ? 0 : -1}
      onKeyDown={(e) => {
        if (isOnline && (e.key === "Enter" || e.key === " ")) handleClick();
      }}
      aria-label={`Module ${String(day).padStart(2, "0")} — ${status}`}
      className="relative flex flex-col items-center justify-center
                 select-none touch-manipulation focus:outline-none w-full h-full"
      style={{
        minHeight: "clamp(62px, 12vw, 92px)",
        fontFamily: MONO,
        cursor: isOnline ? "pointer" : isDeploying ? "wait" : "default",
        border:
          isOnline && hovered
            ? "1px solid #FF3333"
            : `1px solid ${cfg.borderColor}`,
        background: isOnline && hovered ? "rgba(255,0,0,0.09)" : cfg.bg,
        transition:
          "border-color 60ms linear, background 60ms linear, box-shadow 60ms linear",
        boxShadow:
          isOnline && hovered
            ? "0 0 14px rgba(255,0,0,0.15) inset"
            : isOnline
              ? "0 0 6px rgba(255,0,0,0.04) inset"
              : "none"
      }}
    >
      {/* HUD corners — online only */}
      {isOnline && (
        <>
          <CornerTL color={cfg.borderColor} />
          <CornerBR color={cfg.borderColor} />
        </>
      )}

      {/* Deploying glitch pulse border */}
      {isDeploying && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0, 1, 0, 0.7, 0], x: [0, -1, 2, -1, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
          style={{
            border: `1px solid ${cfg.borderColor}`,
            boxShadow: "0 0 8px rgba(255,80,0,0.2) inset"
          }}
        />
      )}

      {/* Online pulse border (idle) */}
      {isOnline && !hovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.9, 0.1, 0.9] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          style={{
            border: "1px solid #FF0000",
            boxShadow: "0 0 10px rgba(255,0,0,0.25) inset"
          }}
        />
      )}

      {/* Denied flash overlay */}
      <DeniedFlash visible={denied} />

      {/* Day number */}
      <span
        className="relative z-10 font-bold tabular-nums leading-none"
        style={{
          fontSize: "clamp(13px, 2.4vw, 18px)",
          color: cfg.textColor,
          textShadow:
            isOnline && hovered ? "0 0 8px rgba(255,0,0,0.7)" : "none",
          transition: "text-shadow 100ms"
        }}
      >
        {String(day).padStart(2, "0")}
      </span>

      {/* Status label */}
      <motion.span
        animate={isDeploying ? { opacity: [1, 0.2, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.9 }}
        className="relative z-10 mt-0.5 leading-none"
        style={{
          fontSize: "clamp(5px, 0.9vw, 7px)",
          letterSpacing: "0.15em",
          color: cfg.textColor,
          opacity: isEncrypted ? 0.6 : 1
        }}
      >
        {isDeploying ? "DEPLOYING..." : status}
      </motion.span>

      {/* Hover "OPEN" hint on online */}
      <AnimatePresence>
        {isOnline && hovered && (
          <motion.span
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute bottom-1 z-10 pointer-events-none"
            style={{
              fontSize: "6px",
              letterSpacing: "0.18em",
              color: "rgba(255,0,0,0.7)"
            }}
          >
            OPEN
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── HUD scan line that sweeps the full grid periodically ──────────────────────
function GridScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 pointer-events-none z-20"
      style={{
        height: "1px",
        background:
          "linear-gradient(90deg, transparent, rgba(255,0,0,0.35) 40%, rgba(255,0,0,0.35) 60%, transparent)",
        boxShadow: "0 0 6px rgba(255,0,0,0.3)"
      }}
      initial={{ top: "0%" }}
      animate={{ top: ["0%", "100%", "0%"] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "linear",
        repeatDelay: 3
      }}
    />
  );
}

// ── Grid ──────────────────────────────────────────────────────────────────────
interface GridProps {
  onDayClick: (entry: LogEntry) => void;
}

const TOTAL_DAYS = 27;
const ONLINE_DAYS = 3;

export default function Grid({ onDayClick }: GridProps) {
  const progress = ((ONLINE_DAYS / TOTAL_DAYS) * 100).toFixed(1);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25, duration: 0.3 }}
      className="flex flex-col h-full min-h-0 overflow-hidden"
      style={{ fontFamily: MONO }}
      aria-label="REDY Control Matrix — 27 modules"
    >
      {/* ── Panel header ─────────────────────────────────────────────────── */}
      <div
        className="shrink-0 px-3 md:px-4 pt-3 pb-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Top row: title + legend */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {/* Corner bracket title */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#FF0000] text-[10px]">◢</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-white">
                CONTROL_MATRIX
              </span>
              <span className="text-[#FF0000] text-[10px]">◣</span>
            </div>
            <span className="hidden sm:inline text-[9px] text-[#333]">
              27 MODULES
            </span>
          </div>
          {/* Status legend */}
          <div className="flex items-center gap-3 text-[8px] shrink-0">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000]" />
              <span className="text-[#555] hidden sm:inline">ONLINE</span>
            </span>
            <span className="flex items-center gap-1">
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.9 }}
                className="w-1.5 h-1.5 rounded-full bg-[#FF6600]"
              />
              <span className="text-[#555] hidden sm:inline">DEPLOYING</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#333]" />
              <span className="text-[#555] hidden sm:inline">ENCRYPTED</span>
            </span>
          </div>
        </div>

        {/* System progress bar */}
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-[#444] shrink-0">SYS</span>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
              className="h-full"
              style={{ background: "#FF0000", boxShadow: "0 0 5px #FF0000" }}
            />
          </div>
          <span className="text-[8px] text-[#555] shrink-0 tabular-nums">
            {progress}%
          </span>
          <span className="text-[8px] text-[#333] shrink-0 hidden sm:inline">
            {ONLINE_DAYS}/{TOTAL_DAYS} ONLINE
          </span>
        </div>
      </div>

      {/* ── Server matrix ─────────────────────────────────────────────────── */}
      <div
        className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden px-3 md:px-4 py-3 md:flex md:flex-col"
        style={{
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain"
        }}
      >
        <div
          role="list"
          className="relative grid grid-cols-3 md:grid-cols-9 gap-1.5 md:gap-2 md:flex-1 md:h-full"
        >
          {/* Periodic HUD scan line across the grid */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <GridScanLine />
          </div>

          {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map(
            (day, idx) => (
              <div
                key={day}
                className="md:min-h-0"
                style={{ scrollSnapAlign: idx % 3 === 0 ? "start" : undefined }}
              >
                <DayCell day={day} index={idx} onClick={onDayClick} />
              </div>
            )
          )}
        </div>

        {/* Mobile scroll hint */}
        <motion.div
          initial={{ opacity: 0.45 }}
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
