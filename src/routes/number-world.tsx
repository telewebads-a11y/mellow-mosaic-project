import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Volume2, ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";

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

// Cycle of 10 bright colors matching the reference
const COLORS = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#facc15", // yellow
  "#22c55e", // green
  "#fb923c", // orange
  "#ef4444",
  "#3b82f6",
  "#facc15",
  "#22c55e",
  "#a855f7", // purple
];

// Themed objects per number-range so kids see variety
const OBJECTS = ["🍎","⭐","🍌","🐝","🌸","🐞","🍓","🐠","🎈","🧁","🍇","🦋","🍒","🌼","🐢","🍊","🍉","🐥","🥕","🌻"];

function objectFor(n: number) {
  return OBJECTS[(n - 1) % OBJECTS.length];
}

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9;
  u.pitch = 1.3;
  window.speechSynthesis.speak(u);
}

function NumberWorld() {
  const navigate = useNavigate();
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active !== null) speak(String(active));
  }, [active]);

  const close = () => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setActive(null);
  };

  const next = () => setActive((n) => (n === null ? 1 : n >= 100 ? 1 : n + 1));

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url(${bgJungle})` }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/40" />

      <header className="flex items-center justify-between px-4 pt-5 pb-3">
        <Link
          to="/"
          aria-label="Back"
          className="flex size-11 items-center justify-center rounded-full bg-white/90 text-sky-500 shadow-md ring-2 ring-white transition hover:scale-105"
        >
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="nw-title">Number World</h1>
        <div className="size-11" />
      </header>

      <main className="px-3 pb-28">
        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => {
            const color = COLORS[(n - 1) % COLORS.length];
            return (
              <button
                key={n}
                onClick={() => setActive(n)}
                className="num-cell"
                style={{ background: color }}
                aria-label={`Number ${n}`}
              >
                {n}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <img src={bearFace} alt="" width={88} height={88} className="bear-bounce drop-shadow-lg" />
        </div>
      </main>

      {active !== null && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={close}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-sky-100 to-emerald-50 p-5 shadow-2xl ring-4 ring-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white text-slate-500 shadow"
            >
              <X className="size-5" />
            </button>

            <div className="flex min-h-[180px] items-center justify-center pt-2">
              <span
                className="big-num"
                style={{ color: COLORS[(active - 1) % COLORS.length] }}
              >
                {active}
              </span>
            </div>

            <div className="mx-auto mt-2 grid max-w-[280px] grid-cols-5 place-items-center gap-1 text-2xl">
              {Array.from({ length: active }, (_, i) => (
                <span key={i} className="leading-none">{objectFor(active)}</span>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => speak(String(active))}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 px-5 py-3 font-extrabold text-white shadow-[0_5px_0_rgba(0,0,0,0.15)] active:translate-y-[2px]"
              >
                <Volume2 className="size-5" />
                Replay
              </button>
              <button
                onClick={next}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 px-5 py-3 font-extrabold text-white shadow-[0_5px_0_rgba(0,0,0,0.15)] active:translate-y-[2px]"
              >
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
