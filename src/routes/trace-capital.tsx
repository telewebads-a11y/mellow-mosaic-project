import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Home, X, RotateCcw, ChevronRight, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import bearFace from "@/assets/icons/bear-face.png";
import bearTrophy from "@/assets/bear-trophy.png";
import bgClouds from "@/assets/bg-clouds.jpg";

export const Route = createFileRoute("/trace-capital")({
  head: () => ({
    meta: [
      { title: "Trace A–Z Capital Letters — Melly Kids TV" },
      { name: "description", content: "Trace capital letters from A to Z with fun colors." },
    ],
  }),
  component: TraceCapital,
});

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const TILE_COLORS = [
  "#ff6b6b", "#4ac6e8", "#ffd23f", "#6dd47e", "#b78ce8",
  "#ffb347", "#ff6b6b", "#4ac6e8", "#ffd23f", "#6dd47e",
  "#b78ce8", "#ffb347", "#ff6b6b", "#4ac6e8", "#ffd23f",
  "#6dd47e", "#b78ce8", "#ffb347", "#ff6b6b", "#4ac6e8",
  "#ffd23f", "#6dd47e", "#b78ce8", "#ffb347", "#ff6b6b", "#4ac6e8",
];

const CRAYONS = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#22c55e", // green
  "#facc15", // yellow
  "#a855f7", // purple
  "#fb923c", // orange
];

const PRAISES = ["Perfect!", "Good Job!", "Awesome!", "Well Done!", "Superstar!", "Amazing!"];

const WORDS: Record<string, string> = {
  A: "Apple", B: "Boy", C: "Cat", D: "Dog", E: "Egg", F: "Fish",
  G: "Goat", H: "Hat", I: "Ice", J: "Jug", K: "Kite", L: "Lion",
  M: "Moon", N: "Nest", O: "Owl", P: "Pen", Q: "Queen", R: "Rat",
  S: "Sun", T: "Tree", U: "Umbrella", V: "Van", W: "Web", X: "Xylophone",
  Y: "Yak", Z: "Zebra",
};

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95;
  u.pitch = 1.3;
  window.speechSynthesis.speak(u);
}

// Synthesize a clap + popper-blast burst with Web Audio
function playCelebration() {
  if (typeof window === "undefined") return;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const now = ctx.currentTime;

    // Popper "pop" — quick low thump
    const pop = ctx.createOscillator();
    const popGain = ctx.createGain();
    pop.type = "triangle";
    pop.frequency.setValueAtTime(180, now);
    pop.frequency.exponentialRampToValueAtTime(60, now + 0.18);
    popGain.gain.setValueAtTime(0.0001, now);
    popGain.gain.exponentialRampToValueAtTime(0.7, now + 0.01);
    popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    pop.connect(popGain).connect(ctx.destination);
    pop.start(now); pop.stop(now + 0.25);

    // Confetti sparkle (high noise burst)
    const sparkleBuf = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
    const sd = sparkleBuf.getChannelData(0);
    for (let i = 0; i < sd.length; i++) sd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / sd.length, 2);
    const sparkle = ctx.createBufferSource();
    sparkle.buffer = sparkleBuf;
    const sFilt = ctx.createBiquadFilter();
    sFilt.type = "highpass"; sFilt.frequency.value = 3500;
    const sGain = ctx.createGain();
    sGain.gain.setValueAtTime(0.25, now);
    sGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    sparkle.connect(sFilt).connect(sGain).connect(ctx.destination);
    sparkle.start(now + 0.05);

    // Claps — several short filtered noise bursts
    const clapTimes = [0.25, 0.36, 0.48, 0.62, 0.78, 0.96, 1.18];
    clapTimes.forEach((t) => {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.5);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filt = ctx.createBiquadFilter();
      filt.type = "bandpass"; filt.frequency.value = 1500; filt.Q.value = 0.8;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.5, now + t);
      g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.09);
      src.connect(filt).connect(g).connect(ctx.destination);
      src.start(now + t);
    });

    setTimeout(() => ctx.close(), 2000);
  } catch {
    // noop
  }
}

