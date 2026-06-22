import { createFileRoute, Link } from "@tanstack/react-router";
import { Home, Gamepad2, Music, User, Palette, Trees, Waves, Rainbow, Rocket, Check, Settings } from "lucide-react";
import { useState, type ReactNode } from "react";

import phonics from "@/assets/icons/phonics.png";
import scribble from "@/assets/icons/scribble.png";
import brain from "@/assets/icons/brain.png";
import smart from "@/assets/icons/smart.png";
import explore from "@/assets/icons/explore.png";
import story from "@/assets/icons/story.png";
import colors from "@/assets/icons/colors.png";
import shapes from "@/assets/icons/shapes.png";
import coloring from "@/assets/icons/coloring.png";
import animals from "@/assets/icons/animals.png";
import games from "@/assets/icons/games.png";
import quiz from "@/assets/icons/quiz.png";
import phone from "@/assets/icons/phone.png";
import rewards from "@/assets/icons/rewards.png";
import numbers from "@/assets/icons/numbers.png";
import abc from "@/assets/icons/abc.png";
import drawing from "@/assets/icons/drawing.png";
import bearFace from "@/assets/icons/bear-face.png";
import bgJungle from "@/assets/bg-clouds.jpg";
import bgOcean from "@/assets/bg-ocean.jpg";
import bgRainbow from "@/assets/bg-rainbow.jpg";
import bgSpace from "@/assets/bg-space.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Melly Kids TV — Fun Learning for Kids" },
      { name: "description", content: "Phonics, quizzes, stories, coloring, games and more — a playful learning playground for kids." },
      { property: "og:title", content: "Melly Kids TV" },
      { property: "og:description", content: "A playful learning playground for kids." },
    ],
  }),
  component: Index,
});

type Tile = { title: string; img: string; color: string; to?: string };

const tiles: Tile[] = [
  { title: "Number\nWorld",      img: numbers,  color: "tile-blue", to: "/number-world" },
  { title: "ABC\nWorld",         img: abc,      color: "tile-pink", to: "/abc-world" },
  { title: "Phonics\nWorld",     img: phonics,  color: "tile-green" },
  { title: "Scribble\n& Trace",  img: scribble, color: "tile-yellow", to: "/scribble-trace" },
  { title: "Drawing",            img: drawing,  color: "tile-coral" },
  { title: "Brain\nQuiz",        img: brain,    color: "tile-pink", to: "/brain-quiz" },
  { title: "Smart\nLearning",    img: smart,    color: "tile-mustard", to: "/smart-learning" },
  { title: "Explore\nthe World", img: explore,  color: "tile-blue" },
  { title: "Story\nTime",        img: story,    color: "tile-orange" },
  { title: "Coloring\nWorld",    img: colors,   color: "tile-orange" },
  { title: "Shapes",             img: shapes,   color: "tile-teal" },
  { title: "Colors\nName",       img: coloring, color: "tile-grey", to: "/colors-name" },
  { title: "Animal\nKingdom",    img: animals,  color: "tile-teal" },
  { title: "Games",              img: games,    color: "tile-red", to: "/games" },
  { title: "Quiz",               img: quiz,     color: "tile-magenta" },
  { title: "Fun\nphone",         img: phone,    color: "tile-coral", to: "/fun-phone" },
  { title: "Rewards",            img: rewards,  color: "tile-mustard" },
];

type ThemeId = "jungle" | "ocean" | "rainbow" | "space";
const themes: { id: ThemeId; label: string; img: string; icon: ReactNode; tint: string }[] = [
  { id: "jungle",  label: "Jungle",  img: bgJungle,  icon: <Trees className="size-6" />,   tint: "#5ec98a" },
  { id: "ocean",   label: "Ocean",   img: bgOcean,   icon: <Waves className="size-6" />,   tint: "#4aa6cf" },
  { id: "rainbow", label: "Rainbow", img: bgRainbow, icon: <Rainbow className="size-6" />, tint: "#d96cb0" },
  { id: "space",   label: "Space",   img: bgSpace,   icon: <Rocket className="size-6" />,  tint: "#7c5cd6" },
];

