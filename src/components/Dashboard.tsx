"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";
import Grid, { LOG_ENTRIES } from "./Grid";
import LogDetail, { type LogEntry } from "./LogDetail";
import AuditModal from "./AuditModal";

const MONO = "'JetBrains Mono', 'Courier New', monospace";

// ── Ordered list of ONLINE module entries for prev/next nav ──────────────────
const ONLINE_ENTRIES: LogEntry[] = Object.values(LOG_ENTRIES).sort(
  (a, b) => a.day - b.day
);

// ── System metrics data ───────────────────────────────────────────────────────
const METRICS = [
  { label: "MODULES_ONLINE", value: "03", max: "27", color: "#FF0000" },
  {
    label: "JS_REDUCED",
    value: "235",
    max: "235",
    color: "#00FF41",
    unit: "KiB"
  },
  { label: "LATENCY_DELTA", value: "−6.6s", max: null, color: "#00FF41" },
  {
    label: "TBT_IMPROVEMENT",
    value: "94",
    max: "100",
    color: "#00FF41",
    unit: "%"
  }
];

const STACK = [
  { k: "FW", v: "Astro 5.x" },
  { k: "UI", v: "Tailwind" },
  { k: "ANIM", v: "Framer Motion" },
  { k: "TYPE", v: "JetBrains Mono" },
  { k: "ARCH", v: "Islands SSG" }
];

// ── MetricBar ─────────────────────────────────────────────────────────────────
function MetricBar({
  label,
  value,
  max,
  color,
  unit = ""
}: (typeof METRICS)[0]) {
  const pct =
    max && !isNaN(Number(value)) && Number(max) > 0
      ? Math.min((Number(value) / Number(max)) * 100, 100)
      : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[8px] tracking-wider text-[#555]">{label}</span>
        <span className="text-[9px] font-bold tabular-nums" style={{ color }}>
          {value}
          {unit}
        </span>
      </div>
      {max && (
        <div
          className="h-px w-full"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: 0.65, duration: 0.75, ease: "easeOut" }}
            className="h-full"
            style={{
              background: color,
              boxShadow: pct > 0 ? `0 0 4px ${color}` : "none"
            }}
          />
        </div>
      )}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
interface SidebarContentProps {
  onAudit: () => void;
}

