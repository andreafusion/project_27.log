"use client";
import { useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence
} from "framer-motion";

const MONO = "'JetBrains Mono', 'Courier New', monospace";

// ── Warning icon (blinking — legacy side) ─────────────────────────────────────
function WarningIcon() {
  return (
    <motion.div
      animate={{ opacity: [1, 0.15, 1] }}
      transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
      title="CRITICAL: LCP penalty detected"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-label="Warning"
      >
        <path
          d="M7 1.5L13 12H1L7 1.5Z"
          stroke="#FF0000"
          strokeWidth="1.2"
          fill="rgba(255,0,0,0.12)"
        />
        <line
          x1="7"
          y1="5.5"
          x2="7"
          y2="8.5"
          stroke="#FF0000"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="7" cy="10.2" r="0.7" fill="#FF0000" />
      </svg>
    </motion.div>
  );
}

// ── Check icon (static — optimised side) ─────────────────────────────────────
function CheckIcon() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 28, delay: 0.3 }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-label="Validated"
      >
        <circle
          cx="7"
          cy="7"
          r="6"
          stroke="#00FF41"
          strokeWidth="1.2"
          fill="rgba(0,255,65,0.08)"
        />
        <path
          d="M4 7l2 2 4-3.5"
          stroke="#00FF41"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

// ── Stats panel ───────────────────────────────────────────────────────────────
const STATS = [
  { key: "ESTIMATED_SAVINGS", value: "570 KiB", color: "#FF0000" },
  { key: "LOAD_SPEED", value: "+400%", color: "#00FF41" },
  { key: "FORMAT", value: "WEBP_NEXT_GEN", color: "#FFFFFF" },
  { key: "LCP_BEFORE", value: "7.7s", color: "#FF0000" },
  { key: "LCP_AFTER", value: "1.1s", color: "#00FF41" },
  { key: "TECHNIQUE", value: "ASYNC_LOAD", color: "#888888" }
];

