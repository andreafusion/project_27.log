"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ────────────────────────────────────────────────────────────────────
export interface LogEntry {
  id: string; // e.g. "LOG_ENTRY_01"
  title: string; // e.g. "SYSTEM_GENESIS"
  day: number;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "LOCKED";
  details: string;
  snippet: string; // code-like string
  tags?: string[];
}

interface LogDetailProps {
  entry: LogEntry | null;
  onClose: () => void;
}

// ── Status pill ──────────────────────────────────────────────────────────────
const STATUS_COLOR: Record<LogEntry["status"], string> = {
  COMPLETED: "#00FF41",
  IN_PROGRESS: "#FF0000",
  PENDING: "#888888",
  LOCKED: "#333333"
};

function StatusBadge({ status }: { status: LogEntry["status"] }) {
  const color = STATUS_COLOR[status];
  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        animate={status === "IN_PROGRESS" ? { opacity: [1, 0.2, 1] } : {}}
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

// ── Code block ───────────────────────────────────────────────────────────────
function CodeBlock({ code }: { code: string }) {
  const MONO = "'JetBrains Mono', 'Courier New', monospace";

  // Tokenize the snippet for syntax-highlight feel
  const parts = code
    .replace(/([A-Z_]+)\(/g, "ƒ$1(") // functions → prefix ƒ
    .replace(/\+/g, " + ")
    .split(/(ƒ[A-Z_]+\(|[()";,+])/g)
    .filter(Boolean);

  return (
    <div
      className="rounded-none p-3 mt-1 overflow-x-auto"
      style={{
        background: "#0A0A0A",
        border: "1px solid rgba(255,255,255,0.07)",
        fontFamily: MONO
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-1.5 mb-3 pb-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: "#FF0000" }}
        />
        <div className="w-2 h-2 rounded-full" style={{ background: "#333" }} />
        <div className="w-2 h-2 rounded-full" style={{ background: "#333" }} />
        <span className="ml-2 text-[9px] text-[#333]">snippet.init.ts</span>
      </div>

      {/* Code */}
      <div className="text-[11px] leading-relaxed whitespace-pre text-[#888]">
        <span className="text-[#555] select-none mr-3">01</span>
        {parts.map((part, i) => {
          if (part.startsWith("ƒ")) {
            return (
              <span key={i} className="text-[#FF0000]">
                {part.replace("ƒ", "")}
              </span>
            );
          }
          if (part === "(")
            return (
              <span key={i} className="text-[#FFFFFF]">
                (
              </span>
            );
          if (part === ")")
            return (
              <span key={i} className="text-[#FFFFFF]">
                )
              </span>
            );
          if (part === ";")
            return (
              <span key={i} className="text-[#555]">
                ;
              </span>
            );
          if (part === "+")
            return (
              <span key={i} className="text-[#FF0000]">
                {" "}
                +
              </span>
            );
          if (/^[A-Z_a-z]+$/.test(part.trim())) {
            return (
              <span key={i} className="text-[#FFFFFF]">
                {part}
              </span>
            );
          }
          return (
            <span key={i} className="text-[#888]">
              {part}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ── LogDetail ─────────────────────────────────────────────────────────────────
const MONO = "'JetBrains Mono', 'Courier New', monospace";

export default function LogDetail({ entry, onClose }: LogDetailProps) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (entry) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [entry]);

  return (
    <AnimatePresence>
      {entry && (
        <>
          {/* ── Backdrop ─────────────────────────────────────────────────── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{
              background: "rgba(0,0,0,0.82)",
              backdropFilter: "blur(4px)"
            }}
            onClick={onClose}
            aria-label="Close log detail"
          />

          {/* ── Panel — slides from right on desktop, up on mobile ────────── */}
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Log entry ${entry.id}`}
            // Mobile: slide up from bottom
            // Desktop: slide in from right (using x transform)
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 36,
              mass: 0.9
            }}
            className="fixed right-0 top-0 bottom-0 z-50
                       flex flex-col overflow-hidden
                       w-full sm:w-[420px] md:w-[460px]"
            style={{
              background: "#050505",
              borderLeft: "1px solid #FF0000",
              fontFamily: MONO,
              boxShadow:
                "-12px 0 40px rgba(255,0,0,0.08), -2px 0 0 rgba(255,0,0,0.15)"
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
                className="group relative flex items-center gap-2
                           text-[10px] tracking-widest
                           touch-manipulation px-3 py-1.5
                           transition-all duration-150
                           focus:outline-none"
                style={{
                  border: "1px solid rgba(255,0,0,0.35)",
                  color: "#FF0000",
                  background: "rgba(255,0,0,0.04)",
                  fontFamily: MONO
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,0,0,0.12)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "#FF0000";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 10px rgba(255,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,0,0,0.04)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(255,0,0,0.35)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "none";
                }}
                aria-label="Close session"
              >
                {/* Blinking error prefix */}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.9 }}
                  style={{ color: "#FF0000", fontSize: "9px" }}
                >
                  ✕
                </motion.span>
                <span>[ CLOSE_SESSION ]</span>
              </button>
            </div>

            {/* ── Scrollable content ──────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              {/* Title + day badge */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] tracking-widest text-[#555] mb-1">
                    DAY_{String(entry.day).padStart(2, "0")}
                  </p>
                  <h2 className="text-lg md:text-xl font-bold text-white leading-tight tracking-tight">
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

              {/* Divider */}
              <div
                style={{ height: "1px", background: "rgba(255,255,255,0.06)" }}
              />

              {/* Status */}
              <div>
                <p className="text-[9px] tracking-widest text-[#444] mb-2">
                  STATUS
                </p>
                <StatusBadge status={entry.status} />
              </div>

              {/* Divider */}
              <div
                style={{ height: "1px", background: "rgba(255,255,255,0.06)" }}
              />

              {/* Details */}
              <div>
                <p className="text-[9px] tracking-widest text-[#444] mb-2">
                  EXECUTION_LOG
                </p>
                <p className="text-[11px] md:text-xs leading-relaxed text-[#888]">
                  {entry.details}
                </p>
              </div>

              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] px-2 py-px tracking-wider text-[#555]"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div
                style={{ height: "1px", background: "rgba(255,255,255,0.06)" }}
              />

              {/* Code snippet */}
              <div>
                <p className="text-[9px] tracking-widest text-[#444] mb-2">
                  INIT_SNIPPET
                </p>
                <CodeBlock code={entry.snippet} />
              </div>

              {/* Metadata footer */}
              <div
                className="text-[9px] text-[#333] space-y-1 pt-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="flex justify-between">
                  <span>OPERATOR</span>
                  <span className="text-[#555]">Andrea_dev</span>
                </div>
                <div className="flex justify-between">
                  <span>TARGET</span>
                  <span className="text-[#555]">Milfshakes.es</span>
                </div>
                <div className="flex justify-between">
                  <span>MISSION</span>
                  <span className="text-[#FF0000]">PROJECT_27.LOG</span>
                </div>
              </div>
            </div>

            {/* ── Bottom CTA ───────────────────────────────────────────────── */}
            <div
              className="shrink-0 px-5 py-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <motion.div className="flex items-center justify-between text-[9px] text-[#444]">
                <span>PROJECT_27.LOG · BUILD_001</span>
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-[#FF0000]"
                >
                  ● SECURE_CHANNEL
                </motion.span>
              </motion.div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
