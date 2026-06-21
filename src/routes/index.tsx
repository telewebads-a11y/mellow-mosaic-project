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
  const activeTheme = themes.find((t) => t.id === themeId)!;

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
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
