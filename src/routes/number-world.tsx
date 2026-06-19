import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Volume2, ArrowRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import bearFace from "@/assets/icons/bear-face.png";
import bgJungle from "@/assets/bg-clouds.jpg";

export const Route = createFileRoute("/number-world")({
  head: () => ({
    meta: [
      { title: "Number World — Counting 1 to 100 | Melly Kids TV" },
      { name: "description", content: "Learn counting from 1 to 100 with fun colorful tiles and playful objects." },
    ],
  }),
  component: NumberWorld,
});

const COLORS = [
  "#ef4444","#3b82f6","#facc15","#22c55e","#fb923c",
  "#ef4444","#3b82f6","#facc15","#22c55e","#a855f7",
];

const OBJECTS = ["🍎","⭐","🍌","🐝","🌸","🐞","🍓","🐠","🎈","🧁","🍇","🦋","🍒","🌼","🐢","🍊","🍉","🐥","🥕","🌻"];
function objectFor(n: number) { return OBJECTS[(n - 1) % OBJECTS.length]; }

const ONES = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"];
const TEENS = ["Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
const TENS = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
function spell(n: number): string {
  if (n === 100) return "One Hundred";
  if (n < 10) return ONES[n];
  if (n < 20) return TEENS[n - 10];
  const t = Math.floor(n / 10), o = n % 10;
  return o === 0 ? TENS[t] : `${TENS[t]}-${ONES[o]}`;
}

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9; u.pitch = 1.3;
  window.speechSynthesis.speak(u);
}

// Deterministic scatter positions around the edges of the modal, avoiding center
function scatterPositions(n: number, seed: number): Array<{ top: string; left: string; rot: number; size: number }> {
  const out = [];
  // pseudo-random based on seed
  let s = seed * 9301 + 49297;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = 0; i < n; i++) {
    // choose an edge band: 0=top,1=bottom,2=left,3=right
    let top: number, left: number;
    const band = i % 4;
    if (band === 0) { top = 2 + rnd() * 18; left = 2 + rnd() * 96; }
    else if (band === 1) { top = 78 + rnd() * 20; left = 2 + rnd() * 96; }
    else if (band === 2) { top = 18 + rnd() * 64; left = 1 + rnd() * 14; }
    else { top = 18 + rnd() * 64; left = 84 + rnd() * 14; }
    out.push({ top: `${top}%`, left: `${left}%`, rot: Math.floor(rnd() * 60 - 30), size: 18 + Math.floor(rnd() * 14) });
  }
  return out;
}

function NumberWorld() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active !== null) speak(`${active}. ${spell(active)}`);
  }, [active]);

  const close = () => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setActive(null);
  };
  const next = () => setActive((n) => (n === null ? 1 : n >= 100 ? 1 : n + 1));

  const positions = useMemo(() => (active ? scatterPositions(active, active) : []), [active]);

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-top bg-no-repeat" style={{ backgroundImage: `url(${bgJungle})` }} />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/40" />

      <header className="flex items-center justify-between px-4 pt-5 pb-3">
        <Link to="/" aria-label="Back" className="flex size-11 items-center justify-center rounded-full bg-white/90 text-sky-500 shadow-md ring-2 ring-white transition hover:scale-105">
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="nw-title">Number World</h1>
        <div className="size-11" />
      </header>

      <main className="px-3 pb-28">
        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => setActive(n)} className="num-cell" style={{ background: COLORS[(n - 1) % COLORS.length] }} aria-label={`Number ${n}`}>
              {n}
            </button>
          ))}
        </div>
      </main>

      {active !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-3" onClick={close}>
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-b from-sky-100 to-emerald-50 shadow-2xl ring-4 ring-white"
            style={{ height: "min(82vh, 640px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scattered objects around the edges (absolute, behind content) */}
            <div aria-hidden className="absolute inset-0">
              {positions.map((p, i) => (
                <span
                  key={i}
                  className="absolute select-none leading-none"
                  style={{ top: p.top, left: p.left, transform: `translate(-50%,-50%) rotate(${p.rot}deg)`, fontSize: `${p.size}px` }}
                >
                  {objectFor(active)}
                </span>
              ))}
            </div>

            {/* Bear mascot on the left */}
            <img src={bearFace} alt="" width={72} height={72} className="bear-bounce absolute left-2 bottom-20 z-10 drop-shadow-lg" />

            {/* Close */}
            <button onClick={close} aria-label="Close" className="absolute right-3 top-3 z-20 flex size-9 items-center justify-center rounded-full bg-white text-slate-500 shadow">
              <X className="size-5" />
            </button>

            {/* Center big number with eyes + spelling */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
              <div className="relative">
                <span className="big-num" style={{ color: COLORS[(active - 1) % COLORS.length] }}>
                  {active}
                </span>
                {/* googly eyes */}
                <span className="eye" style={{ top: "22%", left: "28%" }}><span className="pupil" /></span>
                <span className="eye" style={{ top: "22%", left: "58%" }}><span className="pupil" /></span>
              </div>
              <div className="mt-2 rounded-full bg-white/85 px-5 py-1.5 text-2xl font-extrabold tracking-wide text-slate-700 shadow ring-2 ring-white">
                {active} — {spell(active).toUpperCase()}
              </div>
            </div>

            {/* Buttons pinned to bottom */}
            <div className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-3">
              <button onClick={() => speak(`${active}. ${spell(active)}`)} className="flex items-center gap-2 rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 px-5 py-3 font-extrabold text-white shadow-[0_5px_0_rgba(0,0,0,0.15)] active:translate-y-[2px]">
                <Volume2 className="size-5" />
                Replay
              </button>
              <button onClick={next} className="flex items-center gap-2 rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 px-5 py-3 font-extrabold text-white shadow-[0_5px_0_rgba(0,0,0,0.15)] active:translate-y-[2px]">
                <ArrowRight className="size-5" />
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
