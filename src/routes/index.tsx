import { createFileRoute } from "@tanstack/react-router";
import {
  Home, Gamepad2, Music, User, Settings,
  Megaphone, Pencil, Brain, Lightbulb, Globe2, BookOpen,
  Palette, Shapes, Crown, PawPrint, HelpCircle, Smartphone, Trophy,
} from "lucide-react";
import type { ReactNode } from "react";

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

type Tile = { title: string; icon: ReactNode; color: string };

const ICON_PROPS = { className: "size-12", strokeWidth: 2.25 } as const;

const tiles: Tile[] = [
  { title: "Phonics\nWorld",   icon: <Megaphone {...ICON_PROPS} />,  color: "tile-green" },
  { title: "Scribble\n& Trace",icon: <Pencil {...ICON_PROPS} />,     color: "tile-yellow" },
  { title: "Brain\nQuiz",      icon: <Brain {...ICON_PROPS} />,      color: "tile-pink" },
  { title: "Smart\nLearning",  icon: <Lightbulb {...ICON_PROPS} />,  color: "tile-mustard" },
  { title: "Explore\nthe World", icon: <Globe2 {...ICON_PROPS} />,   color: "tile-blue" },
  { title: "Story\nTime",      icon: <BookOpen {...ICON_PROPS} />,   color: "tile-orange" },
  { title: "Know the\nColors", icon: <Palette {...ICON_PROPS} />,    color: "tile-orange" },
  { title: "Shapes",           icon: <Shapes {...ICON_PROPS} />,     color: "tile-teal" },
  { title: "Coloring\nWorld",  icon: <Crown {...ICON_PROPS} />,      color: "tile-grey" },
  { title: "Animal\nKingdom",  icon: <PawPrint {...ICON_PROPS} />,   color: "tile-teal" },
  { title: "Games",            icon: <Gamepad2 {...ICON_PROPS} />,   color: "tile-red" },
  { title: "Quiz",             icon: <HelpCircle {...ICON_PROPS} />, color: "tile-magenta" },
  { title: "Fun\nphone",       icon: <Smartphone {...ICON_PROPS} />, color: "tile-coral" },
  { title: "Rewards",          icon: <Trophy {...ICON_PROPS} />,     color: "tile-mustard" },
];

function Index() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-5">
        <span className="text-6xl drop-shadow-md leading-none" aria-hidden>🐻</span>
        <h1 className="melly-title">
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
        <button
          aria-label="Settings"
          className="rounded-full p-1 text-slate-600 transition hover:rotate-45"
        >
          <Settings className="size-8" />
        </button>
      </header>

      {/* Grid */}
      <main className="grid flex-1 grid-cols-2 gap-4 px-4 pb-28">
        {tiles.map((t) => (
          <button key={t.title} className={`tile tile-vertical ${t.color}`}>
            <span className="tile-icon" aria-hidden>{t.icon}</span>
            <span className="tile-label whitespace-pre-line">{t.title}</span>
          </button>
        ))}
      </main>

      {/* Bottom nav */}
      <nav className="bottom-nav fixed inset-x-0 bottom-0 mx-auto flex max-w-md items-center justify-around px-6 py-3">
        <NavItem icon={<Home className="size-7" />} label="Home" color="#4ac6e8" active />
        <NavItem icon={<Gamepad2 className="size-7" />} label="Games" color="#f5b73a" />
        <NavItem icon={<Music className="size-7" />} label="Music" color="#b78ce8" />
        <NavItem icon={<User className="size-7" />} label="Profile" color="#ec6a5a" />
      </nav>
    </div>
  );
}

function NavItem({
  icon, label, color, active,
}: { icon: ReactNode; label: string; color: string; active?: boolean }) {
  return (
    <button className="flex flex-col items-center gap-1" style={{ color }}>
      <span className={active ? "drop-shadow-sm" : "opacity-80"}>{icon}</span>
      <span className="text-sm font-bold" style={{ color }}>{label}</span>
    </button>
  );
}
