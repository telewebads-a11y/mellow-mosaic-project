import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Home } from "lucide-react";

import bearFace from "@/assets/icons/bear-face.png";
import bgClouds from "@/assets/bg-clouds.jpg";

export const Route = createFileRoute("/smart-learning")({
  head: () => ({
    meta: [
      { title: "Smart Learning — Melly Kids TV" },
      { name: "description", content: "Learn tables, the clock, India and the world." },
    ],
  }),
  component: SmartLearning,
});

type SubTile = {
  title: string;
  subtitle: string;
  icon: string;
  iconStyle?: React.CSSProperties;
  color: string;
};

const TILES: SubTile[] = [
  { title: "Learn Tables",      subtitle: "Tricks, Practice & Certificate", icon: "×",   color: "tile-blue",    iconStyle: { color: "#fff", WebkitTextStroke: "2px #1d4ed8" } },
  { title: "Learn the Clock",   subtitle: "Tell the time, Easy lessons",    icon: "🕒",  color: "tile-green",   iconStyle: { color: "#fff", WebkitTextStroke: "1.5px #166534" } },
  { title: "Explore India",     subtitle: "States, Cities, Food, Oceans",   icon: "🇮🇳",  color: "tile-coral" },
  { title: "Explore the World", subtitle: "Countries, Food, Monuments",     icon: "🌍",  color: "tile-mustard" },
];

function SmartLearning() {
  const navigate = useNavigate();
  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url(${bgClouds})` }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/40" />

      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <button
          aria-label="Back"
          onClick={() => navigate({ to: "/" })}
          className="flex size-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-2 ring-white"
        >
          <ArrowLeft className="size-6" />
        </button>
        <img src={bearFace} alt="" width={64} height={64} className="size-16 drop-shadow-lg bear-bounce" />
        <Link
          to="/"
          aria-label="Home"
          className="flex size-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-2 ring-white"
        >
          <Home className="size-6" />
        </Link>
      </header>

      <h1 className="melly-title px-5 pb-3 text-center leading-tight">
        <span style={{ color: "#ff6b6b" }}>S</span>
        <span style={{ color: "#ffb347" }}>m</span>
        <span style={{ color: "#ffd23f" }}>a</span>
        <span style={{ color: "#6dd47e" }}>r</span>
        <span style={{ color: "#4ac6e8" }}>t </span>
        <span style={{ color: "#b78ce8" }}>L</span>
        <span style={{ color: "#ff6b6b" }}>e</span>
        <span style={{ color: "#ffb347" }}>a</span>
        <span style={{ color: "#ffd23f" }}>r</span>
        <span style={{ color: "#6dd47e" }}>n</span>
        <span style={{ color: "#4ac6e8" }}>i</span>
        <span style={{ color: "#b78ce8" }}>n</span>
        <span style={{ color: "#ff6b6b" }}>g</span>
      </h1>

      <main className="grid flex-1 grid-cols-2 gap-4 px-4 pb-10">
        {TILES.map((t, i) => (
          <button
            key={i}
            className={`tile ${t.color} flex-col items-center justify-center text-center`}
            style={{ minHeight: 200 }}
          >
            <span
              className="melly-title icon-wiggle leading-none drop-shadow-lg"
              style={{
                fontSize: "5rem",
                animationDelay: `${i * 0.15}s`,
                textShadow: "0 4px 0 rgba(0,0,0,0.2)",
                ...t.iconStyle,
              }}
              aria-hidden
            >
              {t.icon}
            </span>
            <span
              className="melly-title mt-2 leading-tight"
              style={{ fontSize: "1.2rem", color: "#fff", textShadow: "0 2px 2px rgba(0,0,0,0.25)" }}
            >
              {t.title}
            </span>
            <span className="mt-1 text-xs font-bold text-white/95 leading-tight px-2">{t.subtitle}</span>
          </button>
        ))}
      </main>
    </div>
  );
}