function SidebarContent({ onAudit }: SidebarContentProps) {
  return (
    <div
      className="h-full overflow-y-auto py-4 px-3 flex flex-col"
      style={{ fontFamily: MONO }}
    >
      {/* ── System status header ──────────────────────────────────────── */}
      <div className="mb-4">
        <div
          className="flex items-center gap-2 mb-3 pb-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <motion.div
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            className="w-1 h-1 rounded-full bg-[#FF0000]"
          />
          <span className="text-[9px] tracking-[0.2em] text-[#555]">
            SYSTEM_STATUS
          </span>
        </div>
        <div className="flex items-center justify-between text-[9px]">
          <span className="text-[#444]">REDY_AGENCY</span>
          <span className="text-[#FF0000] font-bold">OPERATIONAL</span>
        </div>
        <div className="flex items-center justify-between text-[9px] mt-1">
          <span className="text-[#444]">TARGET</span>
          <span className="text-[#555]">Nil Ojeda</span>
        </div>
      </div>

      {/* ── Metrics ───────────────────────────────────────────────────── */}
      <div className="mb-4">
        <p
          className="text-[9px] tracking-[0.2em] mb-3 pb-2 text-[#555]"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          PERF_DELTA
        </p>
        {METRICS.map((m) => (
          <MetricBar key={m.label} {...m} />
        ))}
      </div>

      {/* ── Stack ─────────────────────────────────────────────────────── */}
      <div className="mb-4">
        <p
          className="text-[9px] tracking-[0.2em] mb-2 pb-2 text-[#555]"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          TECH_STACK
        </p>
        <div className="space-y-1.5">
          {STACK.map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.04 }}
              className="flex justify-between"
            >
              <span className="text-[8px] text-[#444]">{s.k}</span>
              <span className="text-[8px] text-white">{s.v}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── GENERATE AUDIT button ─────────────────────────────────────── */}
      <div className="mt-auto">
        <motion.button
          onClick={onAudit}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-2.5 px-3 text-left touch-manipulation focus:outline-none"
          style={{
            border: "1px solid rgba(255,0,0,0.5)",
            background: "rgba(255,0,0,0.04)",
            fontFamily: MONO
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(255,0,0,0.1)";
            (e.currentTarget as HTMLElement).style.borderColor = "#FF0000";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 12px rgba(255,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(255,0,0,0.04)";
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(255,0,0,0.5)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-1 h-1 rounded-full bg-[#FF0000]"
            />
            <span className="text-[7px] text-[#FF0000] tracking-widest">
              TERMINAL_CMD
            </span>
          </div>
          <span
            className="text-[9px] font-bold tracking-widest"
            style={{ color: "#FF0000" }}
          >
            [ GENERATE_SYSTEM_AUDIT ]
          </span>
          <p className="text-[8px] text-[#444] mt-0.5 leading-snug">
            Informe Lighthouse acumulado
          </p>
        </motion.button>

        {/* Operator */}
        <div
          className="mt-3 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-[8px] text-[#333]">OPERATOR</p>
          <p className="text-[10px] font-bold text-white mt-0.5">Andrea_dev</p>
          <p className="text-[8px] text-[#555]">REDY · FRONTEND_ENG</p>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeEntry, setActiveEntry] = useState<LogEntry | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);

  return (
    <>
      {/* ── Audit modal ────────────────────────────────────────────────── */}
      <AuditModal open={auditOpen} onClose={() => setAuditOpen(false)} />

      {/* ── Log detail panel ───────────────────────────────────────────── */}
      <LogDetail
        entry={activeEntry}
        onClose={() => setActiveEntry(null)}
        allEntries={ONLINE_ENTRIES}
        onNavigate={(entry) => setActiveEntry(entry)}
      />

      {/* ── App shell ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 flex flex-col"
        style={{ background: "#050505", height: "100svh" }}
      >
        {/* Atmospheric overlays */}
        <div
          className="pointer-events-none fixed inset-0 z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "160px",
            opacity: 0.5,
            mixBlendMode: "screen" as const
          }}
        />
        <div
          className="pointer-events-none fixed inset-0 z-10"
          style={{
            background:
              "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)"
          }}
        />
        <div
          className="pointer-events-none fixed inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)"
          }}
        />

        {/* Header */}
        <div className="relative z-20 shrink-0">
          <Header />
        </div>

        {/* Body */}
        <div className="relative z-20 flex flex-1 min-h-0 overflow-hidden">
          {/* Grid */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <Grid onDayClick={setActiveEntry} />
          </div>

          {/* Desktop sidebar */}
          <aside
            className="hidden md:flex flex-col shrink-0 overflow-hidden"
            style={{
              width: "210px",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(0,0,0,0.5)"
            }}
          >
            <SidebarContent onAudit={() => setAuditOpen(true)} />
          </aside>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-20 shrink-0 flex items-center justify-between px-3 md:px-5 py-1.5 text-[8px]"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,0,0,0.65)",
            fontFamily: MONO,
            color: "#333"
          }}
        >
          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="text-[#FF0000]">◢</span>
            <span className="text-[#444]">REDY_MCP</span>
            <span className="text-[#282828]">·</span>
            <span className="hidden sm:inline text-[#333]">P27.LOG</span>
            <span className="hidden sm:inline text-[#282828]">·</span>
            <span className="hidden sm:inline">Nil Ojeda · Milfshakes.es</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile: audit button */}
            <button
              className="md:hidden text-[8px] px-2 py-1 text-[#FF0000] border border-[#FF0000]/30
                         active:bg-[#FF0000]/10 transition-colors touch-manipulation"
              onClick={() => setAuditOpen(true)}
            >
              AUDIT ▲
            </button>
            {/* Mobile: metrics */}
            <button
              className="md:hidden text-[8px] px-2 py-1 text-[#555] border border-white/[0.07]
                         active:border-[#FF0000]/50 active:text-[#FF0000] transition-colors touch-manipulation"
              onClick={() => setSheetOpen(true)}
            >
              SYS ▲
            </button>
            <motion.span
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-[#FF0000] flex items-center gap-1"
            >
              <span>●</span>
              <span className="hidden sm:inline">LIVE</span>
            </motion.span>
          </div>
        </motion.div>

        {/* Mobile bottom sheet */}
        <AnimatePresence>
          {sheetOpen && (
            <>
              <motion.div
                key="sheet-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="md:hidden fixed inset-0 z-30 bg-black/78 backdrop-blur-sm"
                onClick={() => setSheetOpen(false)}
              />
              <motion.div
                key="sheet"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 420, damping: 40 }}
                className="md:hidden fixed bottom-0 left-0 right-0 z-40"
                style={{
                  height: "65svh",
                  background: "#0B0B0B",
                  borderTop: "1px solid rgba(255,0,0,0.2)"
                }}
              >
                <div className="flex justify-center pt-3 pb-1">
                  <div
                    className="w-8 h-px"
                    style={{ background: "rgba(255,255,255,0.12)" }}
                  />
                </div>
                <div
                  className="flex items-center justify-between px-4 pb-2"
                  style={{ fontFamily: MONO }}
                >
                  <span className="text-[9px] tracking-widest text-[#555]">
                    SYS_METRICS
                  </span>
                  <button
                    onClick={() => setSheetOpen(false)}
                    className="text-[9px] text-[#444] hover:text-[#FF0000] transition-colors px-1"
                  >
                    ✕ CLOSE
                  </button>
                </div>
                <div
                  className="h-px mx-4"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
                <div className="h-[calc(100%-52px)] overflow-hidden">
                  <SidebarContent
                    onAudit={() => {
                      setSheetOpen(false);
                      setAuditOpen(true);
                    }}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
