import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Home, Plus, Minus, X as XIcon, Divide } from "lucide-react";

import bearFace from "@/assets/icons/bear-face.png";
import bgClouds from "@/assets/bg-clouds.jpg";

export const Route = createFileRoute("/maths-challenge")({
  head: () => ({
    meta: [
      { title: "Maths Challenge — Melly Kids TV" },
      { name: "description", content: "Addition, Subtraction, Multiplication and Division challenges across 100 levels for kids." },
    ],
  }),
  component: MathsChallenge,
});

type Lang = "en" | "hi";

type Op = {
  key: "add" | "sub" | "mul" | "div";
  en: string;
  hi: string;
  symbol: string;
  Icon: typeof Plus;
  color: string;
  ring: string;
};

const OPS: Op[] = [
  { key: "add", en: "Addition",       hi: "जोड़",   symbol: "+", Icon: Plus,   color: "tile-blue",   ring: "#1d4ed8" },
  { key: "sub", en: "Subtraction",    hi: "घटाव",  symbol: "−", Icon: Minus,  color: "tile-coral",  ring: "#9a3412" },
  { key: "mul", en: "Multiplication", hi: "गुणा",  symbol: "×", Icon: XIcon,  color: "tile-purple", ring: "#5b21b6" },
  { key: "div", en: "Division",       hi: "भाग",   symbol: "÷", Icon: Divide, color: "tile-pink",   ring: "#9d174d" },
];

const T = {
  en: { title: "Maths Challenge", levels: "100 Levels", choose: "Choose an operation", language: "Language" },
  hi: { title: "गणित चुनौती",     levels: "100 स्तर",   choose: "एक संक्रिया चुनें",    language: "भाषा" },
};

function MathsChallenge() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url(${bgClouds})` }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/40" />

      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <button
          aria-label="Back"
          onClick={() => navigate({ to: "/brain-quiz" })}
          className="flex size-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-2 ring-white"
        >
          <ArrowLeft className="size-6" />
        </button>
        <div className="flex items-center gap-2">
          <img src={bearFace} alt="" width={56} height={56} className="size-14 drop-shadow-lg bear-bounce" />
          <h1 className="melly-title leading-none" style={{ fontSize: "1.6rem" }}>
            <span style={{ color: "#ff6b6b" }}>M</span>
            <span style={{ color: "#ffb347" }}>a</span>
            <span style={{ color: "#ffd23f" }}>t</span>
            <span style={{ color: "#6dd47e" }}>h</span>
            <span style={{ color: "#4ac6e8" }}>s</span>
          </h1>
        </div>
        <Link
          to="/"
          aria-label="Home"
          className="flex size-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-2 ring-white"
        >
          <Home className="size-6" />
        </Link>
      </header>

      {/* Language switch */}
      <div className="mx-auto mt-1 mb-3 flex items-center gap-1 rounded-full bg-white/90 p-1 shadow-md ring-2 ring-white">
        <span className="px-3 text-xs font-bold text-slate-600">{t.language}:</span>
        {(["en", "hi"] as Lang[]).map((code) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={`rounded-full px-4 py-1.5 text-sm font-extrabold transition ${
              lang === code ? "bg-amber-400 text-white shadow" : "text-slate-600"
            }`}
          >
            {code === "en" ? "English" : "हिंदी"}
          </button>
        ))}
      </div>

      <p className="text-center text-sm font-bold text-slate-700/90 pb-2">{t.choose}</p>

      <main className="grid flex-1 grid-cols-2 gap-4 px-4 pb-10">
        {OPS.map((op, i) => {
          const Icon = op.Icon;
          return (
            <button
              key={op.key}
              className={`tile ${op.color} flex-col items-center justify-center text-center`}
              style={{ minHeight: 200 }}
            >
              <span
                className="icon-wiggle flex size-20 items-center justify-center rounded-full bg-white/95 shadow-inner"
                style={{ animationDelay: `${i * 0.15}s`, color: op.ring }}
                aria-hidden
              >
                <Icon className="size-12" strokeWidth={4} />
              </span>
              <span
                className="melly-title mt-3 leading-tight"
                style={{ fontSize: "1.2rem", color: "#fff", textShadow: "0 2px 2px rgba(0,0,0,0.25)" }}
              >
                {lang === "en" ? op.en : op.hi}
              </span>
              <span className="mt-1 inline-block rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-extrabold text-slate-700 shadow">
                {t.levels}
              </span>
            </button>
          );
        })}
      </main>
    </div>
  );
}
