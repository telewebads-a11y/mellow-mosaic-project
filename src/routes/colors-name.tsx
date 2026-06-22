import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Volume2 } from "lucide-react";
import bearFace from "@/assets/icons/bear-face.png";
import bgClouds from "@/assets/bg-clouds.jpg";

export const Route = createFileRoute("/colors-name")({
  head: () => ({
    meta: [
      { title: "Colors Name — Melly Kids TV" },
      { name: "description", content: "Learn 36 color names in English and Hindi with Melly the bear." },
    ],
  }),
  component: ColorsName,
});

type Lang = "en" | "hi";

type Color = { hex: string; en: string; hi: string };

const COLORS: Color[] = [
  { hex: "#FF0000", en: "Red",          hi: "लाल" },
  { hex: "#008000", en: "Green",        hi: "हरा" },
  { hex: "#FFFF00", en: "Yellow",       hi: "पीला" },
  { hex: "#FFA500", en: "Orange",       hi: "नारंगी" },
  { hex: "#0000FF", en: "Blue",         hi: "नीला" },
  { hex: "#000080", en: "Dark Blue",    hi: "गहरा नीला" },
  { hex: "#800080", en: "Purple",       hi: "बैंगनी" },
  { hex: "#FFC0CB", en: "Pink",         hi: "गुलाबी" },
  { hex: "#A52A2A", en: "Brown",        hi: "भूरा" },
  { hex: "#000000", en: "Black",        hi: "काला" },
  { hex: "#FFFFFF", en: "White",        hi: "सफ़ेद" },
  { hex: "#808080", en: "Grey",         hi: "स्लेटी" },
  { hex: "#87CEEB", en: "Sky Blue",     hi: "आसमानी" },
  { hex: "#FFD700", en: "Gold",         hi: "सुनहरा" },
  { hex: "#C0C0C0", en: "Silver",       hi: "चाँदी" },
  { hex: "#00FFFF", en: "Cyan",         hi: "सियान" },
  { hex: "#FF00FF", en: "Magenta",      hi: "मैजेंटा" },
  { hex: "#00FF00", en: "Lime",         hi: "नींबू हरा" },
  { hex: "#008080", en: "Teal",         hi: "हरित नीला" },
  { hex: "#4B0082", en: "Indigo",       hi: "जामुनी" },
  { hex: "#EE82EE", en: "Violet",       hi: "बैंगनी" },
  { hex: "#FFDAB9", en: "Peach",        hi: "आड़ू" },
  { hex: "#F5F5DC", en: "Beige",        hi: "बेज" },
  { hex: "#800000", en: "Maroon",       hi: "मैरून" },
  { hex: "#808000", en: "Olive",        hi: "जैतूनी" },
  { hex: "#40E0D0", en: "Turquoise",    hi: "फ़िरोज़ी" },
  { hex: "#FA8072", en: "Salmon",       hi: "सैल्मन" },
  { hex: "#DC143C", en: "Crimson",      hi: "किरमिजी" },
  { hex: "#E6E6FA", en: "Lavender",     hi: "लैवेंडर" },
  { hex: "#FF7F50", en: "Coral",        hi: "मूँगा" },
  { hex: "#DAA520", en: "Mustard",      hi: "सरसों" },
  { hex: "#7FFF00", en: "Chartreuse",   hi: "हल्का हरा" },
  { hex: "#F0E68C", en: "Khaki",        hi: "खाकी" },
  { hex: "#FFFFF0", en: "Ivory",        hi: "हाथीदाँत" },
  { hex: "#CD7F32", en: "Bronze",       hi: "काँस्य" },
  { hex: "#36454F", en: "Charcoal",     hi: "कोयला" },
];

const T = {
  en: { title: "Colors Name", switch: "हिंदी" },
  hi: { title: "रंगों के नाम", switch: "English" },
};

function speak(text: string, lang: Lang) {
  try {
    window.speechSynthesis?.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "hi" ? "hi-IN" : "en-US";
    u.rate = 0.9;
    u.pitch = 1.2;
    window.speechSynthesis?.speak(u);
  } catch {}
}

function ColorsName() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-top"
        style={{ backgroundImage: `url(${bgClouds})` }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/50" />

      <header className="flex items-center justify-between gap-3 px-4 pt-5 pb-3">
        <button
          aria-label="Back"
          onClick={() => navigate({ to: "/games" })}
          className="flex size-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-2 ring-white"
        >
          <ArrowLeft className="size-6" />
        </button>
        <button
          onClick={() => setLang((l) => (l === "en" ? "hi" : "en"))}
          className="rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-slate-700 shadow-md ring-2 ring-white"
        >
          {t.switch}
        </button>
      </header>

      <div className="flex items-center justify-center gap-3 px-5 pb-4">
        <img src={bearFace} alt="Bear" className="size-14 bear-bounce drop-shadow-lg" />
        <h1 className="melly-title text-3xl leading-tight">
          <span style={{ color: "#ff6b6b" }}>{t.title}</span>
        </h1>
      </div>

      <main className="grid grid-cols-2 gap-3 px-4 pb-24 sm:grid-cols-3">
        {COLORS.map((c, i) => {
          const isLight =
            c.hex.toLowerCase() === "#ffffff" ||
            c.hex.toLowerCase() === "#fffff0" ||
            c.hex.toLowerCase() === "#f5f5dc";
          const dur = 2.6 + ((i * 7) % 18) / 10; // 2.6s - 4.4s
          const delay = ((i * 13) % 20) / 10;    // 0 - 2s
          return (
            <button
              key={c.en}
              onClick={() => speak(lang === "hi" ? c.hi : c.en, lang)}
              className="group flex flex-col items-center gap-2 rounded-2xl bg-white/90 p-3 shadow-md ring-2 ring-white transition active:scale-95"
            >
              <div
                className="h-20 w-full rounded-xl shadow-inner color-float"
                style={{
                  backgroundColor: c.hex,
                  border: isLight ? "2px solid #e5e7eb" : "none",
                  animationDuration: `${dur}s`,
                  animationDelay: `${delay}s`,
                }}
              />
              <div className="text-center font-extrabold text-slate-800">
                {lang === "hi" ? c.hi : c.en}
              </div>
              <Volume2 className="size-5 text-slate-500 opacity-80" />
            </button>
          );
        })}
      </main>
    </div>
  );
}

const _styles = `
@keyframes colorFloat {
  0%   { transform: translateY(0) scale(1); }
  50%  { transform: translateY(-8px) scale(1.04); }
  100% { transform: translateY(0) scale(1); }
}
.color-float {
  animation-name: colorFloat;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
`;
if (typeof document !== "undefined" && !document.getElementById("colors-name-styles")) {
  const s = document.createElement("style");
  s.id = "colors-name-styles";
  s.textContent = _styles;
  document.head.appendChild(s);
}