function StatsPanel() {
  return (
    <div
      className="mt-4 p-3 space-y-2"
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        background: "#0A0A0A"
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between pb-2 mb-1"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="text-[9px] tracking-[0.2em] text-[#555]">
          PERF_AUDIT_RESULTS
        </span>
        <span className="text-[9px] text-[#333]">Milfshakes.es</span>
      </div>

      {STATS.map((s, i) => (
        <motion.div
          key={s.key}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.06, duration: 0.2 }}
          className="flex items-center justify-between"
        >
          <span className="text-[9px] text-[#444]">{s.key}</span>
          <span
            className="text-[10px] font-bold tabular-nums tracking-wider"
            style={{ color: s.color }}
          >
            {s.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ── Comparison slider ─────────────────────────────────────────────────────────
export default function Day02_LCP() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Handle position as a fraction 0–1 (start at 50%)
  const [pct, setPct] = useState(0.5);
  const [dragging, setDragging] = useState(false);

  // Unified pointer handler (mouse + touch)
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const clamped = Math.max(0.04, Math.min(0.96, (clientX - left) / width));
    setPct(clamped);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    handleMove(e.clientX);
    const onMove = (ev: MouseEvent) => handleMove(ev.clientX);
    const onUp = () => {
      setDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    handleMove(e.touches[0].clientX);
    const onMove = (ev: TouchEvent) => handleMove(ev.touches[0].clientX);
    const onEnd = () => {
      setDragging(false);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
  };

  const leftPct = `${(pct * 100).toFixed(1)}%`;
  const rightPct = `${((1 - pct) * 100).toFixed(1)}%`;

  return (
    <div style={{ fontFamily: MONO }}>
      {/* ── Slider area ─────────────────────────────────────────────────────── */}
      <div className="text-[9px] text-[#555] tracking-widest mb-2 flex justify-between">
        <span>DRAG TO COMPARE ◀ ▶</span>
        <span className="text-[#333]">BEFORE / AFTER</span>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden select-none"
        style={{
          height: "200px",
          border: "1px solid rgba(255,255,255,0.08)",
          cursor: dragging ? "col-resize" : "col-resize",
          background: "#0A0A0A",
          touchAction: "none"
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {/* ── BEFORE — Legacy (full width, behind) ───────────────────────── */}
        <div className="absolute inset-0">
          <img
            src="/milfshakes-home.png"
            alt="Milfshakes legacy — 7.7s LCP"
            draggable={false}
            className="w-full h-full object-cover object-top"
            style={{ filter: "blur(1.2px) brightness(0.7) saturate(0.6)" }}
          />
          {/* Dark overlay for worse perception */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(20,0,0,0.45)" }}
          />

          {/* BEFORE label */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <WarningIcon />
            <div
              className="flex items-center gap-1.5 px-2 py-1"
              style={{
                background: "rgba(0,0,0,0.82)",
                border: "1px solid #FF0000"
              }}
            >
              <span className="text-[10px] font-bold text-[#FF0000]">
                7.7s LCP
              </span>
            </div>
          </div>
          <div
            className="absolute bottom-2 left-2 text-[8px] tracking-widest text-[#FF0000]/70"
            style={{ background: "rgba(0,0,0,0.7)", padding: "2px 6px" }}
          >
            LEGACY · PNG · UNOPTIMIZED
          </div>
        </div>

        {/* ── AFTER — Optimized (clipped to right portion) ───────────────── */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${leftPct})` }}
        >
          <img
            src="/milfshakes-home.webp"
            alt="Milfshakes optimized — 1.1s LCP"
            draggable={false}
            className="w-full h-full object-cover object-top"
            style={{ filter: "brightness(1.05) saturate(1.1)" }}
          />
          {/* Subtle green tint to signal "good" */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "rgba(0,20,5,0.15)" }}
          />

          {/* AFTER label */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <div
              className="flex items-center gap-1.5 px-2 py-1"
              style={{
                background: "rgba(0,0,0,0.82)",
                border: "1px solid #00FF41"
              }}
            >
              <span className="text-[10px] font-bold text-[#00FF41]">
                1.1s LCP
              </span>
            </div>
            <CheckIcon />
          </div>
          <div
            className="absolute bottom-2 right-2 text-[8px] tracking-widest text-[#00FF41]/70"
            style={{ background: "rgba(0,0,0,0.7)", padding: "2px 6px" }}
          >
            OPTIMIZED · WEBP · ASYNC
          </div>
        </div>

        {/* ── Divider line ───────────────────────────────────────────────── */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: leftPct,
            width: "1px",
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 0 6px rgba(255,255,255,0.5)"
          }}
        />

        {/* ── Handle ──────────────────────────────────────────────────────── */}
        <motion.div
          animate={{ scale: dragging ? 1.1 : 1 }}
          transition={{ duration: 0.15 }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                     flex items-center justify-center
                     pointer-events-none z-10"
          style={{ left: leftPct, width: "28px", height: "28px" }}
        >
          <div
            className="w-7 h-7 flex items-center justify-center"
            style={{
              background: "#050505",
              border: `1px solid ${dragging ? "#FF0000" : "rgba(255,255,255,0.4)"}`,
              boxShadow: dragging
                ? "0 0 12px rgba(255,0,0,0.5)"
                : "0 0 6px rgba(0,0,0,0.8)",
              transition: "border-color 100ms, box-shadow 100ms"
            }}
          >
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
              <path
                d="M3 5H1M11 5H9M3 2l-2 3 2 3M9 2l2 3-2 3"
                stroke="white"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>

        {/* ── Percentage readout (top-center) ─────────────────────────────── */}
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-px text-[8px] tabular-nums pointer-events-none"
          style={{
            background: "rgba(0,0,0,0.75)",
            color: "rgba(255,255,255,0.4)",
            border: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          {(pct * 100).toFixed(0)}% · {((1 - pct) * 100).toFixed(0)}%
        </div>
      </div>

      {/* ── Stats panel ──────────────────────────────────────────────────────── */}
      <StatsPanel />
    </div>
  );
}
