import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, X, Home, Volume2, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import bearFace from "@/assets/icons/bear-face.png";
import bearTrophy from "@/assets/bear-trophy.png";
import btnReplay from "@/assets/icons/btn-replay.png";
import btnNext from "@/assets/icons/btn-next.png";
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

const MILESTONES: Record<number, { title: string; msg: string }> = {
  20:  { title: "Way to Go!",     msg: "Awesome! You finished counting 1 to 20!" },
  50:  { title: "Halfway There!", msg: "Wow! You reached 50 — you're a counting star!" },
  100: { title: "You Did It!",    msg: "100 numbers! You're a Counting Hero!" },
};


function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95; u.pitch = 1.3;
  window.speechSynthesis.speak(u);
}

const MILESTONE_STEPS = [20, 50, 100];


// Non-overlapping scatter positions around the edges, avoiding the center
// (where the big number, mic and next buttons live).
function scatterPositions(n: number, seed: number): Array<{ top: number; left: number; rot: number; size: number }> {
  const out: Array<{ top: number; left: number; rot: number; size: number }> = [];
  let s = seed * 9301 + 49297;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const size = 26; // px-ish; matches fontSize used below
  const minDist = 11; // % distance between centers
  // Safe edge bands as % of modal box:
  // top band (above the number), left/right side bands, NO bottom band (buttons live there)
  const inSafeZone = (top: number, left: number) => {
    // forbid center column for number+spelling
    const inNumberBox = top > 28 && top < 70 && left > 18 && left < 82;
    // forbid bottom buttons zone
    const inButtons = top > 78;
    // forbid top-left where the bear sits
    const inBear = top < 22 && left < 28;
    // forbid top-center where the title sits
    const inTitle = top < 14 && left > 25 && left < 75;
    return !(inNumberBox || inButtons || inBear || inTitle);
  };
  let tries = 0;
  while (out.length < n && tries < 4000) {
    tries++;
    const top = 3 + rnd() * 74;   // 3..77
    const left = 3 + rnd() * 94;  // 3..97
    if (!inSafeZone(top, left)) continue;
    let ok = true;
    for (const p of out) {
      const dx = p.left - left, dy = p.top - top;
      if (Math.sqrt(dx * dx + dy * dy) < minDist) { ok = false; break; }
    }
    if (!ok) continue;
    out.push({ top, left, rot: Math.floor(rnd() * 50 - 25), size });
  }
  return out;
}

