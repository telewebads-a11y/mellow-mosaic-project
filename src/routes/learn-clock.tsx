import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Home, Clock, Clock6, Clock3, Clock12, ClockAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import bearFace from "@/assets/icons/bear-face.png";
import bgClouds from "@/assets/bg-clouds.jpg";

export const Route = createFileRoute("/learn-clock")({
  head: () => ({
    meta: [
      { title: "Learn the Clock — Melly Kids TV" },
      { name: "description", content: "Learn the clock with Melly — o'clock, half past, quarter, 5-minute jumps and a fun quiz." },
    ],
  }),
  component: LearnClock,
});

type SubTile = {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  color: string;
};

const TILES: SubTile[] = [
  { title: "O'clock",        subtitle: "Long red hand points up to 12",   Icon: Clock12, color: "tile-blue" },
  { title: "Half Past",      subtitle: "Long hand points down to 6",      Icon: Clock6,  color: "tile-green" },
  { title: "Quarter",        subtitle: "Long hand on 3 = Quarter Past",   Icon: Clock3,  color: "tile-coral" },
  { title: "5-minute Jumps", subtitle: "Each big number is 5 minutes",    Icon: Clock,   color: "tile-mustard" },
  { title: "Practice Quiz",  subtitle: "Read the Clock",                  Icon: ClockAlert, color: "tile-purple" },
];

function LearnClock() {
  const navigate = useNavigate();
  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url(${bgClouds})` }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/40" />

      <header className="flex items-center justify-between px-5 pt-6 pb-2">
        <button
          aria-label="Back"
          onClick={() => navigate({ to: "/smart-learning" })}
          className="flex size-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-2 ring-white"
        >
          <ArrowLeft className="size-6" />
        </button>
        <img src={bearFace} alt="" width={72} height={72} className="size-18 drop-shadow-lg bear-bounce" />
        <Link
          to="/"
          aria-label="Home"
          className="flex size-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-2 ring-white"
        >
          <Home className="size-6" />
        </Link>
      </header>

      <h1 className="melly-title px-5 pb-4 text-center leading-tight" style={{ fontSize: "2.25rem" }}>
        <span style={{ color: "#ff6b6b" }}>L</span>
        <span style={{ color: "#ffb347" }}>e</span>
        <span style={{ color: "#ffd23f" }}>a</span>
        <span style={{ color: "#6dd47e" }}>r</span>
        <span style={{ color: "#4ac6e8" }}>n </span>
        <span style={{ color: "#b78ce8" }}>t</span>
        <span style={{ color: "#ff6b6b" }}>h</span>
        <span style={{ color: "#ffb347" }}>e </span>
        <span style={{ color: "#6dd47e" }}>C</span>
        <span style={{ color: "#4ac6e8" }}>l</span>
        <span style={{ color: "#b78ce8" }}>o</span>
        <span style={{ color: "#ff6b6b" }}>c</span>
        <span style={{ color: "#ffd23f" }}>k</span>
      </h1>

      <main className="grid flex-1 grid-cols-2 gap-4 px-4 pb-10">
        {TILES.map((t, i) => {
          const Icon = t.Icon;
          return (
            <button
              key={t.title}
              className={`tile ${t.color} flex-col items-center justify-center text-center`}
              style={{ minHeight: 180 }}
            >
              <Icon
                className="icon-wiggle drop-shadow-lg"
                style={{
                  width: "4.5rem",
                  height: "4.5rem",
                  color: "#fff",
                  animationDelay: `${i * 0.15}s`,
                  filter: "drop-shadow(0 4px 0 rgba(0,0,0,0.2))",
                }}
                strokeWidth={2.4}
                aria-hidden
              />
              <span
                className="melly-title mt-2 leading-tight"
                style={{ fontSize: "1.25rem", color: "#fff", textShadow: "0 2px 2px rgba(0,0,0,0.25)" }}
              >
                {t.title}
              </span>
              <span className="mt-1 text-xs font-bold text-white/95 leading-tight px-2">{t.subtitle}</span>
            </button>
          );
        })}
      </main>
    </div>
  );
}
