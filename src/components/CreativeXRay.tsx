"use client";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  animate
} from "framer-motion";

const MONO = "'JetBrains Mono', 'Courier New', monospace";
const RED = "#FF0000";
const RADIUS = 110; // px — X-Ray circle radius

// ── Floating label positions (relative to cursor) ────────────────────────────
const FLOAT_LABELS = [
  { text: "FPS: 60", dx: 20, dy: -60, delay: 0 },
  { text: "CODEC: AV1", dx: 70, dy: 10, delay: 0.08 },
  { text: "BITRATE: OPT", dx: 14, dy: 52, delay: 0.16 },
  { text: "FRAME: PROGRESSIVE", dx: -90, dy: -38, delay: 0.06 },
  { text: "CONTAINER: WebM", dx: -85, dy: 40, delay: 0.12 }
];

// ── Wireframe grid lines (drawn on canvas) ────────────────────────────────────
function useWireframeCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  cx: number,
  cy: number,
  active: boolean
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let tick = 0;

    const draw = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      if (!active) {
        raf = requestAnimationFrame(draw);
        return;
      }

      // Save + clip to circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, RADIUS, 0, Math.PI * 2);
      ctx.clip();

      // Background tint inside circle
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 0, W, H);

      // ── Horizontal scan lines (slow drift) ───────────────────────────
      const lineGap = 18;
      const offset = (tick * 0.4) % lineGap;
      ctx.strokeStyle = "rgba(255,0,0,0.18)";
      ctx.lineWidth = 0.5;
      for (let y = offset; y < H; y += lineGap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // ── Vertical lines ───────────────────────────────────────────────
      ctx.strokeStyle = "rgba(255,0,0,0.10)";
      for (let x = offset; x < W; x += lineGap * 1.5) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }

      // ── "Code rain" — vertical red characters ────────────────────────
      const chars = "01■▸▹◆░▒▓";
      const columns = Math.floor((RADIUS * 2) / 14);
      const startX = cx - RADIUS;
      ctx.font = "bold 10px 'JetBrains Mono', monospace";

      for (let c = 0; c < columns; c++) {
        const x = startX + c * 14;
        const yPos = ((tick * 1.2 + c * 37) % (RADIUS * 2.2)) - 20;
        const y = cy - RADIUS + yPos;
        const alpha = Math.max(0, 1 - yPos / (RADIUS * 2));
        ctx.fillStyle = `rgba(255,0,0,${alpha * 0.55})`;
        ctx.fillText(chars[(c + Math.floor(tick * 0.3)) % chars.length], x, y);
        // Fading trail
        ctx.fillStyle = `rgba(255,0,0,${alpha * 0.18})`;
        ctx.fillText(
          chars[(c + Math.floor(tick * 0.2) + 2) % chars.length],
          x,
          y - 14
        );
      }

      // ── Circle border glow ───────────────────────────────────────────
      const glowAlpha = 0.6 + Math.sin(tick * 0.08) * 0.3;
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = `rgba(255,0,0,${glowAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = RED;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, RADIUS, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      tick++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [canvasRef, cx, cy, active]);
}

// ── Glitch flash ─────────────────────────────────────────────────────────────
function GlitchFlash({ trigger }: { trigger: number }) {
  return (
    <AnimatePresence>
      {trigger > 0 && (
        <motion.div
          key={trigger}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0, 0.4, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, times: [0, 0.1, 0.3, 0.5, 1] }}
          className="absolute inset-0 pointer-events-none z-20"
          style={{ background: "rgba(255,0,0,0.12)", mixBlendMode: "screen" }}
        />
      )}
    </AnimatePresence>
  );
}

// ── Main-thread counter ───────────────────────────────────────────────────────
function ThreadCounter({ scanning }: { scanning: boolean }) {
  const [val, setVal] = useState(14.0);
  const [peaked, setPeaked] = useState(false);

  useEffect(() => {
    if (scanning && !peaked) {
      const ctrl = animate(14.0, 0.8, {
        duration: 2.2,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => setVal(parseFloat(v.toFixed(1))),
        onComplete: () => setPeaked(true)
      });
      return () => ctrl.stop();
    }
    if (!scanning) {
      const ctrl = animate(val, 14.0, {
        duration: 0.8,
        ease: "easeIn",
        onUpdate: (v) => setVal(parseFloat(v.toFixed(1))),
        onComplete: () => setPeaked(false)
      });
      return () => ctrl.stop();
    }
  }, [scanning]);

  const isGood = val < 2;
  return (
    <div
      className="absolute bottom-3 right-3 z-20 px-2 py-1.5"
      style={{
        background: "rgba(0,0,0,0.88)",
        border: `1px solid ${isGood ? "#00FF41" : RED}`,
        fontFamily: MONO,
        minWidth: "148px"
      }}
    >
      <div className="text-[8px] tracking-widest text-[#555] mb-0.5">
        MAIN_THREAD_WORK
      </div>
      <div className="flex items-end gap-1.5">
        <motion.span
          className="text-lg font-bold tabular-nums leading-none"
          style={{ color: isGood ? "#00FF41" : RED }}
          animate={scanning && val < 1 ? { scale: [1, 1.08, 1] } : {}}
          transition={{ repeat: 2, duration: 0.25 }}
        >
          {val.toFixed(1)}s
        </motion.span>
        {isGood && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[9px] text-[#00FF41] pb-0.5"
          >
            ▼ 94%
          </motion.span>
        )}
      </div>
      <div
        className="mt-1 h-px w-full"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <motion.div
          className="h-full"
          animate={{ width: `${((14 - val) / (14 - 0.8)) * 100}%` }}
          transition={{ duration: 0.05 }}
          style={{
            background: isGood ? "#00FF41" : RED,
            boxShadow: `0 0 4px ${isGood ? "#00FF41" : RED}`
          }}
        />
      </div>
    </div>
  );
}

// ── CreativeXRay ─────────────────────────────────────────────────────────────
export default function CreativeXRay() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [pos, setPos] = useState({ x: -300, y: -300 });
  const [scanning, setScanning] = useState(false);
  const [glitch, setGlitch] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Spring-smoothed cursor
  const rawX = useMotionValue(-300);
  const rawY = useMotionValue(-300);
  const sX = useSpring(rawX, { stiffness: 320, damping: 32 });
  const sY = useSpring(rawY, { stiffness: 320, damping: 32 });

  // Track canvas size
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Glitch at edges
  const triggerGlitch = useCallback(
    (x: number, y: number, w: number, h: number) => {
      const margin = RADIUS * 0.9;
      if (x < margin || x > w - margin || y < margin || y > h - margin) {
        setGlitch((g) => g + 1);
      }
    },
    []
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      const el = wrapRef.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      rawX.set(x);
      rawY.set(y);
      setPos({ x, y });
      triggerGlitch(x, y, width, height);
    },
    [rawX, rawY, triggerGlitch]
  );

  const onMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  const onEnter = () => setScanning(true);
  const onLeave = () => {
    setScanning(false);
    rawX.set(-300);
    rawY.set(-300);
  };

  // Wire wireframe canvas
  useWireframeCanvas(canvasRef, pos.x, pos.y, scanning);

  // Sync canvas size
  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.width = size.w || 600;
    canvasRef.current.height = size.h || 280;
  }, [size]);

  // X-Ray clip-path string (circle mask for the B&W video layer)
  const clipPath = scanning
    ? `circle(${RADIUS}px at ${pos.x}px ${pos.y}px)`
    : `circle(0px at ${pos.x}px ${pos.y}px)`;

  return (
    <div style={{ fontFamily: MONO }}>
      {/* ── Video wrapper ─────────────────────────────────────────────────── */}
      <div
        ref={wrapRef}
        className="relative overflow-hidden select-none"
        style={{
          height: "240px",
          background: "#070707",
          border: "1px solid rgba(255,255,255,0.07)",
          cursor: "none"
        }}
        onMouseMove={onMouseMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onTouchMove={onTouchMove}
        onTouchStart={onEnter}
        onTouchEnd={onLeave}
      >
        {/* ── BG label: MULTIMEDIA (outline) ───────────────────────────── */}
        <div
          className="absolute inset-0 flex items-center justify-center
                     pointer-events-none overflow-hidden z-0"
          aria-hidden="true"
        >
          <span
            className="font-black tracking-tighter leading-none whitespace-nowrap"
            style={{
              fontSize: "clamp(52px, 10vw, 88px)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,0,0,0.08)",
              userSelect: "none"
            }}
          >
            MULTIMEDIA
          </span>
        </div>

        {/* ── LAYER 1: Full-colour video ────────────────────────────────── */}
        <video
          ref={videoRef}
          src="/milfshakes-reel.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center z-1"
          style={{ filter: "brightness(0.85)" }}
        />

        {/* ── LAYER 2: Grayscale video, clipped to X-Ray circle ─────────── */}
        <motion.div
          className="absolute inset-0 z-10"
          animate={{ clipPath }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          style={{ willChange: "clip-path" }}
        >
          <video
            src="/milfshakes-reel.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center"
            style={{
              filter: "grayscale(1) contrast(1.6) brightness(1.1)",
              pointerEvents: "none"
            }}
          />
        </motion.div>

        {/* ── LAYER 3: Wireframe canvas ─────────────────────────────────── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ mixBlendMode: "screen" }}
        />

        {/* ── Glitch flash ──────────────────────────────────────────────── */}
        <GlitchFlash trigger={glitch} />

        {/* ── Custom cursor dot ────────────────────────────────────────── */}
        <AnimatePresence>
          {scanning && (
            <motion.div
              key="cursor"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="absolute pointer-events-none z-30"
              style={{
                left: sX,
                top: sY,
                translateX: "-50%",
                translateY: "-50%"
              }}
            >
              {/* Cross-hair */}
              <div className="relative w-4 h-4">
                <div
                  className="absolute top-1/2 left-0 right-0 h-px"
                  style={{ background: RED }}
                />
                <div
                  className="absolute left-1/2 top-0 bottom-0 w-px"
                  style={{ background: RED }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Floating labels ───────────────────────────────────────────── */}
        <AnimatePresence>
          {scanning &&
            FLOAT_LABELS.map((label) => (
              <motion.div
                key={label.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: label.delay, duration: 0.15 }}
                className="absolute pointer-events-none z-30 whitespace-nowrap"
                style={{
                  left: sX,
                  top: sY,
                  translateX: `calc(-50% + ${label.dx}px)`,
                  translateY: `calc(-50% + ${label.dy}px)`
                }}
              >
                <div
                  className="text-[8px] font-bold tracking-widest px-1.5 py-0.5"
                  style={{
                    background: "rgba(0,0,0,0.85)",
                    border: `1px solid ${RED}`,
                    color: RED
                  }}
                >
                  {label.text}
                </div>
              </motion.div>
            ))}
        </AnimatePresence>

        {/* ── Thread counter (bottom-right) ─────────────────────────────── */}
        <ThreadCounter scanning={scanning} />

        {/* ── "SCAN TO AUDIT" hint (fades once used) ────────────────────── */}
        <AnimatePresence>
          {!scanning && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center
                         pointer-events-none z-20"
            >
              <motion.div
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center gap-2 px-3 py-1.5"
                style={{
                  background: "rgba(0,0,0,0.72)",
                  border: "1px solid rgba(255,0,0,0.3)"
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" stroke={RED} strokeWidth="1" />
                  <line
                    x1="5"
                    y1="2"
                    x2="5"
                    y2="8"
                    stroke={RED}
                    strokeWidth="1"
                  />
                  <line
                    x1="2"
                    y1="5"
                    x2="8"
                    y2="5"
                    stroke={RED}
                    strokeWidth="1"
                  />
                </svg>
                <span
                  className="text-[9px] tracking-widest"
                  style={{ color: RED }}
                >
                  HOVER TO SCAN
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Stats panel ───────────────────────────────────────────────────── */}
      <div
        className="mt-3 p-3"
        style={{
          background: "#0A0A0A",
          border: "1px solid rgba(255,255,255,0.07)"
        }}
      >
        <div
          className="flex items-center justify-between text-[9px] pb-2 mb-2"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            color: "#555"
          }}
        >
          <span className="tracking-[0.2em]">MULTIMEDIA_AUDIT</span>
          <span className="text-[#333]">batido.xyz pipeline</span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {[
            {
              k: "TOTAL_BLOCKING_TIME",
              before: "1,520ms",
              after: "90ms",
              delta: "−94%",
              good: true
            },
            {
              k: "MAIN_THREAD_WORK",
              before: "14.0s",
              after: "0.8s",
              delta: "−94%",
              good: true
            },
            {
              k: "VIDEO_CODEC",
              before: "H.264",
              after: "AV1",
              delta: "NEXT",
              good: true
            },
            {
              k: "DELIVERY",
              before: "SYNC",
              after: "ASYNC",
              delta: "FREE",
              good: true
            }
          ].map((row) => (
            <div key={row.k}>
              <div className="text-[8px] text-[#444] mb-0.5 tracking-wider">
                {row.k}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[9px] line-through text-[#333]">
                  {row.before}
                </span>
                <span
                  className="text-[10px] font-bold"
                  style={{ color: row.good ? "#00FF41" : RED }}
                >
                  {row.after}
                </span>
                <span
                  className="text-[8px]"
                  style={{ color: row.good ? "#00FF41" : RED }}
                >
                  {row.delta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