function TraceCapital() {
  const navigate = useNavigate();
  const [active, setActive] = useState<number | null>(null);
  const [done, setDone] = useState<{ letter: string; praise: string } | null>(null);

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url(${bgClouds})` }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/40" />

      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <button
          aria-label="Back"
          onClick={() => navigate({ to: "/scribble-trace" })}
          className="flex size-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-2 ring-white"
        >
          <ArrowLeft className="size-6" />
        </button>
        <img src={bearFace} alt="" width={56} height={56} className="size-14 drop-shadow-lg bear-bounce" />
        <Link
          to="/"
          aria-label="Home"
          className="flex size-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-2 ring-white"
        >
          <Home className="size-6" />
        </Link>
      </header>

      <h1 className="melly-title px-5 pb-3 text-center leading-tight" style={{ fontSize: "1.9rem" }}>
        <span style={{ color: "#ff6b6b" }}>T</span>
        <span style={{ color: "#ffb347" }}>r</span>
        <span style={{ color: "#ffd23f" }}>a</span>
        <span style={{ color: "#6dd47e" }}>c</span>
        <span style={{ color: "#4ac6e8" }}>e </span>
        <span style={{ color: "#b78ce8" }}>A </span>
        <span style={{ color: "#ff6b6b" }}>– </span>
        <span style={{ color: "#4ac6e8" }}>Z</span>
      </h1>

      <main className="px-3 pb-10">
        <div className="grid grid-cols-5 gap-2">
          {LETTERS.map((l, i) => (
            <button
              key={l}
              onClick={() => setActive(i)}
              className="num-cell cell-anim aspect-square flex flex-col items-center justify-center leading-tight"
              style={{
                background: TILE_COLORS[i % TILE_COLORS.length],
                animationDelay: `${(i % 10) * 0.1}s`,
              }}
              aria-label={`Trace letter ${l} for ${WORDS[l]}`}
            >
              <span style={{ fontSize: "1.7rem", lineHeight: 1 }}>{l}</span>
              <span
                style={{
                  fontFamily: "'Fredoka', 'Baloo 2', system-ui, sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  marginTop: 2,
                  color: "#fff",
                  textShadow: "1px 1px 0 rgba(0,0,0,0.25)",
                  letterSpacing: "0.02em",
                }}
              >
                for {WORDS[l]}
              </span>
            </button>
          ))}
        </div>
      </main>

      {active !== null && (
        <TraceModal
          key={LETTERS[active]}
          letter={LETTERS[active]}
          word={WORDS[LETTERS[active]]}
          onClose={() => setActive(null)}
          onComplete={() => {
            const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
            setDone({ letter: LETTERS[active], praise });
          }}
        />
      )}

      {done && (
        <SuccessModal
          letter={done.letter}
          praise={done.praise}
          onAgain={() => setDone(null)}
          onNext={() => {
            const nextIdx = active !== null && active < LETTERS.length - 1 ? active + 1 : 0;
            setDone(null);
            setActive(nextIdx);
          }}
          onClose={() => {
            setDone(null);
            setActive(null);
          }}
        />
      )}
    </div>
  );
}

function TraceModal({
  letter,
  word,
  onClose,
  onComplete,
}: {
  letter: string;
  word: string;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [color, setColor] = useState(CRAYONS[0]);
  const colorRef = useRef(color);
  colorRef.current = color;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const distanceRef = useRef(0);
  const completedRef = useRef(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    speak(`Let's trace the letter ${letter}`);
  }, [letter]);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  useEffect(() => {
    setupCanvas();
    const handler = () => setupCanvas();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    distanceRef.current = 0;
    completedRef.current = false;
    setProgress(0);
  };

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const p = getPos(e);
    lastRef.current = p;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = colorRef.current;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const p = getPos(e);
    const last = lastRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !last) return;
    ctx.strokeStyle = colorRef.current;
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    const dx = p.x - last.x;
    const dy = p.y - last.y;
    distanceRef.current += Math.sqrt(dx * dx + dy * dy);
    lastRef.current = p;

    const target = 700;
    const pct = Math.min(100, (distanceRef.current / target) * 100);
    setProgress(pct);
    if (pct >= 100 && !completedRef.current) {
      completedRef.current = true;
      setTimeout(onComplete, 250);
    }
  };

  const onPointerUp = () => {
    drawingRef.current = false;
    lastRef.current = null;
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-3" onClick={onClose}>
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-b from-sky-100 to-emerald-50 shadow-2xl ring-4 ring-white"
        style={{ height: "min(86vh, 680px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bear top-left */}
        <img
          src={bearFace}
          alt=""
          width={64}
          height={64}
          className="bear-bounce absolute left-2 top-2 z-20 drop-shadow-lg"
        />

        {/* Title */}
        <div className="absolute inset-x-0 top-3 z-10 flex justify-center pointer-events-none">
          <span
            className="melly-title"
            style={{
              fontSize: "1.5rem",
              color: "#fff",
              WebkitTextStroke: "1.5px #1d4ed8",
              filter: "drop-shadow(2px 3px 0 rgba(0,0,0,0.15))",
            }}
          >
            Trace {letter} for {word}
          </span>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-30 flex size-9 items-center justify-center rounded-full bg-white text-slate-500 shadow"
        >
          <X className="size-5" />
        </button>

        {/* Tracing area */}
        <div className="absolute inset-x-4 top-20 bottom-40 rounded-2xl bg-white/80 ring-2 ring-white shadow-inner overflow-hidden">
          {/* Guide letter */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
            <span
              style={{
                fontFamily: "'Fredoka', 'Baloo 2', system-ui, sans-serif",
                fontWeight: 900,
                fontSize: "min(70vw, 22rem)",
                lineHeight: 1,
                color: "transparent",
                WebkitTextStroke: "5px #94a3b8",
                letterSpacing: "-0.05em",
              }}
            >
              {letter}
            </span>
          </div>
          {/* Dashed inner guide */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
            <span
              style={{
                fontFamily: "'Fredoka', 'Baloo 2', system-ui, sans-serif",
                fontWeight: 900,
                fontSize: "min(70vw, 22rem)",
                lineHeight: 1,
                color: "transparent",
                WebkitTextStroke: "2px #cbd5e1",
                letterSpacing: "-0.05em",
              }}
            >
              {letter}
            </span>
          </div>
          {/* Drawing canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full touch-none"
            style={{ cursor: "crosshair" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerLeave={onPointerUp}
          />
        </div>

        {/* Progress bar */}
        <div className="absolute inset-x-6 bottom-32 z-10 h-3 rounded-full bg-white/70 ring-2 ring-white overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg,#22c55e,#16a34a)",
            }}
          />
        </div>

        {/* Color palette */}
        <div className="absolute inset-x-0 bottom-16 z-20 flex justify-center gap-2.5 px-4">
          {CRAYONS.map((c) => (
            <button
              key={c}
              aria-label={`Pick color ${c}`}
              onClick={() => setColor(c)}
              className={`crayon-shimmer size-11 rounded-full ring-4 transition ${
                color === c ? "ring-slate-700 scale-110" : "ring-white"
              } shadow-md`}
              style={{
                background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), ${c} 55%, ${c} 100%)`,
                boxShadow: `0 4px 10px ${c}80, inset 0 -3px 6px rgba(0,0,0,0.25)`,
              }}
            />
          ))}
        </div>

        {/* Bottom action buttons */}
        <div className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-3 px-4">
          <button
            onClick={clear}
            className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 font-extrabold text-slate-700 shadow-[0_4px_0_rgba(0,0,0,0.15)] ring-2 ring-white"
          >
            <RotateCcw className="size-5" /> Clear
          </button>
          <button
            onClick={() => speak(`Let's trace the letter ${letter}`)}
            aria-label="Hear it"
            className="flex size-12 items-center justify-center rounded-full bg-gradient-to-b from-sky-400 to-sky-600 text-white shadow-[0_4px_0_rgba(0,0,0,0.2)] ring-2 ring-white"
          >
            <Volume2 className="size-6" />
          </button>
          <button
            onClick={onComplete}
            className="flex items-center gap-1 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-4 py-2.5 font-extrabold text-white shadow-[0_4px_0_rgba(0,0,0,0.2)] ring-2 ring-white"
          >
            Done <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({
  letter,
  praise,
  onAgain,
  onNext,
  onClose,
}: {
  letter: string;
  praise: string;
  onAgain: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    playCelebration();
    const t = setTimeout(() => speak(`${praise} You traced the letter ${letter}!`), 350);
    return () => clearTimeout(t);
  }, [letter, praise]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3">
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-b from-amber-200 via-pink-200 to-sky-300 shadow-2xl ring-4 ring-white"
        style={{ height: "min(80vh, 600px)" }}
      >
        {/* Confetti */}
        <div aria-hidden className="absolute inset-0">
          {Array.from({ length: 24 }).map((_, i) => {
            const c = ["#ef4444", "#facc15", "#22c55e", "#3b82f6", "#a855f7", "#fb923c"][i % 6];
            const top = (i * 53) % 90 + 3;
            const left = (i * 37) % 92 + 3;
            const rot = (i * 47) % 360;
            return (
              <span
                key={i}
                className="absolute"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  width: 10,
                  height: 14,
                  background: c,
                  transform: `rotate(${rot}deg)`,
                  borderRadius: 2,
                  opacity: 0.9,
                }}
              />
            );
          })}
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-30 flex size-9 items-center justify-center rounded-full bg-white text-slate-500 shadow"
        >
          <X className="size-5" />
        </button>

        <div className="relative z-10 flex h-full flex-col items-center justify-between p-5 text-center">
          <h2
            className="melly-title"
            style={{
              color: "#fff",
              textShadow: "2px 3px 0 rgba(0,0,0,0.18)",
              fontSize: "2.6rem",
            }}
          >
            {praise}
          </h2>

          <img
            src={bearTrophy}
            alt=""
            width={220}
            height={220}
            className="bear-bounce mx-auto h-48 w-auto drop-shadow-2xl"
          />

          <p className="text-lg font-extrabold leading-snug text-white drop-shadow">
            You traced the letter <span className="text-3xl">{letter}</span> beautifully!
          </p>

          <div className="flex w-full items-center justify-center gap-3">
            <button
              onClick={onAgain}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-3 font-extrabold text-amber-600 shadow-[0_5px_0_rgba(0,0,0,0.15)]"
            >
              <RotateCcw className="size-5" /> Trace Again
            </button>
            <button
              onClick={onNext}
              className="flex items-center gap-2 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-5 py-3 font-extrabold text-white shadow-[0_5px_0_rgba(0,0,0,0.2)]"
            >
              Next <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
