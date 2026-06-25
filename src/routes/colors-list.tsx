import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Home, Volume2 } from "lucide-react";
import { useState } from "react";

import bearFace from "@/assets/icons/bear-face.png";
import bgClouds from "@/assets/bg-clouds.jpg";

export const Route = createFileRoute("/colors-list")({
  head: () => ({
    meta: [
      { title: "Colors Name — Melly Kids TV" },
      { name: "description", content: "Learn 36 colors in English and Hindi with Melly the bear." },
    ],
  }),
  component: ColorsList,
});

type Lang = "en" | "hi";

type ColorItem = { en: string; hi: string; hex: string };

const COLORS: ColorItem[] = [
  { en: "Red", hi: "लाल", hex: "#ef4444" },
  { en: "Green", hi: "हरा", hex: "#22c55e" },
  { en: "Blue", hi: "नीला", hex: "#3b82f6" },
  { en: "Yellow", hi: "पीला", hex: "#facc15" },
  { en: "Orange", hi: "नारंगी", hex: "#fb923c" },
  { en: "Purple", hi: "बैंगनी", hex: "#a855f7" },
  { en: "Pink", hi: "गुलाबी", hex: "#ec4899" },
  { en: "Dark Blue", hi: "गहरा नीला", hex: "#1e3a8a" },
  { en: "Sky Blue", hi: "आसमानी", hex: "#7dd3fc" },
  { en: "Black", hi: "काला", hex: "#111827" },
  { en: "White", hi: "सफ़ेद", hex: "#ffffff" },
  { en: "Brown", hi: "भूरा", hex: "#92400e" },
  { en: "Grey", hi: "स्लेटी", hex: "#9ca3af" },
  { en: "Gold", hi: "सुनहरा", hex: "#d4af37" },
  { en: "Silver", hi: "चाँदी", hex: "#c0c0c0" },
  { en: "Maroon", hi: "मैरून", hex: "#800000" },
  { en: "Lime", hi: "नीबू हरा", hex: "#84cc16" },
  { en: "Cyan", hi: "सियान", hex: "#06b6d4" },
  { en: "Magenta", hi: "मैजेंटा", hex: "#d946ef" },
  { en: "Indigo", hi: "जामुनी", hex: "#4f46e5" },
  { en: "Violet", hi: "बैंगनी", hex: "#7c3aed" },
  { en: "Olive", hi: "जैतूनी", hex: "#808000" },
  { en: "Teal", hi: "हरित नीला", hex: "#14b8a6" },
  { en: "Turquoise", hi: "फ़िरोज़ी", hex: "#40e0d0" },
  { en: "Peach", hi: "आड़ू", hex: "#ffdab9" },
  { en: "Coral", hi: "मूँगा", hex: "#ff7f50" },
  { en: "Beige", hi: "बेज", hex: "#f5f5dc" },
  { en: "Cream", hi: "क्रीम", hex: "#fffdd0" },
  { en: "Mint", hi: "पुदीना", hex: "#98ff98" },
  { en: "Lavender", hi: "लैवेंडर", hex: "#b57edc" },
  { en: "Rose", hi: "गुलाब", hex: "#ff66cc" },
  { en: "Salmon", hi: "सैल्मन", hex: "#fa8072" },
  { en: "Mustard", hi: "सरसों", hex: "#e1ad01" },
  { en: "Navy", hi: "गहरा नीला", hex: "#001f3f" },
  { en: "Crimson", hi: "किरमिज़ी", hex: "#dc143c" },
  { en: "Aqua", hi: "जलीय", hex: "#00ffff" },
];

function speak(text: string, lang: Lang) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === "hi" ? "hi-IN" : "en-US";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function ColorsList() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>("en");

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
          onClick={() => navigate({ to: "/colors-name" })}
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

      <h1 className="melly-title px-5 pb-2 text-center leading-tight" style={{ fontSize: "2rem" }}>
        <span style={{ color: "#ef4444" }}>C</span>
        <span style={{ color: "#fb923c" }}>o</span>
        <span style={{ color: "#facc15" }}>l</span>
        <span style={{ color: "#22c55e" }}>o</span>
        <span style={{ color: "#3b82f6" }}>r</span>
        <span style={{ color: "#a855f7" }}>s </span>
        <span style={{ color: "#ec4899" }}>N</span>
        <span style={{ color: "#14b8a6" }}>a</span>
        <span style={{ color: "#f59e0b" }}>m</span>
        <span style={{ color: "#7c3aed" }}>e</span>
      </h1>

      <div className="flex justify-center gap-2 pb-3">
        {(["en", "hi"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold shadow-md ring-2 ring-white transition ${
              lang === l ? "bg-pink-500 text-white" : "bg-white/90 text-slate-700"
            }`}
          >
            {l === "en" ? "English" : "हिंदी"}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes color-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .color-tile { animation: color-float 3s ease-in-out infinite; }
      `}</style>

      <main className="grid flex-1 grid-cols-3 gap-3 px-4 pb-10">
        {COLORS.map((c, i) => {
          const label = lang === "hi" ? c.hi : c.en;
          const isLight = ["#ffffff", "#facc15", "#fffdd0", "#f5f5dc", "#ffdab9", "#98ff98", "#00ffff", "#c0c0c0", "#7dd3fc"].includes(c.hex);
          return (
            <div key={c.en} className="flex flex-col items-center">
              <button
                onClick={() => speak(label, lang)}
                className="color-tile flex w-full flex-col items-center justify-center rounded-2xl shadow-lg ring-2 ring-white"
                style={{
                  backgroundColor: c.hex,
                  minHeight: 86,
                  animationDelay: `${(i % 6) * 0.2}s`,
                }}
              >
                <span
                  className="px-1 text-center text-sm font-extrabold leading-tight"
                  style={{
                    color: isLight ? "#1f2937" : "#fff",
                    textShadow: isLight ? "none" : "0 1px 2px rgba(0,0,0,0.4)",
                  }}
                >
                  {label}
                </span>
              </button>
              <button
                aria-label={`Play ${c.en}`}
                onClick={() => speak(label, lang)}
                className="mt-1 flex size-7 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow ring-1 ring-white"
              >
                <Volume2 className="size-4" />
              </button>
            </div>
          );
        })}
      </main>
    </div>
  );
}
