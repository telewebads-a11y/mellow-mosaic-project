import { createFileRoute } from "@tanstack/react-router";
import { Home, Gamepad2, Music, User, Settings } from "lucide-react";
import type { ReactNode } from "react";

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
import bear from "@/assets/icons/bear.png";

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

type Tile = { title: string; img: string; color: string };

const tiles: Tile[] = [
  { title: "Phonics\nWorld",     img: phonics,  color: "tile-green" },
  { title: "Scribble\n& Trace",  img: scribble, color: "tile-yellow" },
  { title: "Brain\nQuiz",        img: brain,    color: "tile-pink" },
  { title: "Smart\nLearning",    img: smart,    color: "tile-mustard" },
  { title: "Explore\nthe World", img: explore,  color: "tile-blue" },
  { title: "Story\nTime",        img: story,    color: "tile-orange" },
  { title: "Know the\nColors",   img: colors,   color: "tile-orange" },
  { title: "Shapes",             img: shapes,   color: "tile-teal" },
  { title: "Coloring\nWorld",    img: coloring, color: "tile-grey" },
  { title: "Animal\nKingdom",    img: animals,  color: "tile-teal" },
  { title: "Games",              img: games,    color: "tile-red" },
  { title: "Quiz",               img: quiz,     color: "tile-magenta" },
  { title: "Fun\nphone",         img: phone,    color: "tile-coral" },
  { title: "Rewards",            img: rewards,  color: "tile-mustard" },
];

function Index() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      <header className="flex items-center justify-between px-5 pt-6 pb-5">
        <img src={bear} alt="Bear mascot" width={96} height={96} className="size-24 drop-shadow-lg" />
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
        <button aria-label="Settings" className="rounded-full p-1 text-slate-600 transition hover:rotate-45">
          <Settings className="size-8" />
        </button>
      </header>

      <main className="grid flex-1 grid-cols-2 gap-4 px-4 pb-28">
        {tiles.map((t) => (
          <button key={t.title} className={`tile tile-horizontal ${t.color}`}>
            <span className="tile-label whitespace-pre-line">{t.title}</span>
            <img src={t.img} alt="" width={96} height={96} loading="lazy" className="tile-img" />
          </button>
        ))}
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
