import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, X, Home, Volume2, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import bearFace from "@/assets/icons/bear-face.png";
import bearTrophy from "@/assets/bear-trophy.png";
import bgJungle from "@/assets/bg-clouds.jpg";

export const Route = createFileRoute("/abc-world")({
  head: () => ({
    meta: [
      { title: "ABC World — Learn A to Z | Melly Kids TV" },
      { name: "description", content: "Learn the alphabet from A to Z with fun pictures and sounds." },
    ],
  }),
  component: AbcWorld,
});

const COLORS = [
  "#ef4444","#3b82f6","#facc15","#22c55e","#fb923c","#a855f7",
  "#ef4444","#3b82f6","#facc15","#22c55e","#fb923c","#a855f7",
  "#ef4444","#3b82f6","#facc15","#22c55e","#fb923c","#a855f7",
  "#ef4444","#3b82f6","#facc15","#22c55e","#fb923c","#a855f7",
  "#ef4444","#3b82f6",
];

type Item = { letter: string; word: string; emoji: string };
const ITEMS: Item[] = [
  { letter: "A", word: "Apple",      emoji: "🍎" },
  { letter: "B", word: "Boy",        emoji: "👦" },
  { letter: "C", word: "Cat",        emoji: "🐱" },
  { letter: "D", word: "Dog",        emoji: "🐶" },
  { letter: "E", word: "Elephant",   emoji: "🐘" },
  { letter: "F", word: "Fish",       emoji: "🐟" },
  { letter: "G", word: "Grapes",     emoji: "🍇" },
  { letter: "H", word: "Hat",        emoji: "🎩" },
  { letter: "I", word: "Ice cream",  emoji: "🍦" },
  { letter: "J", word: "Juice",      emoji: "🧃" },
  { letter: "K", word: "Kite",       emoji: "🪁" },
  { letter: "L", word: "Lion",       emoji: "🦁" },
  { letter: "M", word: "Monkey",     emoji: "🐵" },
  { letter: "N", word: "Nest",       emoji: "🪺" },
  { letter: "O", word: "Orange",     emoji: "🍊" },
  { letter: "P", word: "Parrot",     emoji: "🦜" },
  { letter: "Q", word: "Queen",      emoji: "👸" },
  { letter: "R", word: "Rabbit",     emoji: "🐰" },
  { letter: "S", word: "Sun",        emoji: "☀️" },
  { letter: "T", word: "Tiger",      emoji: "🐯" },
  { letter: "U", word: "Umbrella",   emoji: "☂️" },
  { letter: "V", word: "Van",        emoji: "🚐" },
  { letter: "W", word: "Watermelon", emoji: "🍉" },
  { letter: "X", word: "Xylophone",  emoji: "🎼" },
  { letter: "Y", word: "Yak",        emoji: "🐃" },
  { letter: "Z", word: "Zebra",      emoji: "🦓" },
];

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9; u.pitch = 1.3;
  window.speechSynthesis.speak(u);
}

