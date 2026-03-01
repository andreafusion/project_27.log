"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";
import Grid from "./Grid";

// ── Data ─────────────────────────────────────────────────────────────────────
const SPECS = [
  { label: "FW", value: "Astro 5.x" },
  { label: "UI", value: "Tailwind CSS" },
  { label: "ANIM", value: "Framer Motion" },
  { label: "TYPE", value: "JetBrains Mono" },
  { label: "ARCH", value: "Islands SSG" },
  { label: "OS", value: "BRUTALIST_OS 2.27" }
];

const METRICS = [
  { label: "DAYS_ACTIVE", value: "01", max: "27", unit: "", color: "#FF0000" },
  {
    label: "COMMIT_RATE",
    value: "100",
    max: "100",
    unit: "%",
    color: "#00FF41"
  },
  { label: "HYPE_INDEX", value: "94", max: "100", unit: "%", color: "#FF0000" },
  { label: "DROP_READINESS", value: "0", max: "0", unit: "", color: "#333" }
];

const MONO = "'JetBrains Mono', 'Courier New', monospace";

// ── MetricBar ────────────────────────────────────────────────────────────────
function MetricBar({
  label,
  value,
  max,
  unit = "",
  color
}: (typeof METRICS)[0]) {
  const pct =
    !isNaN(Number(value)) && !isNaN(Number(max)) && Number(max) > 0
      ? (Number(value) / Number(max)) * 100
      : 0;

  return (
    <div className="mb-3">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[9px] md:text-[10px] tracking-wider text-[#555]">
          {label}
        </span>
        <span
          className="text-[10px] md:text-xs font-bold tabular-nums"
          style={{ color }}
        >
          {value === "0" && max === "0" ? "—" : `${value}${unit}`}
        </span>
      </div>
      <div
        className="h-px w-full"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
          className="h-full"
          style={{
            background: color,
            boxShadow: pct > 0 ? `0 0 5px ${color}` : "none"
          }}
        />
      </div>
    </div>
  );
}

// ── Sidebar content ───────────────────────────────────────────────────────────
function SidebarContent() {
  return (
    <div
      className="flex flex-col h-full overflow-y-auto py-4 px-3 md:px-4"
      style={{ fontFamily: MONO }}
    >
      {/* Metrics */}
      <div className="mb-5">
        <p
          className="text-[9px] tracking-[0.2em] mb-3 pb-2 text-[#555]"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          SYSTEM_METRICS
        </p>
        {METRICS.map((m) => (
          <MetricBar key={m.label} {...m} />
        ))}
      </div>

      {/* Tech stack */}
      <div className="mb-5">
        <p
          className="text-[9px] tracking-[0.2em] mb-3 pb-2 text-[#555]"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          TECH_STACK
        </p>
        <div className="space-y-1.5">
          {SPECS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.04, duration: 0.2 }}
              className="flex justify-between items-baseline"
            >
              <span className="text-[9px] text-[#444]">{s.label}</span>
              <span className="text-[9px] text-white">{s.value}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="mt-auto">
        <p
          className="text-[9px] tracking-[0.2em] mb-3 pb-2 text-[#555]"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          MISSION_BRIEF
        </p>
        <div className="space-y-1.5 text-[9px] leading-relaxed text-[#444]">
          <p>OBJ: Impress Nil Ojeda.</p>
          <p>METHOD: 27 days execution.</p>
          <p className="text-[#FF0000]">STATUS: IN_PROGRESS ▶</p>
        </div>
        {/* Signature */}
        <div
          className="mt-4 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-[9px] text-[#333]">SIGNED_BY</p>
          <p className="text-xs font-bold text-white mt-0.5">Andrea_dev</p>
          <p className="text-[9px] text-[#555]">OPERATOR · FRONTEND</p>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  // Mobile: sidebar toggled via bottom sheet
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 flex flex-col"
      style={{
        background: "#050505",
        height: "100svh" /* safe viewport height — avoids iOS toolbar */
      }}
    >
      {/* ── Atmospheric layers (pointer-events: none) ───────────────────── */}

      {/* Noise */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "160px",
          opacity: 0.55,
          mixBlendMode: "screen"
        }}
      />
      {/* CRT scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)"
        }}
      />
      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)"
        }}
      />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <Header />

      {/* ── Body: column on mobile, row on desktop ─────────────────────── */}
      <div className="relative z-20 flex flex-1 flex-col md:flex-row min-h-0 overflow-hidden">
        {/* ── Grid (primary — always visible) ──────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Grid />
        </div>

        {/* ── Desktop sidebar (always visible ≥ md) ─────────────────────── */}
        <aside
          className="hidden md:flex flex-col shrink-0 overflow-hidden"
          style={{
            width: "200px",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,0,0,0.45)"
          }}
        >
          <SidebarContent />
        </aside>

        {/* ── Mobile bottom sheet ────────────────────────────────────────── */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              />
              {/* Sheet */}
              <motion.div
                key="sheet"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 400, damping: 38 }}
                className="md:hidden fixed bottom-0 left-0 right-0 z-40 rounded-t-none"
                style={{
                  height: "65svh",
                  background: "#0C0C0C",
                  borderTop: "1px solid rgba(255,0,0,0.25)"
                }}
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div
                    className="w-8 h-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  />
                </div>
                {/* Close row */}
                <div
                  className="flex items-center justify-between px-4 pb-2"
                  style={{ fontFamily: MONO }}
                >
                  <span className="text-[9px] tracking-widest text-[#555]">
                    SYSTEM_METRICS
                  </span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-[10px] text-[#444] hover:text-[#FF0000] transition-colors"
                    aria-label="Close metrics panel"
                  >
                    ✕ CLOSE
                  </button>
                </div>
                <div
                  className="h-px mx-4"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                {/* Content */}
                <div className="h-[calc(100%-4rem)] overflow-y-auto">
                  <SidebarContent />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative z-20 shrink-0 flex items-center justify-between
                   px-3 md:px-6 py-2 text-[9px] md:text-[10px]"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.55)",
          fontFamily: MONO,
          color: "#444"
        }}
      >
        {/* Left */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0 truncate">
          <span className="text-[#555]">P27</span>
          <span className="text-[#282828]">·</span>
          <span className="hidden sm:inline">BUILD_001</span>
          <span className="hidden sm:inline text-[#282828]">·</span>
          <span className="hidden sm:inline">Milfshakes.es</span>
        </div>

        {/* Right — mobile shows metrics toggle */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Mobile: open metrics sheet */}
          <button
            className="md:hidden flex items-center gap-1.5 px-2 py-1
                       border border-white/10 text-[#666]
                       active:border-[#FF0000] active:text-[#FF0000]
                       transition-colors touch-manipulation"
            onClick={() => setSidebarOpen(true)}
            style={{ fontFamily: MONO }}
            aria-label="Open system metrics"
          >
            <span>METRICS</span>
            <span className="text-[8px]">▲</span>
          </button>

          {/* Desktop: status */}
          <span className="hidden md:inline text-[#282828]">·</span>
          <span className="hidden md:inline">Astro 5</span>
          <span className="hidden md:inline text-[#282828]">·</span>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-[#FF0000]"
          >
            ● LIVE
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}
