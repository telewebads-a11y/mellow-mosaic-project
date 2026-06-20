import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Home, X, RotateCcw, ChevronRight, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import bearFace from "@/assets/icons/bear-face.png";
import bearTrophy from "@/assets/bear-trophy.png";
import bgClouds from "@/assets/bg-clouds.jpg";

export const Route = createFileRoute("/trace-shabad")({
  head: () => ({
    meta: [
      { title: "हिंदी शब्द — Melly Kids TV" },
      { name: "description", content: "बिना मात्रा के हिंदी शब्द ट्रेस करें।" },
    ],
  }),
  component: TraceShabad,
});

type WordItem = { w: string; en: string; e: string };

// छोटे शब्द — 2 अक्षर बिना मात्रा
const SMALL: WordItem[] = [
  { w: "नल",  en: "nal — tap",        e: "🚰" },
  { w: "घर",  en: "ghar — home",      e: "🏠" },
  { w: "वन",  en: "van — forest",     e: "🌳" },
  { w: "जल",  en: "jal — water",      e: "💧" },
  { w: "फल",  en: "phal — fruit",     e: "🍎" },
  { w: "हल",  en: "hal — plough",     e: "🚜" },
  { w: "कप",  en: "kap — cup",        e: "☕" },
  { w: "रथ",  en: "rath — chariot",   e: "🛕" },
  { w: "यश",  en: "yash — fame",      e: "🏆" },
  { w: "खग",  en: "khag — bird",      e: "🐦" },
  { w: "गज",  en: "gaj — elephant",   e: "🐘" },
  { w: "मठ",  en: "math — monastery", e: "🛕" },
  { w: "नभ",  en: "nabh — sky",       e: "☁️" },
  { w: "रस",  en: "ras — juice",      e: "🧃" },
  { w: "तट",  en: "tat — shore",      e: "🏖️" },
  { w: "कल",  en: "kal — clock",      e: "⏰" },
  { w: "मन",  en: "man — mind",       e: "💭" },
  { w: "धन",  en: "dhan — wealth",    e: "💰" },
  { w: "तन",  en: "tan — body",       e: "🧍" },
  { w: "हम",  en: "ham — we",         e: "👥" },
  { w: "बस",  en: "bas — bus",        e: "🚌" },
  { w: "पग",  en: "pag — step",       e: "🦶" },
  { w: "नग",  en: "nag — mountain",   e: "⛰️" },
  { w: "रब",  en: "rab — god",        e: "🙏" },
  { w: "कब",  en: "kab — when",       e: "❓" },
];

// बड़े शब्द — 3 अक्षर बिना मात्रा
const BIG: WordItem[] = [
  { w: "कमल",  en: "kamal — lotus",      e: "🪷" },
  { w: "कलम",  en: "kalam — pen",        e: "🖊️" },
  { w: "नमक",  en: "namak — salt",       e: "🧂" },
  { w: "चमक",  en: "chamak — shine",     e: "✨" },
  { w: "सरल",  en: "saral — simple",     e: "😊" },
  { w: "गरम",  en: "garam — hot",        e: "🌡️" },
  { w: "नरम",  en: "naram — soft",       e: "🧸" },
  { w: "पवन",  en: "pavan — wind",       e: "💨" },
  { w: "मगर",  en: "magar — crocodile",  e: "🐊" },
  { w: "वजन",  en: "vajan — weight",     e: "⚖️" },
  { w: "भवन",  en: "bhavan — building",  e: "🏢" },
  { w: "पलक",  en: "palak — eyelid",     e: "👁️" },
  { w: "नगर",  en: "nagar — city",       e: "🏙️" },
  { w: "अमर",  en: "amar — immortal",    e: "♾️" },
  { w: "असर",  en: "asar — effect",      e: "💫" },
  { w: "हवन",  en: "havan — fire rite",  e: "🔥" },
  { w: "बरफ",  en: "baraf — ice",        e: "❄️" },
  { w: "सहज",  en: "sahaj — easy",       e: "😌" },
  { w: "कसम",  en: "kasam — oath",       e: "🤝" },
  { w: "बचत",  en: "bachat — savings",   e: "💵" },
  { w: "खबर",  en: "khabar — news",      e: "📰" },
  { w: "कदम",  en: "kadam — step",       e: "👣" },
  { w: "नकल",  en: "nakal — copy",       e: "📋" },
  { w: "महक",  en: "mahak — fragrance",  e: "🌹" },
  { w: "वचन",  en: "vachan — promise",   e: "🗣️" },
  { w: "रतन",  en: "ratan — jewel",      e: "💎" },
  { w: "भगत",  en: "bhagat — devotee",   e: "🙏" },
  { w: "अदब",  en: "adab — manners",     e: "🙇" },
];

