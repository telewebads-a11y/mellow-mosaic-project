import { createFileRoute } from "@tanstack/react-router";
import { Home, Gamepad2, Music, User, Settings } from "lucide-react";

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

type Tile = { title: string; emoji: string; color: string };

const tiles: Tile[] = [
  { title: "Phonics\nWorld", emoji: "📣", color: "tile-green" },
  { title: "Scribble\n& Trace", emoji: "✏️", color: "tile-yellow" },
  { title: "Brain\nQuiz", emoji: "🧠", color: "tile-pink" },
  { title: "Smart\nLearning", emoji: "💡", color: "tile-mustard" },
  { title: "Explore\nthe World", emoji: "🌍", color: "tile-blue" },
  { title: "Story\nTime", emoji: "📖", color: "tile-orange" },
  { title: "Know the\nColors", emoji: "🎨", color: "tile-orange" },
  { title: "Shapes", emoji: "🔷", color: "tile-teal" },
  { title: "Coloring\nWorld", emoji: "🖍️", color: "tile-grey" },
  { title: "Animal\nKingdom", emoji: "🦁", color: "tile-teal" },
  { title: "Games", emoji: "🎮", color: "tile-red" },
  { title: "Quiz", emoji: "❓", color: "tile-magenta" },
  { title: "Fun\nphone", emoji: "📱", color: "tile-coral" },
  { title: "Rewards", emoji: "🏆", color: "tile-mustard" },
];

function Index() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl drop-shadow-sm" aria-hidden>🐻</span>
          <span className="text-3xl -ml-3 drop-shadow-sm" aria-hidden>🐻</span>
        </div>
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
          <Settings className="size-7" />
        </button>
      </header>

      {/* Grid */}
      <main className="grid flex-1 grid-cols-2 gap-3 px-4 pb-28">
        {tiles.map((t) => (
          <button key={t.title} className={`tile ${t.color}`}>
            <span className="whitespace-pre-line">{t.title}</span>
            <span className="tile-emoji" aria-hidden>{t.emoji}</span>
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
}: { icon: React.ReactNode; label: string; color: string; active?: boolean }) {
  return (
    <button className="flex flex-col items-center gap-1" style={{ color }}>
      <span className={active ? "drop-shadow-sm" : "opacity-80"}>{icon}</span>
      <span className="text-xs font-bold" style={{ color }}>{label}</span>
    </button>
  );
}
