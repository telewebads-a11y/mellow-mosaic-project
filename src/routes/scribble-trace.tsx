import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Home } from "lucide-react";

import bearFace from "@/assets/icons/bear-face.png";
import bgClouds from "@/assets/bg-clouds.jpg";

export const Route = createFileRoute("/scribble-trace")({
  head: () => ({
    meta: [
      { title: "Scribble & Trace — Melly Kids TV" },
      { name: "description", content: "Trace letters, numbers and words in English and Hindi." },
    ],
  }),
  component: ScribbleTrace,
});

type SubTile = {
  title: string;
  subtitle: string;
  icon: string;
  iconStyle?: React.CSSProperties;
  color: string;
  to?: string;
};

const TILES: SubTile[] = [
  { title: "A – Z",           subtitle: "Capital Letters",     icon: "Aa", color: "tile-blue",    to: "/trace-capital", iconStyle: { color: "#fff", WebkitTextStroke: "2px #1d4ed8" } },
  { title: "a – z",           subtitle: "Small Letters",       icon: "ab", color: "tile-pink",    to: "/trace-small", iconStyle: { color: "#fff", WebkitTextStroke: "2px #9d174d" } },
  { title: "1 – 100",         subtitle: "Counting Numbers",    icon: "123", color: "tile-green",  to: "/trace-numbers", iconStyle: { color: "#fff", WebkitTextStroke: "2px #166534" } },
  { title: "English Words",   subtitle: "3 & 4 Letter Words",  icon: "abc", color: "tile-yellow", to: "/trace-words", iconStyle: { color: "#fff", WebkitTextStroke: "2px #b45309" } },
  { title: "हिंदी वर्णमाला",   subtitle: "स्वर और व्यंजन",       icon: "अ आ", color: "tile-coral",  iconStyle: { color: "#fff", WebkitTextStroke: "2px #9a3412" } },
  { title: "हिंदी शब्द",        subtitle: "बिना मात्रा के शब्द",   icon: "कमल", color: "tile-mustard", iconStyle: { color: "#fff", WebkitTextStroke: "1.5px #854d0e" } },
];

function ScribbleTrace() {
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
        <span style={{ color: "#ffb347" }}>c</span>
        <span style={{ color: "#ffd23f" }}>r</span>
        <span style={{ color: "#6dd47e" }}>i</span>
        <span style={{ color: "#4ac6e8" }}>b</span>
        <span style={{ color: "#b78ce8" }}>b</span>
        <span style={{ color: "#ff6b6b" }}>l</span>
        <span style={{ color: "#ffb347" }}>e </span>
        <span style={{ color: "#6dd47e" }}>&amp; </span>
        <span style={{ color: "#4ac6e8" }}>T</span>
        <span style={{ color: "#b78ce8" }}>r</span>
        <span style={{ color: "#ff6b6b" }}>a</span>
        <span style={{ color: "#ffd23f" }}>c</span>
        <span style={{ color: "#6dd47e" }}>e</span>
      </h1>

      <main className="grid flex-1 grid-cols-2 gap-4 px-4 pb-10">
        {TILES.map((t, i) => (
          <button
            key={i}
            onClick={() => t.to && navigate({ to: t.to })}
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
              style={{ fontSize: "1.3rem", color: "#fff", textShadow: "0 2px 2px rgba(0,0,0,0.25)" }}
            >
              {t.title}
            </span>
            <span className="mt-1 text-xs font-bold text-white/95 leading-tight">{t.subtitle}</span>
          </button>
        ))}
      </main>
    </div>
  );
}