const TILE_COLORS = ["#ff6b6b", "#4ac6e8", "#ffd23f", "#6dd47e", "#b78ce8", "#ffb347"];
const CRAYONS = ["#ef4444", "#3b82f6", "#22c55e", "#facc15", "#a855f7", "#fb923c"];
const PRAISES = ["शाबाश!", "बहुत बढ़िया!", "वाह!", "Perfect!", "Awesome!", "Well Done!"];

function speak(text: string, lang = "hi-IN") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.85;
  u.pitch = 1.2;
  window.speechSynthesis.speak(u);
}

function playCelebration() {
  if (typeof window === "undefined") return;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const now = ctx.currentTime;
    const pop = ctx.createOscillator();
    const popGain = ctx.createGain();
    pop.type = "triangle";
    pop.frequency.setValueAtTime(180, now);
    pop.frequency.exponentialRampToValueAtTime(60, now + 0.18);
    popGain.gain.setValueAtTime(0.0001, now);
    popGain.gain.exponentialRampToValueAtTime(0.7, now + 0.01);
    popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    pop.connect(popGain).connect(ctx.destination);
    pop.start(now); pop.stop(now + 0.25);
    const clapTimes = [0.25, 0.36, 0.48, 0.62, 0.78, 0.96, 1.18];
    clapTimes.forEach((t) => {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.5);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filt = ctx.createBiquadFilter();
      filt.type = "bandpass"; filt.frequency.value = 1500; filt.Q.value = 0.8;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.5, now + t);
      g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.09);
      src.connect(filt).connect(g).connect(ctx.destination);
      src.start(now + t);
    });
    setTimeout(() => ctx.close(), 2000);
  } catch { /* noop */ }
}

function TraceShabad() {
  const navigate = useNavigate();
  const [active, setActive] = useState<{ list: "S" | "B"; idx: number } | null>(null);
  const [done, setDone] = useState<{ word: string; praise: string } | null>(null);

  const list = active?.list === "B" ? BIG : SMALL;
  const item = active ? list[active.idx] : null;

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-top bg-no-repeat" style={{ backgroundImage: `url(${bgClouds})` }} />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/40" />

      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <button aria-label="Back" onClick={() => navigate({ to: "/scribble-trace" })} className="flex size-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-2 ring-white">
          <ArrowLeft className="size-6" />
        </button>
        <img src={bearFace} alt="" width={56} height={56} className="size-14 drop-shadow-lg bear-bounce" />
        <Link to="/" aria-label="Home" className="flex size-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-2 ring-white">
          <Home className="size-6" />
        </Link>
      </header>

      <h1 className="melly-title px-5 pb-1 text-center leading-tight" style={{ fontSize: "1.9rem" }}>
        <span style={{ color: "#ff6b6b" }}>हिं</span>
        <span style={{ color: "#4ac6e8" }}>दी </span>
        <span style={{ color: "#6dd47e" }}>श</span>
        <span style={{ color: "#ffd23f" }}>ब्</span>
        <span style={{ color: "#b78ce8" }}>द</span>
      </h1>
      <p className="px-5 pb-3 text-center text-sm font-extrabold text-slate-700">बिना मात्रा के शब्द (Without Matra)</p>

      <main className="grid grid-cols-2 gap-3 px-3 pb-10">
        <Column title="छोटे शब्द" subtitle="2 अक्षर" items={SMALL} onPick={(idx) => setActive({ list: "S", idx })} />
        <Column title="बड़े शब्द" subtitle="3 अक्षर" items={BIG} onPick={(idx) => setActive({ list: "B", idx })} />
      </main>

      {item && (
        <TraceModal
          key={`${active!.list}-${active!.idx}`}
          word={item.w}
          english={item.en}
          emoji={item.e}
          onClose={() => setActive(null)}
          onComplete={() => {
            const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
            setDone({ word: item.w, praise });
          }}
        />
      )}

      {done && active && (
        <SuccessModal
          word={done.word}
          praise={done.praise}
          onAgain={() => setDone(null)}
          onNext={() => {
            const arr = active.list === "B" ? BIG : SMALL;
            const nextIdx = active.idx < arr.length - 1 ? active.idx + 1 : 0;
            setDone(null);
            setActive({ list: active.list, idx: nextIdx });
          }}
          onClose={() => { setDone(null); setActive(null); }}
        />
      )}
    </div>
  );
}

