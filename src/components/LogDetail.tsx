"use client";
import { useEffect, useState } from "react";
import type React from "react";
import { motion, AnimatePresence } from "framer-motion";

const MONO = "'JetBrains Mono', 'Courier New', monospace";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface LogEntry {
  id: string;
  title: string;
  day: number;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "LOCKED";
  details: string;
  snippet: string;
  tags?: string[];
  customContent?: React.ReactNode;
}

interface LogDetailProps {
  entry: LogEntry | null;
  onClose: () => void;
  /** All navigable entries in order — enables prev/next arrows */
  allEntries?: LogEntry[];
  onNavigate?: (entry: LogEntry) => void;
}

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_COLOR: Record<LogEntry["status"], string> = {
  COMPLETED: "#00FF41",
  IN_PROGRESS: "#FF0000",
  PENDING: "#888",
  LOCKED: "#333"
};

function StatusBadge({ status }: { status: LogEntry["status"] }) {
  const color = STATUS_COLOR[status];
  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        animate={status === "IN_PROGRESS" ? { opacity: [1, 0.15, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: color }}
      />
      <span className="text-[10px] font-bold tracking-widest" style={{ color }}>
        {status}
      </span>
    </div>
  );
}

// ── Code block ────────────────────────────────────────────────────────────────
function CodeBlock({ code }: { code: string }) {
  const parts = code
    .replace(/([A-Z][A-Za-z_]+)\(/g, "ƒ$1(")
    .split(/(ƒ[A-Za-z_]+\(|[()';,+.])/g)
    .filter(Boolean);

  return (
    <div
      className="p-3"
      style={{
        background: "#0A0A0A",
        border: "1px solid rgba(255,255,255,0.07)"
      }}
    >
      <div
        className="flex items-center gap-1.5 mb-2 pb-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="w-2 h-2 rounded-full bg-[#FF0000]" />
        <div className="w-2 h-2 rounded-full bg-[#333]" />
        <div className="w-2 h-2 rounded-full bg-[#333]" />
        <span className="ml-2 text-[8px] text-[#333]">snippet.init.ts</span>
      </div>
      <div
        className="text-[11px] leading-relaxed text-[#888]"
        style={{ fontFamily: MONO }}
      >
        <span className="text-[#555] select-none mr-3">01</span>
        {parts.map((p, i) => {
          if (p.startsWith("ƒ"))
            return (
              <span key={i} className="text-[#FF0000]">
                {p.replace("ƒ", "")}
              </span>
            );
          if (p === "(" || p === ")")
            return (
              <span key={i} className="text-white">
                {p}
              </span>
            );
          if (p === ";")
            return (
              <span key={i} className="text-[#555]">
                {p}
              </span>
            );
          if (/^[A-Z_a-z']+$/.test(p.trim()))
            return (
              <span key={i} className="text-white">
                {p}
              </span>
            );
          return (
            <span key={i} className="text-[#888]">
              {p}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ── LogDetail ─────────────────────────────────────────────────────────────────
export default function LogDetail({
  entry,
  onClose,
  allEntries = [],
  onNavigate
}: LogDetailProps) {
  const [navDir, setNavDir] = useState<1 | -1>(1);

  // Keyboard nav + escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (!entry || !onNavigate || allEntries.length < 2) return;
      const idx = allEntries.findIndex((en) => en.day === entry.day);
      if (e.key === "ArrowRight" && idx < allEntries.length - 1) {
        setNavDir(1);
        onNavigate(allEntries[idx + 1]);
      }
      if (e.key === "ArrowLeft" && idx > 0) {
        setNavDir(-1);
        onNavigate(allEntries[idx - 1]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entry, onClose, allEntries, onNavigate]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = entry ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entry]);

  const idx = entry ? allEntries.findIndex((en) => en.day === entry.day) : -1;
  const hasPrev = idx > 0;
  const hasNext = idx >= 0 && idx < allEntries.length - 1;

  const navigate = (dir: 1 | -1) => {
    if (!onNavigate || !entry) return;
    const next = allEntries[idx + dir];
    if (next) {
      setNavDir(dir);
      onNavigate(next);
    }
  };

  return (
    <AnimatePresence>
      {entry && (
        <>
          {/* Backdrop */}
          <motion.div
            key="ld-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{
              background: "rgba(0,0,0,0.84)",
              backdropFilter: "blur(5px)"
            }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key={`ld-panel-${entry.day}`}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, x: navDir > 0 ? "100%" : "-30%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: navDir > 0 ? "-30%" : "100%" }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 36,
              mass: 0.9
            }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden w-full sm:w-[440px] md:w-[480px]"
            style={{
              background: "#050505",
              borderLeft: "1px solid #FF0000",
              fontFamily: MONO,
              boxShadow: "-12px 0 40px rgba(255,0,0,0.09)"
            }}
          >
            {/* ── Top bar ─────────────────────────────────────────────────── */}
            <div
              className="shrink-0 flex items-center justify-between px-5 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ opacity: [1, 0.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#FF0000]"
                />
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#FF0000]">
                  {entry.id}
                </span>
              </div>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 text-[9px] tracking-widest px-2.5 py-1.5
                           text-[#FF0000] transition-all touch-manipulation focus:outline-none"
                style={{
                  border: "1px solid rgba(255,0,0,0.35)",
                  background: "rgba(255,0,0,0.04)"
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,0,0,0.11)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,0,0,0.04)";
                }}
                aria-label="Close session"
              >
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.9 }}
                >
                  ✕
                </motion.span>
                <span>[ CLOSE_SESSION ]</span>
              </button>
            </div>

            {/* ── Content ─────────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {/* Title row */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[8px] tracking-widest text-[#555] mb-1">
                    MOD_{String(entry.day).padStart(2, "0")} · REDY_AGENCY
                  </p>
                  <h2 className="text-lg font-bold text-white leading-tight tracking-tight">
                    {entry.title}
                  </h2>
                </div>
                <div
                  className="shrink-0 text-[10px] font-bold px-2 py-1 tabular-nums"
                  style={{
                    background: "rgba(255,0,0,0.08)",
                    border: "1px solid rgba(255,0,0,0.25)",
                    color: "#FF0000"
                  }}
                >
                  D{String(entry.day).padStart(2, "0")}
                </div>
              </div>

              <div
                className="h-px"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />

              {/* Status */}
              <div>
                <p className="text-[8px] tracking-widest text-[#444] mb-2">
                  MODULE_STATUS
                </p>
                <StatusBadge status={entry.status} />
              </div>

              <div
                className="h-px"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />

              {/* Details */}
              <div>
                <p className="text-[8px] tracking-widest text-[#444] mb-2">
                  EXECUTION_LOG
                </p>
                <p className="text-[11px] md:text-xs leading-relaxed text-[#888]">
                  {entry.details}
                </p>
              </div>

              {/* Custom content (slider, x-ray, etc.) */}
              {entry.customContent && (
                <>
                  <div
                    className="h-px"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  />
                  {entry.customContent}
                </>
              )}

              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[8px] px-2 py-px tracking-wider text-[#555]"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div
                className="h-px"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />

              {/* Snippet */}
              <div>
                <p className="text-[8px] tracking-widest text-[#444] mb-2">
                  INIT_SNIPPET
                </p>
                <CodeBlock code={entry.snippet} />
              </div>

              {/* Meta */}
              <div
                className="text-[9px] text-[#333] space-y-1 pt-1"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="flex justify-between">
                  <span>OPERATOR</span>
                  <span className="text-[#555]">Andrea_dev</span>
                </div>
                <div className="flex justify-between">
                  <span>TARGET</span>
                  <span className="text-[#555]">Nil Ojeda · Milfshakes.es</span>
                </div>
                <div className="flex justify-between">
                  <span>AGENCY</span>
                  <span className="text-[#FF0000]">REDY</span>
                </div>
              </div>
            </div>

            {/* ── Navigation footer ───────────────────────────────────────── */}
            <div
              className="shrink-0 flex items-center justify-between px-5 py-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Prev */}
              <button
                onClick={() => navigate(-1)}
                disabled={!hasPrev}
                className="flex items-center gap-1.5 text-[9px] px-2.5 py-1.5 tracking-widest
                           transition-all touch-manipulation disabled:opacity-20 disabled:cursor-default"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: hasPrev ? "#888" : "#333"
                }}
                onMouseEnter={(e) => {
                  if (hasPrev)
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "#FF0000";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,255,255,0.1)";
                }}
              >
                ◀ PREV
              </button>

              {/* Dot indicators */}
              {allEntries.length > 1 && (
                <div className="flex items-center gap-1.5">
                  {allEntries.map((en, i) => (
                    <motion.button
                      key={en.day}
                      onClick={() => {
                        setNavDir(i > idx ? 1 : -1);
                        onNavigate?.(en);
                      }}
                      animate={
                        en.day === entry.day ? { scale: 1.2 } : { scale: 1 }
                      }
                      className="w-1.5 h-1.5 rounded-full focus:outline-none"
                      style={{
                        background: en.day === entry.day ? "#FF0000" : "#333"
                      }}
                      aria-label={`Go to module ${en.day}`}
                    />
                  ))}
                </div>
              )}

              {/* Next */}
              <button
                onClick={() => navigate(1)}
                disabled={!hasNext}
                className="flex items-center gap-1.5 text-[9px] px-2.5 py-1.5 tracking-widest
                           transition-all touch-manipulation disabled:opacity-20 disabled:cursor-default"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: hasNext ? "#888" : "#333"
                }}
                onMouseEnter={(e) => {
                  if (hasNext)
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "#FF0000";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,255,255,0.1)";
                }}
              >
                NEXT ▶
              </button>
            </div>

            {/* Bottom brand strip */}
            <div
              className="shrink-0 flex items-center justify-between px-5 py-2 text-[8px] text-[#2a2a2a]"
              style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
            >
              <span>REDY_AGENCY · PROJECT_27.LOG</span>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-[#FF0000]"
              >
                ● SECURE_CHANNEL
              </motion.span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
