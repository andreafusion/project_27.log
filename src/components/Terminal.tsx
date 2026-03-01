"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: "BIOS v2.27.0  ·  MILFSHAKES_ENGINE", delay: 0, color: "#888" },
  { text: "", delay: 200 },
  {
    text: "[INIT]    Project_27.log",
    delay: 400,
    color: "#FF0000",
    bold: true
  },
  { text: "[TARGET]  Milfshakes.es", delay: 900, color: "#FF0000", bold: true },
  { text: "[OPERATOR] Andrea_dev", delay: 1400, color: "#FFFFFF" },
  { text: "", delay: 1700 },
  {
    text: "[AUDIT]   Streetwear_Engine..........",
    delay: 1900,
    suffix: " OK",
    suffixColor: "#00FF41"
  },
  {
    text: "[AUDIT]   Drop_Scheduler.............",
    delay: 2600,
    suffix: " OK",
    suffixColor: "#00FF41"
  },
  {
    text: "[AUDIT]   Hype_Analytics.............",
    delay: 3200,
    suffix: " OK",
    suffixColor: "#00FF41"
  },
  {
    text: "[AUDIT]   Brand_Core_v1.0............",
    delay: 3800,
    suffix: " OK",
    suffixColor: "#00FF41"
  },
  { text: "", delay: 4100 },
  {
    text: "[LOAD]    Racing_Aesthetic.css.......",
    delay: 4200,
    suffix: " LOADED",
    suffixColor: "#00FF41"
  },
  {
    text: "[LOAD]    Urban_Kit.js...............",
    delay: 4700,
    suffix: " LOADED",
    suffixColor: "#00FF41"
  },
  {
    text: "[LOAD]    Brutalist_Grid.module......",
    delay: 5100,
    suffix: " LOADED",
    suffixColor: "#00FF41"
  },
  { text: "", delay: 5400 },
  {
    text: "[STATUS]  Days_Remaining: 27",
    delay: 5500,
    color: "#FF0000",
    bold: true
  },
  {
    text: "[STATUS]  Mission: IMPRESS_NIL_OJEDA",
    delay: 6000,
    color: "#FF0000",
    bold: true
  },
  { text: "", delay: 6400 },
  { text: "[EXEC]    Launching dashboard interface...", delay: 6500 }
];

const TYPING_SPEED = 22; // ms per char

export default function Terminal({ onComplete }: TerminalProps) {
  const [visibleLines, setVisibleLines] = useState<
    {
      text: string;
      color?: string;
      bold?: boolean;
      suffix?: string;
      suffixColor?: string;
      typed: string;
      done: boolean;
    }[]
  >([]);
  const [glitch, setGlitch] = useState(false);
  const [exit, setExit] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, index) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines((prev) => [
            ...prev,
            { ...line, typed: "", done: false }
          ]);

          const chars = line.text.split("");
          chars.forEach((_, ci) => {
            timers.push(
              setTimeout(() => {
                setVisibleLines((prev) =>
                  prev.map((l, li) =>
                    li === index
                      ? {
                          ...l,
                          typed: line.text.slice(0, ci + 1),
                          done: ci === chars.length - 1
                        }
                      : l
                  )
                );
              }, ci * TYPING_SPEED)
            );
          });

          if (chars.length === 0) {
            setVisibleLines((prev) =>
              prev.map((l, li) => (li === index ? { ...l, done: true } : l))
            );
          }
        }, line.delay)
      );
    });

    // Glitch exit
    const lastDelay = BOOT_LINES[BOOT_LINES.length - 1].delay;
    const totalTyping =
      BOOT_LINES[BOOT_LINES.length - 1].text.length * TYPING_SPEED;

    timers.push(
      setTimeout(
        () => {
          setGlitch(true);
          setTimeout(() => setExit(true), 800);
          setTimeout(() => onComplete(), 1400);
        },
        lastDelay + totalTyping + 600
      )
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: "blur(8px) brightness(2)",
            scaleY: 0.02,
            transition: { duration: 0.6, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: "#050505" }}
        >
          {/* CRT scanline overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)"
            }}
          />

          {/* Glitch overlay */}
          {glitch && (
            <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
              <motion.div
                animate={{
                  x: [0, -6, 10, -3, 0],
                  opacity: [0, 0.7, 0.4, 0.9, 0]
                }}
                transition={{ duration: 0.8, times: [0, 0.2, 0.5, 0.7, 1] }}
                className="absolute inset-0"
                style={{
                  background: "#FF0000",
                  mixBlendMode: "screen",
                  opacity: 0
                }}
              />
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: [0, (Math.random() - 0.5) * 40]
                  }}
                  transition={{ delay: i * 0.08, duration: 0.15 }}
                  className="absolute w-full"
                  style={{
                    height: `${Math.random() * 4 + 1}px`,
                    top: `${Math.random() * 100}%`,
                    background: i % 2 === 0 ? "#FF0000" : "#FFFFFF",
                    opacity: 0
                  }}
                />
              ))}
            </div>
          )}

          {/* Terminal header bar */}
          <div
            className="flex items-center gap-3 px-6 py-3 border-b border-white/10"
            style={{ background: "#0A0A0A" }}
          >
            <div className="flex gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: "#FF0000" }}
              />
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: "#888" }}
              />
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: "#444" }}
              />
            </div>
            <span
              className="text-xs tracking-widest ml-4"
              style={{
                color: "#888",
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              PROJECT_27.LOG — BOOT_SEQUENCE v1.0
            </span>
            <div
              className="ml-auto text-xs"
              style={{
                color: "#444",
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              ▶ EXECUTING
            </div>
          </div>

          {/* Terminal output */}
          <div
            ref={containerRef}
            className="flex-1 overflow-hidden px-8 py-6 flex flex-col justify-start"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <div className="mb-6 text-xs" style={{ color: "#222" }}>
              ──────────────────────────────────────────────────────────────────────────
            </div>

            {visibleLines.map((line, i) => (
              <div
                key={i}
                className="mb-1 text-sm leading-relaxed flex items-baseline"
                style={{ minHeight: "1.5rem" }}
              >
                {line.text === "" ? (
                  <span>&nbsp;</span>
                ) : (
                  <>
                    <span
                      style={{
                        color: line.color || "#AAAAAA",
                        fontWeight: line.bold ? "bold" : "normal"
                      }}
                    >
                      {line.typed}
                    </span>
                    {line.done && line.suffix && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: line.suffixColor, marginLeft: "4px" }}
                      >
                        {line.suffix}
                      </motion.span>
                    )}
                    {!line.done && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 0.7 }}
                        style={{ color: "#FF0000", marginLeft: "2px" }}
                      >
                        █
                      </motion.span>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Bottom status bar */}
          <div
            className="flex items-center justify-between px-6 py-2 border-t border-white/10 text-xs"
            style={{
              background: "#0A0A0A",
              fontFamily: "'JetBrains Mono', monospace",
              color: "#444"
            }}
          >
            <span>MILFSHAKES_ENGINE © 2025</span>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              style={{ color: "#FF0000" }}
            >
              ● LIVE
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
