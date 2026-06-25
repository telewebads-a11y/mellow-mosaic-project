import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Home, Brush, PawPrint, Sparkles, Bird, House, Palette } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import bearFace from "@/assets/icons/bear-face.png";
import bgClouds from "@/assets/bg-clouds.jpg";

export const Route = createFileRoute("/colors-name")({
  head: () => ({
    meta: [
      { title: "Coloring World — Melly Kids TV" },
      { name: "description", content: "Coloring World — Draw, color animals, unicorns, birds and houses with Melly the bear." },
    ],
  }),
  component: ColoringWorld,
});

type SubTile = {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  color: string;
  to?: string;
};

const TILES: SubTile[] = [
  { title: "Colors Name",   subtitle: "Learn 36 Colors — English & Hindi",            Icon: Palette,  color: "tile-pink",    to: "/colors-list" },
  { title: "Draw Your Own", subtitle: "Free Drawing Canvas — Unlimited Creativity",   Icon: Brush,    color: "tile-blue" },
  { title: "Animals",       subtitle: "Color Cute Animals",                           Icon: PawPrint, color: "tile-green" },
  { title: "Unicorn",       subtitle: "Magical Coloring Fun",                         Icon: Sparkles, color: "tile-coral" },
  { title: "Birds",         subtitle: "Color Beautiful Birds",                        Icon: Bird,     color: "tile-mustard" },
  { title: "House",         subtitle: "Color Lovely Houses",                          Icon: House,    color: "tile-purple" },
];

function ColoringWorld() {
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

      <h1 className="melly-title px-5 pb-4 text-center leading-tight" style={{ fontSize: "2.25rem" }}>
        <span style={{ color: "#ff6b6b" }}>C</span>
        <span style={{ color: "#ffb347" }}>o</span>
        <span style={{ color: "#ffd23f" }}>l</span>
        <span style={{ color: "#6dd47e" }}>o</span>
        <span style={{ color: "#4ac6e8" }}>r</span>
        <span style={{ color: "#b78ce8" }}>i</span>
        <span style={{ color: "#ff6b6b" }}>n</span>
        <span style={{ color: "#ffb347" }}>g </span>
        <span style={{ color: "#6dd47e" }}>W</span>
        <span style={{ color: "#4ac6e8" }}>o</span>
        <span style={{ color: "#b78ce8" }}>r</span>
        <span style={{ color: "#ff6b6b" }}>l</span>
        <span style={{ color: "#ffd23f" }}>d</span>
      </h1>

      <main className="grid flex-1 grid-cols-2 gap-4 px-4 pb-10">
        {TILES.map((t, i) => {
          const Icon = t.Icon;
          return (
            <button
              key={t.title}
              onClick={() => t.to && navigate({ to: t.to })}
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