function NumberWorld() {
  const [active, setActive] = useState<number | null>(null);
  const [milestone, setMilestone] = useState<number | null>(null);

  useEffect(() => {
    if (active !== null) speak(spell(active));
  }, [active]);

  useEffect(() => {
    if (milestone !== null) {
      const m = MILESTONES[milestone];
      if (m) speak(`${m.title}. ${m.msg}`);
    }
  }, [milestone]);

  const close = () => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setActive(null);
  };
  const next = () => {
    setActive((n) => {
      if (n === null) return 1;
      if (MILESTONE_STEPS.includes(n)) {
        setMilestone(n);
        return n;
      }
      return n >= 100 ? 1 : n + 1;
    });
  };

  const continueAfterMilestone = () => {
    const m = milestone;
    setMilestone(null);
    if (m !== null) setActive(m >= 100 ? 1 : m + 1);
  };

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

      {active !== null && milestone === null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-3" onClick={close}>
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-b from-sky-100 to-emerald-50 shadow-2xl ring-4 ring-white"
            style={{ height: "min(82vh, 640px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title top-center — colorful rainbow */}
            <div className="absolute inset-x-0 top-3 z-20 flex justify-center pointer-events-none">
              <span
                className="nw-title"
                style={{
                  fontSize: "2rem",
                  background: "linear-gradient(90deg,#ef4444,#fb923c,#facc15,#22c55e,#3b82f6,#a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  WebkitTextStroke: "1.5px #fff",
                  filter: "drop-shadow(2px 3px 0 rgba(0,0,0,0.15))",
                }}
              >
                Number World
              </span>
            </div>


            {/* Bear mascot top-left */}
            <img src={bearFace} alt="" width={64} height={64} className="bear-bounce absolute left-2 top-2 z-20 drop-shadow-lg" />

            {/* Close top-right */}
            <button onClick={close} aria-label="Close" className="absolute right-3 top-3 z-30 flex size-9 items-center justify-center rounded-full bg-white text-slate-500 shadow">
              <X className="size-5" />
            </button>

            {/* Scattered objects (behind content, edges only) */}
            <div aria-hidden className="absolute inset-0 z-0">
              {positions.map((p, i) => (
                <span
                  key={i}
                  className="absolute select-none leading-none"
                  style={{ top: `${p.top}%`, left: `${p.left}%`, transform: `translate(-50%,-50%) rotate(${p.rot}deg)`, fontSize: `${p.size}px` }}
                >
                  {objectFor(active)}
                </span>
              ))}
            </div>

            {/* Center: big number + eyes + spelling */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pointer-events-none">
              <div className="relative">
                <span className="big-num" style={{ color: COLORS[(active - 1) % COLORS.length] }}>
                  {active}
                </span>
                <span className="eye" style={{ top: "22%", left: "28%" }}><span className="pupil" /></span>
                <span className="eye" style={{ top: "22%", left: "58%" }}><span className="pupil" /></span>
              </div>
              <div className="mt-2 rounded-full bg-white/90 px-5 py-1.5 text-xl font-extrabold tracking-wide text-slate-700 shadow ring-2 ring-white">
                {active} — {spell(active).toUpperCase()}
              </div>
            </div>

            {/* Buttons (CSS-only, instant) pinned bottom */}
            <div className="absolute inset-x-0 bottom-4 z-30 flex items-center justify-center gap-5">
              <button
                onClick={() => speak(spell(active))}
                aria-label="Replay"
                className="flex size-20 items-center justify-center rounded-full bg-gradient-to-b from-sky-400 to-sky-600 text-white shadow-[0_6px_0_rgba(0,0,0,0.2)] ring-4 ring-white transition active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:scale-105"
              >
                <Volume2 className="size-10" strokeWidth={2.5} />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="flex h-20 items-center gap-2 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-7 text-white shadow-[0_6px_0_rgba(0,0,0,0.2)] ring-4 ring-white transition active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:scale-105"
              >
                <span className="text-2xl font-extrabold">Next</span>
                <ChevronRight className="size-8" strokeWidth={3} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Milestone celebration screen */}
      {milestone !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3">
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-b from-sky-300 to-sky-500 shadow-2xl ring-4 ring-white" style={{ height: "min(86vh, 680px)" }}>
            {/* confetti */}
            <div aria-hidden className="absolute inset-0">
              {Array.from({ length: 22 }).map((_, i) => {
                const c = ["#ef4444","#facc15","#22c55e","#3b82f6","#a855f7","#fb923c"][i % 6];
                const top = (i * 53) % 90 + 3;
                const left = (i * 37) % 92 + 3;
                const rot = (i * 47) % 360;
                return <span key={i} className="absolute" style={{ top: `${top}%`, left: `${left}%`, width: 10, height: 14, background: c, transform: `rotate(${rot}deg)`, borderRadius: 2, opacity: 0.9 }} />;
              })}
            </div>

            <div className="relative z-10 flex h-full flex-col items-center justify-between p-5 text-center">
              <h2 className="nw-title" style={{ color: "#fff", textShadow: "2px 3px 0 rgba(0,0,0,0.15)", fontSize: "2.25rem" }}>
                {MILESTONES[milestone]?.title}
              </h2>

              <img src={bearTrophy} alt="" width={260} height={260} className="bear-bounce mx-auto h-56 w-auto drop-shadow-2xl" />

              <p className="text-lg font-extrabold leading-snug text-white drop-shadow">
                {MILESTONES[milestone]?.msg}
              </p>

              <div className="flex w-full items-center justify-center gap-3">
                <Link to="/" className="flex items-center gap-2 rounded-full bg-white px-4 py-3 font-extrabold text-amber-600 shadow-[0_5px_0_rgba(0,0,0,0.15)]">
                  <Home className="size-5" /> Back to Menu
                </Link>
                {milestone < 100 && (
                  <button onClick={continueAfterMilestone} className="flex items-center gap-2 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-5 py-3 font-extrabold text-white shadow-[0_5px_0_rgba(0,0,0,0.2)]">
                    Keep Going →
                  </button>
                )}
                {milestone === 100 && (
                  <button onClick={() => { setMilestone(null); setActive(1); }} className="flex items-center gap-2 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-5 py-3 font-extrabold text-white shadow-[0_5px_0_rgba(0,0,0,0.2)]">
                    Play Again
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
