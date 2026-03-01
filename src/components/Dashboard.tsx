"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";
import Grid from "./Grid";
import LogDetail, { type LogEntry } from "./LogDetail";

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
        <span className="text-[9px] tracking-wider text-[#555]">{label}</span>
        <span className="text-[10px] font-bold tabular-nums" style={{ color }}>
          {value === "0" && max === "0" ? "—" : `${value}${unit}`}
        </span>
      </div>
      <div
        className="h-px w-full"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: 0.65, duration: 0.7, ease: "easeOut" }}
          className="h-full"
          style={{
            background: color,
            boxShadow: pct > 0 ? `0 0 4px ${color}` : "none"
          }}
        />
      </div>
    </div>
  );
}

// ── Sidebar content (shared between desktop panel and mobile sheet) ───────────
function SidebarContent() {
  return (
    <div
      className="h-full overflow-y-auto py-4 px-3 md:px-4 flex flex-col"
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
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.04, duration: 0.18 }}
              className="flex justify-between items-baseline"
            >
              <span className="text-[9px] text-[#444]">{s.label}</span>
              <span className="text-[9px] text-white">{s.value}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mission brief */}
      <div className="mt-auto">
        <p
          className="text-[9px] tracking-[0.2em] mb-3 pb-2 text-[#555]"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          MISSION_BRIEF
        </p>
        <div className="space-y-1.5 text-[9px] leading-relaxed text-[#444]">
          <p>OBJ: Impress Nil Ojeda.</p>
          <p>METHOD: 27 days of focused exec.</p>
          <p className="text-[#FF0000]">STATUS: IN_PROGRESS ▶</p>
        </div>
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
  const [activeEntry, setActiveEntry] = useState<LogEntry | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      {/* ── Log detail modal (both mobile + desktop) ─────────────────────── */}
      <LogDetail entry={activeEntry} onClose={() => setActiveEntry(null)} />

      {/* ── App shell ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 flex flex-col"
        style={{ background: "#050505", height: "100svh" }}
      >
        {/* ── Atmospheric overlays ───────────────────────────────────────── */}

        {/* Noise */}
        <div
          className="pointer-events-none fixed inset-0 z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "160px",
            opacity: 0.5,
            mixBlendMode: "screen"
          }}
        />
        {/* CRT scanlines */}
        <div
          className="pointer-events-none fixed inset-0 z-10"
          style={{
            background:
              "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.045) 2px,rgba(0,0,0,0.045) 4px)"
          }}
        />
        {/* Vignette */}
        <div
          className="pointer-events-none fixed inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)"
          }}
        />

        {/* ── HEADER — sticky, never scrolls ─────────────────────────────── */}
        <div className="relative z-20 shrink-0">
          <Header />
        </div>

        {/* ── Main body ──────────────────────────────────────────────────── */}
        <div className="relative z-20 flex flex-1 min-h-0 overflow-hidden">
          {/* ── Grid — its own scrollable region ─────────────────────────── */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <Grid onDayClick={(entry) => setActiveEntry(entry)} />
          </div>

          {/* ── Desktop sidebar — fixed-width, independent scroll ─────────── */}
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
        </div>

        {/* ── BOTTOM BAR — sticky, never scrolls ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="relative z-20 shrink-0 flex items-center justify-between
                     px-3 md:px-6 py-2 text-[9px]"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,0,0,0.6)",
            fontFamily: MONO,
            color: "#444"
          }}
        >
          {/* Left */}
          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="text-[#555]">P27</span>
            <span className="text-[#282828]">·</span>
            <span className="hidden sm:inline">BUILD_001</span>
            <span className="hidden sm:inline text-[#282828]">·</span>
            <span className="hidden sm:inline">Milfshakes.es</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile: open metrics sheet */}
            <button
              className="md:hidden flex items-center gap-1 px-2 py-1 text-[#555]
                         border border-white/[0.07]
                         active:border-[#FF0000]/50 active:text-[#FF0000]
                         transition-colors touch-manipulation"
              onClick={() => setSheetOpen(true)}
              aria-label="Open system metrics"
            >
              METRICS <span className="text-[8px]">▲</span>
            </button>
            {/* Separator */}
            <span className="hidden md:inline text-[#282828]">·</span>
            <span className="hidden md:inline">Astro 5</span>
            <span className="hidden md:inline text-[#282828]">·</span>
            {/* Live indicator */}
            <motion.span
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-[#FF0000]"
            >
              ● LIVE
            </motion.span>
          </div>
        </motion.div>

        {/* ── Mobile metrics bottom sheet ────────────────────────────────── */}
        <AnimatePresence>
          {sheetOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="md:hidden fixed inset-0 z-30 bg-black/75 backdrop-blur-sm"
                onClick={() => setSheetOpen(false)}
              />
              {/* Sheet */}
              <motion.div
                key="sheet"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 420, damping: 40 }}
                className="md:hidden fixed bottom-0 left-0 right-0 z-40"
                style={{
                  height: "62svh",
                  background: "#0B0B0B",
                  borderTop: "1px solid rgba(255,0,0,0.2)"
                }}
              >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div
                    className="w-8 h-px rounded-full"
                    style={{ background: "rgba(255,255,255,0.12)" }}
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
                    onClick={() => setSheetOpen(false)}
                    className="text-[9px] text-[#444] hover:text-[#FF0000] transition-colors px-1"
                    aria-label="Close"
                  >
                    ✕ CLOSE
                  </button>
                </div>
                <div
                  className="h-px mx-4"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
                {/* Content */}
                <div className="h-[calc(100%-56px)] overflow-hidden">
                  <SidebarContent />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
