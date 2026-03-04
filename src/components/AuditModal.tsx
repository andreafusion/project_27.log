"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MONO = "'JetBrains Mono', 'Courier New', monospace";

// ── Audit data ────────────────────────────────────────────────────────────────
const AUDIT_ROWS = [
  {
    key: "TOTAL_JS_REDUCED",
    value: "235 KiB",
    delta: "−235",
    color: "#00FF41",
    unit: ""
  },
  {
    key: "LATENCY_OPTIMIZED",
    value: "−6.6s",
    delta: "−86%",
    color: "#00FF41",
    unit: ""
  },
  {
    key: "LCP_IMPROVEMENT",
    value: "7.7s → 1.1s",
    delta: "−86%",
    color: "#00FF41",
    unit: ""
  },
  {
    key: "TOTAL_BLOCKING_TIME",
    value: "1,520 → 90ms",
    delta: "−94%",
    color: "#00FF41",
    unit: ""
  },
  {
    key: "MULTIMEDIA_LOAD",
    value: "94% FASTER",
    delta: "+400%",
    color: "#00FF41",
    unit: ""
  },
  {
    key: "IMAGE_SAVINGS",
    value: "570 KiB",
    delta: "WebP",
    color: "#FF0000",
    unit: ""
  },
  {
    key: "CODEC_UPGRADE",
    value: "H.264 → AV1",
    delta: "ASYNC",
    color: "#FFFFFF",
    unit: ""
  },
  {
    key: "STATUS",
    value: "SYSTEM_STABILIZING",
    delta: "▶",
    color: "#FF0000",
    unit: ""
  }
];

const MODULES = [
  { id: "MOD_01", name: "SYSTEM_GENESIS", status: "ONLINE", color: "#FF0000" },
  { id: "MOD_02", name: "THE_LCP_KILLER", status: "ONLINE", color: "#FF0000" },
  {
    id: "MOD_03",
    name: "CREATIVE_DIRECTION",
    status: "ONLINE",
    color: "#FF0000"
  },
  {
    id: "MOD_04",
    name: "PENDING_DEPLOY",
    status: "DEPLOYING",
    color: "#FF8800"
  }
];

interface AuditModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuditModal({ open, onClose }: AuditModalProps) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="audit-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60]"
            style={{
              background: "rgba(0,0,0,0.88)",
              backdropFilter: "blur(6px)"
            }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="audit-modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="fixed z-[61] inset-x-3 top-[50%] -translate-y-1/2
                       sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2
                       sm:w-[520px] max-h-[85svh] flex flex-col overflow-hidden"
            style={{
              background: "#050505",
              border: "1px solid #FF0000",
              boxShadow:
                "0 0 40px rgba(255,0,0,0.12), 0 0 80px rgba(255,0,0,0.05)",
              fontFamily: MONO
            }}
          >
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div
              className="shrink-0 flex items-center justify-between px-5 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ opacity: [1, 0.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#FF0000]"
                />
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#FF0000]">
                  SYSTEM_AUDIT_REPORT
                </span>
                <span className="text-[9px] text-[#333]">v1.0</span>
              </div>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 text-[9px] tracking-widest px-2 py-1
                           text-[#FF0000] transition-all touch-manipulation"
                style={{
                  border: "1px solid rgba(255,0,0,0.3)",
                  background: "rgba(255,0,0,0.04)"
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,0,0,0.04)";
                }}
                aria-label="Close audit"
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

            {/* ── Scrollable body ──────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* ── Module status grid ────────────────────────────────────── */}
              <div>
                <p className="text-[9px] tracking-[0.2em] text-[#555] mb-3">
                  ACTIVE_MODULES
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {MODULES.map((m, i) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-2 px-2 py-1.5"
                      style={{
                        border: `1px solid ${m.color}22`,
                        background: `${m.color}06`
                      }}
                    >
                      <motion.div
                        animate={
                          m.status === "DEPLOYING"
                            ? { opacity: [1, 0.1, 1] }
                            : { opacity: 1 }
                        }
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-1 h-1 rounded-full shrink-0"
                        style={{ background: m.color }}
                      />
                      <div className="min-w-0">
                        <div className="text-[8px] text-[#555] truncate">
                          {m.id}
                        </div>
                        <div
                          className="text-[9px] font-bold truncate"
                          style={{ color: m.color }}
                        >
                          {m.name}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div
                className="h-px"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />

              {/* ── Audit metrics ─────────────────────────────────────────── */}
              <div>
                <p className="text-[9px] tracking-[0.2em] text-[#555] mb-3">
                  LIGHTHOUSE_DELTA
                </p>
                <div className="space-y-2">
                  {AUDIT_ROWS.map((row, i) => (
                    <motion.div
                      key={row.key}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18 + i * 0.055 }}
                      className="flex items-center justify-between py-1.5 px-2"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        background:
                          i % 2 === 0
                            ? "rgba(255,255,255,0.015)"
                            : "transparent"
                      }}
                    >
                      <span className="text-[9px] text-[#555] tracking-wider">
                        {row.key}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[9px] font-bold tabular-nums"
                          style={{ color: row.color }}
                        >
                          {row.value}
                        </span>
                        <span
                          className="text-[8px] px-1 py-px"
                          style={{
                            background: `${row.color}15`,
                            border: `1px solid ${row.color}30`,
                            color: row.color
                          }}
                        >
                          {row.delta}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div
                className="h-px"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />

              {/* ── Conclusion block ──────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="p-3"
                style={{
                  border: "1px solid rgba(255,0,0,0.2)",
                  background: "rgba(255,0,0,0.03)"
                }}
              >
                <p className="text-[9px] tracking-[0.2em] text-[#555] mb-2">
                  OPERATOR_ASSESSMENT
                </p>
                <p className="text-[10px] leading-relaxed text-[#888]">
                  3 módulos desplegados. Infraestructura estabilizada. El
                  sistema Fusion opera con métricas de élite. Nil Ojeda puede
                  verificar cada optimización en producción.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-[#FF0000]"
                  />
                  <span className="text-[9px] font-bold text-[#FF0000]">
                    Andrea Fusion · Andrea_dev
                  </span>
                </div>
              </motion.div>
            </div>

            {/* ── Footer ──────────────────────────────────────────────────── */}
            <div
              className="shrink-0 flex items-center justify-between px-5 py-3 text-[9px] text-[#333]"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span>PROJECT_27.LOG · AUDIT_v1.0</span>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-[#FF0000]"
              >
                ● SECURE_CHANNEL
              </motion.span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
