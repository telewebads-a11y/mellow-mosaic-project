import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Home } from "lucide-react";

import bearFace from "@/assets/icons/bear-face.png";
import bgClouds from "@/assets/bg-clouds.jpg";

export const Route = createFileRoute("/brain-quiz")({
  head: () => ({
    meta: [
      { title: "Brain Quiz — Melly Kids TV" },
      { name: "description", content: "Brain Marathon, Maths Challenge, English Grammar and Hindi counting quizzes for kids." },
    ],
  }),
  component: BrainQuiz,
});

type SubTile = {
  title: string;
  subtitle: string;
  icon: string;
  iconStyle?: React.CSSProperties;
  color: string;
};

const TILES: SubTile[] = [
  { title: "Brain Marathon",   subtitle: "Quick fire questions",        icon: "🧠", color: "tile-purple", iconStyle: { color: "#fff", WebkitTextStroke: "1.5px #5b21b6" } },
  { title: "Maths Challenge",  subtitle: "+  −  ×  ÷",                  icon: "+−×÷", color: "tile-blue",  iconStyle: { color: "#fff", WebkitTextStroke: "2px #1d4ed8" } },
  { title: "English Grammar",  subtitle: "Nouns, Verbs & more",         icon: "ABC", color: "tile-pink",   iconStyle: { color: "#fff", WebkitTextStroke: "2px #9d174d" } },
  { title: "हिंदी गिनती",        subtitle: "१  २  ३  ४  ५",                icon: "१२३", color: "tile-coral", iconStyle: { color: "#fff", WebkitTextStroke: "2px #9a3412" } },
];

function BrainQuiz() {
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
        <span style={{ color: "#ff6b6b" }}>B</span>
        <span style={{ color: "#ffb347" }}>r</span>
        <span style={{ color: "#ffd23f" }}>a</span>
        <span style={{ color: "#6dd47e" }}>i</span>
        <span style={{ color: "#4ac6e8" }}>n </span>
        <span style={{ color: "#b78ce8" }}>Q</span>
        <span style={{ color: "#ff6b6b" }}>u</span>
        <span style={{ color: "#ffb347" }}>i</span>
        <span style={{ color: "#6dd47e" }}>z</span>
      </h1>

      <main className="grid flex-1 grid-cols-2 gap-4 px-4 pb-10">
        {TILES.map((t, i) => (
          <button
            key={i}
            onClick={() => {
              if (t.title === "Maths Challenge") navigate({ to: "/maths-challenge" });
            }}
            className={`tile ${t.color} flex-col items-center justify-center text-center`}
            style={{ minHeight: 200 }}
          >
            <span
              className="melly-title icon-wiggle leading-none drop-shadow-lg"
              style={{
                fontSize: "4.8rem",
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
              style={{ fontSize: "1.25rem", color: "#fff", textShadow: "0 2px 2px rgba(0,0,0,0.25)" }}
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