function Index() {
  const [themeId, setThemeId] = useState<ThemeId>("jungle");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showButton, setShowWelcomeButton] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const activeTheme = themes.find((t) => t.id === themeId)!;

  // Sound generator
  const playSound = (type: "welcome" | "start") => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      if (type === "welcome") {
        // High quality sweet chord arpeggio
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + index * 0.08);
          gain.gain.setValueAtTime(0, now + index * 0.08);
          gain.gain.linearRampToValueAtTime(0.15, now + index * 0.08 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + index * 0.08);
          osc.stop(now + index * 0.08 + 0.6);
        });
      } else if (type === "start") {
        // High-pitched magical sparkle / success sound
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + index * 0.05);
          gain.gain.setValueAtTime(0, now + index * 0.05);
          gain.gain.linearRampToValueAtTime(0.2, now + index * 0.05 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.05 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + index * 0.05);
          osc.stop(now + index * 0.05 + 0.55);
        });
      }
    } catch (e) {
      console.log("Audio failed to play", e);
    }
  };

  // Play chime on launch
  useState(() => {
    // Wait a brief moment to allow user interaction context if possible, or play on mount
    const timer = setTimeout(() => {
      playSound("welcome");
    }, 100);
    return () => clearTimeout(timer);
  });

  // Activate "Let's Go" button after 2 seconds
  useState(() => {
    const timer = setTimeout(() => {
      setShowWelcomeButton(true);
    }, 2000);
    return () => clearTimeout(timer);
  });

  const handleStart = () => {
    playSound("start");
    setIsExiting(true);
    setTimeout(() => {
      setShowWelcome(false);
    }, 800); // match fade-out animation length
  };

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden">
      {/* 3D-feel Welcome Page Overlay */}
      {showWelcome && (
        <div
          className={`fixed inset-x-0 top-0 z-50 mx-auto flex h-full max-w-md flex-col items-center justify-between bg-gradient-to-b from-[#bbeeff] via-[#d6efff] to-[#ffdaeb] px-6 py-12 transition-all duration-700 ease-out ${
            isExiting ? "pointer-events-none scale-150 opacity-0 blur-md" : "scale-100 opacity-100"
          }`}
        >
          {/* Animated Ray Sunburst Background */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-[40%] size-[800px] -translate-x-1/2 -translate-y-1/2 animate-[spin_60s_linear_infinite] opacity-25">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 h-[400px] w-16 origin-bottom -translate-x-1/2 -translate-y-full bg-gradient-to-t from-transparent to-white"
                  style={{ transform: `rotate(${i * 30}deg) translateX(-50%)` }}
                />
              ))}
            </div>
            {/* Drifting Sparkly Stars / Bubbles */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent" />
            <div className="absolute left-5 top-10 size-16 animate-bounce rounded-full bg-white/20 blur-md duration-[3000ms]" />
            <div className="absolute right-10 top-24 size-24 animate-pulse rounded-full bg-white/30 blur-lg duration-[4000ms]" />
            <div className="absolute left-16 bottom-32 size-20 animate-pulse rounded-full bg-white/25 blur-md duration-[5000ms]" />
          </div>

          {/* Top Header Section of Welcome */}
          <div className="text-center">
            <span className="inline-block animate-bounce rounded-full bg-white/70 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#ff6b6b] shadow-md ring-2 ring-white/50 backdrop-blur-sm">
              🌟 Welcome to the Fun! 🌟
            </span>
          </div>

          {/* Central 3D Mascot & Logo Box */}
          <div className="relative flex flex-1 flex-col items-center justify-center gap-6 py-4">
            {/* Mascot Back Glow */}
            <div className="absolute size-48 animate-pulse rounded-full bg-white/60 blur-3xl" />

            {/* Melly Bear Mascot in 3D frame */}
            <div className="relative z-10 flex size-44 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 p-2 shadow-[0_15px_30px_-5px_rgba(235,160,50,0.4)] ring-4 ring-white animate-[bounce_2.5s_infinite_alternate]">
              <img
                src={bearFace}
                alt="Melly Bear Mascot"
                className="size-36 drop-shadow-2xl transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                onClick={() => playSound("welcome")}
              />
              <span className="absolute -right-2 -top-2 flex size-10 animate-[pulse_1.5s_infinite] items-center justify-center rounded-full bg-yellow-400 text-lg shadow-lg ring-2 ring-white">
                👋
              </span>
            </div>

            {/* App Branding Text with 3D Pop Layer */}
            <div className="z-10 text-center">
              <h1 className="melly-title text-4xl leading-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
                <span style={{ color: "#ff6b6b" }}>M</span>
                <span style={{ color: "#ffb347" }}>e</span>
                <span style={{ color: "#ffd23f" }}>l</span>
                <span style={{ color: "#6dd47e" }}>l</span>
                <span style={{ color: "#4ac6e8" }}>y </span>
                <span style={{ color: "#ff6b6b" }}>K</span>
                <span style={{ color: "#ffb347" }}>i</span>
                <span style={{ color: "#ffd23f" }}>d</span>
                <span style={{ color: "#6dd47e" }}>s </span>
                <span style={{ color: "#4ac6e8" }}>T</span>
                <span style={{ color: "#b78ce8" }}>V</span>
              </h1>
              <p className="mt-3 max-w-[280px] text-sm font-black tracking-wide text-slate-500 uppercase leading-relaxed [text-shadow:0_1px_0_white]">
                Play, Learn & Discover with Melly! 🎈
              </p>
            </div>
          </div>

          {/* Let's Go Button Section (after 2 seconds) */}
          <div className="h-20 w-full flex items-center justify-center">
            {showButton ? (
              <button
                onClick={handleStart}
                className="group relative flex h-14 w-full max-w-[240px] items-center justify-center rounded-full bg-gradient-to-r from-[#ff6b6b] via-[#ff8e53] to-[#ffb347] font-black uppercase tracking-wider text-white shadow-[0_10px_25px_-3px_rgba(255,107,107,0.5)] ring-4 ring-white transition-all duration-300 hover:scale-105 active:scale-95 animate-[pulse_2s_infinite]"
              >
                <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="flex items-center gap-2 text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]">
                  Let's Go! 🚀
                </span>
              </button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="size-3 animate-bounce rounded-full bg-[#ff6b6b]" style={{ animationDelay: "0ms" }} />
                  <span className="size-3 animate-bounce rounded-full bg-[#ffd23f]" style={{ animationDelay: "150ms" }} />
                  <span className="size-3 animate-bounce rounded-full bg-[#4ac6e8]" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Loading magic...</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-top bg-no-repeat transition-[background-image] duration-500"
        style={{ backgroundImage: `url(${activeTheme.img})` }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/35" />

      <header className="flex items-center justify-between px-5 pt-6 pb-5">
        <img
          src={bearFace}
          alt="Bear mascot"
          width={96}
          height={96}
          className="size-20 drop-shadow-lg bear-bounce"
        />
        <h1 className="melly-title text-center leading-tight">
          <span style={{ color: "#ff6b6b" }}>M</span>
          <span style={{ color: "#ffb347" }}>e</span>
          <span style={{ color: "#ffd23f" }}>l</span>
          <span style={{ color: "#6dd47e" }}>l</span>
          <span style={{ color: "#4ac6e8" }}>y </span>
          <span style={{ color: "#ff6b6b" }}>K</span>
          <span style={{ color: "#ffb347" }}>i</span>
          <span style={{ color: "#ffd23f" }}>d</span>
          <span style={{ color: "#6dd47e" }}>s </span>
          <span style={{ color: "#4ac6e8" }}>T</span>
          <span style={{ color: "#b78ce8" }}>V</span>
        </h1>
        <div className="flex flex-col items-end gap-2">
          <div className="relative">
            <button
              aria-label="Change theme"
              onClick={() => setPickerOpen((v) => !v)}
              className="flex size-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-2 ring-white transition hover:scale-105"
              style={{ color: activeTheme.tint }}
            >
              <Palette className="size-6" />
            </button>
            {pickerOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setPickerOpen(false)}
                  aria-hidden
                />
                <div className="absolute right-0 top-14 z-20 w-44 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5">
                  <p className="px-2 pb-1 pt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Theme
                  </p>
                  {themes.map((t) => {
                    const active = t.id === themeId;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setThemeId(t.id);
                          setPickerOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                      >
                        <span
                          className="flex size-9 items-center justify-center rounded-full text-white"
                          style={{ background: t.tint }}
                        >
                          {t.icon}
                        </span>
                        <span className="flex-1">{t.label}</span>
                        {active && <Check className="size-4 text-emerald-500" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <Link
            to="/settings"
            aria-label="Settings"
            className="flex size-11 items-center justify-center rounded-full bg-white/90 shadow-md ring-2 ring-white transition hover:scale-105"
            style={{ color: activeTheme.tint }}
          >
            <Settings className="size-6" />
          </Link>

        </div>
      </header>

      <main className="grid flex-1 grid-cols-2 gap-4 px-4 pb-28">
        {tiles.map((t, i) => {
          const inner = (
            <>
              <span className="tile-label whitespace-pre-line">{t.title}</span>
              <img src={t.img} alt="" width={96} height={96} loading="lazy" className="tile-img" />
            </>
          );
          const key = `${t.title}-${i}`;
          const cls = `tile tile-horizontal ${t.color}`;
          return t.to ? (
            <Link key={key} to={t.to} className={cls}>{inner}</Link>
          ) : (
            <button key={key} className={cls}>{inner}</button>
          );
        })}
      </main>

      <nav className="bottom-nav fixed inset-x-0 bottom-0 mx-auto flex max-w-md items-center justify-around px-6 py-3">
        <NavItem icon={<Home className="size-7" />} label="Home" color="#4ac6e8" active />
        <NavItem icon={<Gamepad2 className="size-7" />} label="Games" color="#f5b73a" />
        <NavItem icon={<Music className="size-7" />} label="Music" color="#b78ce8" />
        <NavItem icon={<User className="size-7" />} label="Profile" color="#ec6a5a" />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, color, active }: { icon: ReactNode; label: string; color: string; active?: boolean }) {
  return (
    <button className="flex flex-col items-center gap-1" style={{ color }}>
      <span className={active ? "drop-shadow-sm" : "opacity-80"}>{icon}</span>
      <span className="text-sm font-bold" style={{ color }}>{label}</span>
    </button>
  );
}