function Column({ title, subtitle, items, onPick }: { title: string; subtitle: string; items: WordItem[]; onPick: (idx: number) => void }) {
  return (
    <section>
      <h2 className="melly-title mb-1 text-center leading-tight" style={{ fontSize: "1.2rem", color: "#fff", WebkitTextStroke: "1.5px #9a3412", textShadow: "0 2px 0 rgba(0,0,0,0.15)" }}>
        {title}
      </h2>
      <p className="mb-2 text-center text-xs font-extrabold text-slate-600">{subtitle}</p>
      <div className="flex flex-col gap-2.5">
        {items.map((it, i) => (
          <button
            key={`${it.w}-${i}`}
            onClick={() => onPick(i)}
            className="num-cell cell-anim flex flex-col items-center justify-center gap-0.5 px-2 py-3 leading-tight"
            style={{ background: TILE_COLORS[i % TILE_COLORS.length], animationDelay: `${(i % 10) * 0.07}s`, minHeight: 120 }}
            aria-label={`Trace shabad ${it.w}`}
          >
            <span style={{ fontFamily: "'Tiro Devanagari Hindi','Noto Sans Devanagari',system-ui,sans-serif", fontSize: "2rem", lineHeight: 1, fontWeight: 900 }}>{it.w}</span>
            <span style={{ fontSize: "2rem", lineHeight: 1 }} aria-hidden>{it.e}</span>
            <span style={{ fontSize: "0.72rem", lineHeight: 1.1, fontWeight: 800, color: "#fff" }}>{it.en}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function TraceModal({ word, english, emoji, onClose, onComplete }: { word: string; english: string; emoji: string; onClose: () => void; onComplete: () => void }) {
  const [color, setColor] = useState(CRAYONS[0]);
  const colorRef = useRef(color);
  colorRef.current = color;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const distanceRef = useRef(0);
  const completedRef = useRef(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => { speak(`${word}`); }, [word]);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  useEffect(() => {
    setupCanvas();
    const handler = () => setupCanvas();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    distanceRef.current = 0;
    completedRef.current = false;
    setProgress(0);
  };

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const p = getPos(e);
    lastRef.current = p;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = colorRef.current;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const p = getPos(e);
    const last = lastRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !last) return;
    ctx.strokeStyle = colorRef.current;
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    const dx = p.x - last.x;
    const dy = p.y - last.y;
    distanceRef.current += Math.sqrt(dx * dx + dy * dy);
    lastRef.current = p;
    const target = word.length <= 2 ? 500 : 700;
    const pct = Math.min(100, (distanceRef.current / target) * 100);
    setProgress(pct);
    if (pct >= 100 && !completedRef.current) {
      completedRef.current = true;
      setTimeout(onComplete, 250);
    }
  };

  const onPointerUp = () => { drawingRef.current = false; lastRef.current = null; };

  const guideFont = word.length <= 2 ? "11rem" : "8.5rem";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-3" onClick={onClose}>
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-b from-sky-100 to-emerald-50 shadow-2xl ring-4 ring-white" style={{ height: "min(92vh, 760px)" }} onClick={(e) => e.stopPropagation()}>
        <img src={bearFace} alt="" width={48} height={48} className="bear-bounce absolute left-2 top-2 z-20 drop-shadow-lg" />

        <div className="absolute inset-x-0 top-3 z-10 flex flex-col items-center justify-center gap-0.5 pointer-events-none px-12">
          <div className="flex items-center justify-center gap-2">
            <span className="melly-title" style={{ fontSize: "1.2rem", color: "#fff", WebkitTextStroke: "1.5px #9a3412", filter: "drop-shadow(2px 3px 0 rgba(0,0,0,0.15))" }}>
              ट्रेस करें "{word}"
            </span>
            <span style={{ fontSize: "1.6rem", lineHeight: 1 }} aria-hidden>{emoji}</span>
          </div>
          <span className="text-xs font-extrabold text-slate-700">{english}</span>
        </div>

        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-30 flex size-9 items-center justify-center rounded-full bg-white text-slate-500 shadow">
          <X className="size-5" />
        </button>

        <div className="absolute inset-x-3 top-20 bottom-44 rounded-2xl bg-white/80 ring-2 ring-white shadow-inner overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none px-2">
            <span style={{ fontFamily: "'Tiro Devanagari Hindi','Noto Sans Devanagari',system-ui,sans-serif", fontWeight: 900, fontSize: guideFont, lineHeight: 1, color: "transparent", WebkitTextStroke: "7px #94a3b8" }}>{word}</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none px-2">
            <span style={{ fontFamily: "'Tiro Devanagari Hindi','Noto Sans Devanagari',system-ui,sans-serif", fontWeight: 900, fontSize: guideFont, lineHeight: 1, color: "transparent", WebkitTextStroke: "2.5px #cbd5e1" }}>{word}</span>
          </div>
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" style={{ cursor: "crosshair" }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onPointerLeave={onPointerUp} />
        </div>

        <div className="absolute inset-x-6 bottom-32 z-10 h-3 rounded-full bg-white/70 ring-2 ring-white overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#22c55e,#16a34a)" }} />
        </div>

        <div className="absolute inset-x-0 bottom-16 z-20 flex justify-center gap-2.5 px-4">
          {CRAYONS.map((c) => (
            <button key={c} aria-label={`Pick color ${c}`} onClick={() => setColor(c)} className={`crayon-shimmer size-11 rounded-full ring-4 transition ${color === c ? "ring-slate-700 scale-110" : "ring-white"} shadow-md`} style={{ background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), ${c} 55%, ${c} 100%)`, boxShadow: `0 4px 10px ${c}80, inset 0 -3px 6px rgba(0,0,0,0.25)` }} />
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-3 px-4">
          <button onClick={clear} className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 font-extrabold text-slate-700 shadow-[0_4px_0_rgba(0,0,0,0.15)] ring-2 ring-white">
            <RotateCcw className="size-5" /> साफ
          </button>
          <button onClick={() => speak(word)} aria-label="Hear it" className="flex size-12 items-center justify-center rounded-full bg-gradient-to-b from-sky-400 to-sky-600 text-white shadow-[0_4px_0_rgba(0,0,0,0.2)] ring-2 ring-white">
            <Volume2 className="size-6" />
          </button>
          <button onClick={onComplete} className="flex items-center gap-1 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-4 py-2.5 font-extrabold text-white shadow-[0_4px_0_rgba(0,0,0,0.2)] ring-2 ring-white">
            हो गया <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ word, praise, onAgain, onNext, onClose }: { word: string; praise: string; onAgain: () => void; onNext: () => void; onClose: () => void }) {
  useEffect(() => {
    playCelebration();
    const t = setTimeout(() => speak(`${praise} आपने ${word} शब्द ट्रेस किया!`), 350);
    return () => clearTimeout(t);
  }, [word, praise]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-b from-amber-200 via-pink-200 to-sky-300 shadow-2xl ring-4 ring-white" style={{ height: "min(80vh, 600px)" }}>
        <div aria-hidden className="absolute inset-0">
          {Array.from({ length: 24 }).map((_, i) => {
            const c = ["#ef4444", "#facc15", "#22c55e", "#3b82f6", "#a855f7", "#fb923c"][i % 6];
            const top = (i * 53) % 90 + 3;
            const left = (i * 37) % 92 + 3;
            const rot = (i * 47) % 360;
            return (<span key={i} className="absolute" style={{ top: `${top}%`, left: `${left}%`, width: 10, height: 14, background: c, transform: `rotate(${rot}deg)`, borderRadius: 2, opacity: 0.9 }} />);
          })}
        </div>
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-30 flex size-9 items-center justify-center rounded-full bg-white text-slate-500 shadow">
          <X className="size-5" />
        </button>
        <div className="relative z-10 flex h-full flex-col items-center justify-between p-5 text-center">
          <h2 className="melly-title" style={{ color: "#fff", textShadow: "2px 3px 0 rgba(0,0,0,0.18)", fontSize: "2.4rem" }}>{praise}</h2>
          <img src={bearTrophy} alt="" width={200} height={200} className="bear-bounce mx-auto h-44 w-auto drop-shadow-2xl" />
          <p className="text-lg font-extrabold leading-snug text-white drop-shadow">
            आपने <span className="text-2xl">"{word}"</span> सुंदर ट्रेस किया!
          </p>
          <div className="flex w-full items-center justify-center gap-3">
            <button onClick={onAgain} className="flex items-center gap-2 rounded-full bg-white px-4 py-3 font-extrabold text-amber-600 shadow-[0_5px_0_rgba(0,0,0,0.15)]">
              <RotateCcw className="size-5" /> फिर से
            </button>
            <button onClick={onNext} className="flex items-center gap-2 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-5 py-3 font-extrabold text-white shadow-[0_5px_0_rgba(0,0,0,0.2)]">
              अगला <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
