import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Home,
  Brain,
  Calculator,
  FlaskConical,
  PawPrint,
  Rocket,
  Trophy,
  Landmark,
  BookOpenText,
  Apple,
  Leaf,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import bearFace from "@/assets/icons/bear-face.png";
import bgClouds from "@/assets/bg-clouds.jpg";

export const Route = createFileRoute("/test-knowledge")({
  head: () => ({
    meta: [
      { title: "Test Your Knowledge — Melly Kids TV" },
      {
        name: "description",
        content:
          "Test Your Knowledge — choose a category and test your brain. 1800+ fun questions for kids.",
      },
    ],
  }),
  component: TestKnowledge,
});

type SubTile = {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  color: string;
};

const TILES: SubTile[] = [
  { title: "General\nKnowledge", subtitle: "Everyday smart facts",  Icon: Brain,         color: "tile-blue" },
  { title: "Maths",              subtitle: "Numbers & puzzles",      Icon: Calculator,    color: "tile-pink" },
  { title: "Science",            subtitle: "Discover & explore",     Icon: FlaskConical,  color: "tile-green" },
  { title: "Animals",            subtitle: "Wild & cute friends",    Icon: PawPrint,      color: "tile-coral" },
  { title: "Universe",           subtitle: "Stars, planets & space", Icon: Rocket,        color: "tile-purple" },
  { title: "Sports",             subtitle: "Games & champions",      Icon: Trophy,        color: "tile-mustard" },
  { title: "India GK",           subtitle: "Our amazing country",    Icon: Landmark,      color: "tile-orange" },
  { title: "English",            subtitle: "Words & grammar",        Icon: BookOpenText,  color: "tile-teal" },
  { title: "Food &\nFruits",     subtitle: "Tasty & healthy",        Icon: Apple,         color: "tile-red" },
  { title: "Nature",             subtitle: "Plants & planet",        Icon: Leaf,          color: "tile-green" },
];

function TestKnowledge() {
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
          onClick={() => navigate({ to: "/" })}
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

      <div className="px-5 pb-4 text-center">
        <h1 className="melly-title leading-tight" style={{ fontSize: "2rem" }}>
          <span style={{ color: "#ff6b6b" }}>T</span>
          <span style={{ color: "#ffb347" }}>e</span>
          <span style={{ color: "#ffd23f" }}>s</span>
          <span style={{ color: "#6dd47e" }}>t </span>
          <span style={{ color: "#4ac6e8" }}>Y</span>
          <span style={{ color: "#b78ce8" }}>o</span>
          <span style={{ color: "#ff6b6b" }}>u</span>
          <span style={{ color: "#ffb347" }}>r </span>
          <span style={{ color: "#6dd47e" }}>K</span>
          <span style={{ color: "#4ac6e8" }}>n</span>
          <span style={{ color: "#b78ce8" }}>o</span>
          <span style={{ color: "#ff6b6b" }}>w</span>
          <span style={{ color: "#ffd23f" }}>l</span>
          <span style={{ color: "#6dd47e" }}>e</span>
          <span style={{ color: "#4ac6e8" }}>d</span>
          <span style={{ color: "#b78ce8" }}>g</span>
          <span style={{ color: "#ff6b6b" }}>e</span>
        </h1>
        <p className="mt-1 text-sm font-bold text-slate-700">
          Choose a category and test your brain.
        </p>
        <p className="text-xs font-bold text-rose-600">1800+ Questions</p>
      </div>

      <main className="grid flex-1 grid-cols-2 gap-4 px-4 pb-10">
        {TILES.map((t, i) => {
          const Icon = t.Icon;
          return (
            <button
              key={t.title}
              className={`tile ${t.color} flex-col items-center justify-center text-center`}
              style={{ minHeight: 170 }}
            >
              <Icon
                className="icon-wiggle drop-shadow-lg"
                style={{
                  width: "4rem",
                  height: "4rem",
                  color: "#fff",
                  animationDelay: `${i * 0.12}s`,
                  filter: "drop-shadow(0 4px 0 rgba(0,0,0,0.2))",
                }}
                strokeWidth={2.4}
                aria-hidden
              />
              <span
                className="melly-title mt-2 leading-tight whitespace-pre-line"
                style={{ fontSize: "1.1rem", color: "#fff", textShadow: "0 2px 2px rgba(0,0,0,0.25)" }}
              >
                {t.title}
              </span>
              <span className="mt-1 text-[11px] font-bold text-white/95 leading-tight px-2">
                {t.subtitle}
              </span>
            </button>
          );
        })}
      </main>
    </div>
  );
}