function scatterPositions(n: number, seed: number) {
  const out: Array<{ top: number; left: number; rot: number; size: number }> = [];
  let s = seed * 9301 + 49297;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const size = 26;
  const minDist = 12;
  const inSafeZone = (top: number, left: number) => {
    const inCenter = top > 26 && top < 72 && left > 16 && left < 84;
    const inButtons = top > 78;
    const inBear = top < 22 && left < 28;
    const inTitle = top < 16 && left > 20 && left < 80;
    return !(inCenter || inButtons || inBear || inTitle);
  };
  let tries = 0;
  while (out.length < n && tries < 4000) {
    tries++;
    const top = 3 + rnd() * 74;
    const left = 3 + rnd() * 94;
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

function AbcWorld() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const active = activeIdx !== null ? ITEMS[activeIdx] : null;

  useEffect(() => {
    if (active) speak(`${active.letter} for ${active.word}`);
  }, [active]);

  useEffect(() => {
    if (done) speak("Hooray! You learned the whole alphabet from A to Z. You are an ABC superstar!");
  }, [done]);

  const close = () => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setActiveIdx(null);
  };

  const next = () => {
    setActiveIdx((i) => {
      if (i === null) return 0;
      if (i >= ITEMS.length - 1) {
        setDone(true);
        return i;
      }
      return i + 1;
    });
  };

  // 8 scattered emojis around the edges
  const positions = useMemo(() => (activeIdx !== null ? scatterPositions(8, activeIdx + 1) : []), [activeIdx]);

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-top bg-no-repeat" style={{ backgroundImage: `url(${bgJungle})` }} />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/40" />

      <header className="flex items-center justify-between px-4 pt-5 pb-3">
        <Link to="/games" aria-label="Back" className="flex size-11 items-center justify-center rounded-full bg-white/90 text-sky-500 shadow-md ring-2 ring-white transition hover:scale-105">
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="nw-title">ABC World</h1>
        <div className="size-11" />
      </header>

      <main className="px-3 pb-10">
        <div className="grid grid-cols-5 gap-2">
          {ITEMS.map((it, i) => (
            <button
              key={it.letter}
              onClick={() => setActiveIdx(i)}
              className="num-cell cell-anim aspect-square"
              style={{ background: COLORS[i % COLORS.length], fontSize: "1.6rem", animationDelay: `${(i % 10) * 0.12}s` }}
              aria-label={`Letter ${it.letter}`}
            >
              {it.letter}
            </button>
          ))}
        </div>
      </main>

      {active && !done && (
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
                ABC World
              </span>
            </div>

            {/* Bear mascot top-left */}
            <img src={bearFace} alt="" width={64} height={64} className="bear-bounce absolute left-2 top-2 z-20 drop-shadow-lg" />

            {/* Close top-right */}
            <button onClick={close} aria-label="Close" className="absolute right-3 top-3 z-30 flex size-9 items-center justify-center rounded-full bg-white text-slate-500 shadow">
              <X className="size-5" />
            </button>

            {/* Scattered themed emojis */}
            <div aria-hidden className="absolute inset-0 z-0">
              {positions.map((p, i) => (
                <span
                  key={i}
                  className="absolute select-none leading-none"
                  style={{ top: `${p.top}%`, left: `${p.left}%`, transform: `translate(-50%,-50%) rotate(${p.rot}deg)`, fontSize: `${p.size}px` }}
                >
                  {active.emoji}
                </span>
              ))}
            </div>

            {/* Center: big letter + eyes + big emoji + word */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pointer-events-none">
              <div className="relative">
                <span className="big-num" style={{ color: COLORS[activeIdx! % COLORS.length] }}>
                  {active.letter}
                </span>
                <span className="eye" style={{ top: "22%", left: "28%" }}><span className="pupil" /></span>
                <span className="eye" style={{ top: "22%", left: "58%" }}><span className="pupil" /></span>
              </div>
              <div className="mt-1 text-6xl drop-shadow">{active.emoji}</div>
              <div className="mt-2 rounded-full bg-white/90 px-5 py-1.5 text-2xl tracking-wide text-slate-700 shadow ring-2 ring-white center-pill">
                {active.letter} for {active.word.toUpperCase()}
              </div>
            </div>

            {/* Buttons */}
            <div className="absolute inset-x-0 bottom-4 z-30 flex items-center justify-center gap-5">
              <button
                onClick={() => speak(`${active.letter} for ${active.word}`)}
                aria-label="Replay"
                className="flex size-20 items-center justify-center rounded-full bg-gradient-to-b from-sky-400 to-sky-600 text-white shadow-[0_6px_0_rgba(0,0,0,0.2)] ring-4 ring-white transition active:translate-y-[3px] hover:scale-105"
              >
                <Volume2 className="size-10" strokeWidth={2.5} />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="flex h-20 items-center gap-2 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-7 text-white shadow-[0_6px_0_rgba(0,0,0,0.2)] ring-4 ring-white transition active:translate-y-[3px] hover:scale-105"
              >
                <span className="text-2xl font-extrabold">Next</span>
                <ChevronRight className="size-8" strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final appreciation screen */}
      {done && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3">
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-b from-sky-300 to-sky-500 shadow-2xl ring-4 ring-white" style={{ height: "min(86vh, 680px)" }}>
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
                ABC Superstar!
              </h2>

              <img src={bearTrophy} alt="" width={260} height={260} className="bear-bounce mx-auto h-56 w-auto drop-shadow-2xl" />

              <p className="text-lg font-extrabold leading-snug text-white drop-shadow">
                Hooray! You learned the whole alphabet from A to Z. You're an ABC superstar!
              </p>

              <div className="flex w-full items-center justify-center gap-3">
                <Link to="/games" className="flex items-center gap-2 rounded-full bg-white px-4 py-3 font-extrabold text-amber-600 shadow-[0_5px_0_rgba(0,0,0,0.15)]">
                  <Home className="size-5" /> Back to Menu
                </Link>
                <button
                  onClick={() => { setDone(false); setActiveIdx(0); }}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-5 py-3 font-extrabold text-white shadow-[0_5px_0_rgba(0,0,0,0.2)]"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
