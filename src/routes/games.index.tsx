import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Home, Play } from "lucide-react";
import bgClouds from "@/assets/bg-clouds.jpg";
import bearFace from "@/assets/icons/bear-face.png";

export const Route = createFileRoute("/games/")({
  head: () => ({
    meta: [
      { title: "Games — Melly Kids" },
      { name: "description", content: "20 fun kid-friendly mini games." },
    ],
  }),
  component: GamesHub,
});

type GameDef = {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  color: string;
  ring: string;
};

const GAMES: GameDef[] = [
  // original 10
  { id: "shooting",   name: "Balloon Shoot", desc: "Pop the balloons!",  emoji: "🎯", color: "from-rose-400 to-red-500",       ring: "ring-red-300" },
  { id: "running",    name: "Bear Run",      desc: "Jump the rocks",      emoji: "🏃", color: "from-amber-400 to-orange-500",   ring: "ring-orange-300" },
  { id: "jumping",    name: "Lily Hop",      desc: "Hop the platforms",   emoji: "🦘", color: "from-emerald-400 to-green-500",  ring: "ring-green-300" },
  { id: "snake",      name: "Hungry Snake",  desc: "Eat & grow long",     emoji: "🐍", color: "from-lime-400 to-emerald-600",   ring: "ring-lime-300" },
  { id: "tictactoe",  name: "Tic-Tac-Toe",   desc: "Beat the bear",       emoji: "⭕", color: "from-sky-400 to-blue-500",       ring: "ring-sky-300" },
  { id: "memory",     name: "Memory Match",  desc: "Find the pairs",      emoji: "🧠", color: "from-violet-400 to-purple-500",  ring: "ring-violet-300" },
  { id: "catch",      name: "Catch Fruit",   desc: "Catch the fruits",    emoji: "🍎", color: "from-pink-400 to-rose-500",      ring: "ring-pink-300" },
  { id: "maze",       name: "Magic Maze",    desc: "Find the goal",       emoji: "🗺️", color: "from-indigo-400 to-blue-600",    ring: "ring-indigo-300" },
  { id: "bubble",     name: "Bubble Pop",    desc: "Pop all bubbles",     emoji: "🫧", color: "from-cyan-400 to-sky-500",       ring: "ring-cyan-300" },
  { id: "colorsort",  name: "Color Sort",    desc: "Match the color",     emoji: "🎨", color: "from-fuchsia-400 to-pink-500",   ring: "ring-fuchsia-300" },
  // new 10
  { id: "fruitcut",   name: "Fruit Cutter",  desc: "Slice the fruits",    emoji: "🍉", color: "from-red-400 to-rose-600",       ring: "ring-red-300" },
  { id: "bomber",     name: "Bomb Dodger",   desc: "Avoid the bombs",     emoji: "💣", color: "from-slate-500 to-slate-800",    ring: "ring-slate-300" },
  { id: "mario",      name: "Bear Bros",     desc: "Stomp & jump",        emoji: "🍄", color: "from-red-500 to-amber-500",      ring: "ring-amber-300" },
  { id: "fly",        name: "Flappy Bear",   desc: "Tap to fly",          emoji: "🐦", color: "from-yellow-300 to-amber-500",   ring: "ring-yellow-300" },
  { id: "rocket",     name: "Rocket Shoot",  desc: "Blast aliens!",       emoji: "🚀", color: "from-indigo-500 to-purple-700",  ring: "ring-indigo-300" },
  { id: "racecar",    name: "Race Car",      desc: "Dodge traffic",       emoji: "🏎️", color: "from-orange-500 to-red-600",     ring: "ring-orange-300" },
  { id: "helicopter", name: "Helicopter",    desc: "Fly through caves",   emoji: "🚁", color: "from-teal-400 to-emerald-600",   ring: "ring-teal-300" },
  { id: "ninja",      name: "Ninja Jump",    desc: "Wall-jump ninja",     emoji: "🥷", color: "from-zinc-700 to-black",         ring: "ring-zinc-300" },
  { id: "dino",       name: "Dino Run",      desc: "Skip the cactus",     emoji: "🦖", color: "from-emerald-500 to-teal-700",   ring: "ring-emerald-300" },
  { id: "frogger",    name: "Frog Cross",    desc: "Cross the road",      emoji: "🐸", color: "from-green-400 to-emerald-600",  ring: "ring-green-300" },
];

function GamesHub() {
  const nav = useNavigate();
  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgClouds})` }} />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-sky-200/40 to-pink-200/40" />

      <header className="mx-auto flex max-w-md items-center justify-between px-4 pt-5">
        <button onClick={() => nav({ to: "/games" })} className="rounded-full bg-white/80 p-2 shadow">
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex items-center gap-2">
          <img src={bearFace} alt="" className="size-12 drop-shadow" style={{ animation: "bearBounceHub 1.5s ease-in-out infinite" }} />
          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-rose-500">G</span>
            <span className="text-amber-500">a</span>
            <span className="text-emerald-500">m</span>
            <span className="text-sky-500">e</span>
            <span className="text-violet-500">s</span>
          </h1>
        </div>
        <button onClick={() => nav({ to: "/games" })} className="rounded-full bg-white/80 p-2 shadow">
          <Home className="size-5" />
        </button>
      </header>

      <main className="mx-auto max-w-md px-4 pb-10 pt-4">
        <div className="grid grid-cols-2 gap-4">
          {GAMES.map((g, i) => (
            <button
              key={g.id}
              onClick={() => nav({ to: "/games/$gameId" as any, params: { gameId: g.id } as any })}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${g.color} p-3 text-left text-white shadow-xl ring-4 ${g.ring} transition active:scale-95`}
              style={{ transform: "perspective(600px) rotateX(4deg)" }}
            >
              {/* shiny gloss */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
              <div className="absolute -right-4 -bottom-4 size-24 rounded-full bg-white/10 blur-xl pointer-events-none" />

              <div className="relative flex flex-col items-center gap-1">
                {/* big emoji icon */}
                <div
                  className="text-6xl drop-shadow-lg select-none"
                  style={{
                    filter: "drop-shadow(0 4px 6px rgba(0,0,0,.35))",
                    animation: `gameIconFloat 2.${i % 9}s ease-in-out infinite`,
                    transform: "perspective(400px) rotateX(-8deg)",
                  }}
                >
                  {g.emoji}
                </div>
                <div className="font-extrabold text-base leading-tight drop-shadow text-center">{g.name}</div>
                <div className="text-[10px] opacity-90 text-center">{g.desc}</div>
                <div className="mt-1 flex items-center gap-1 rounded-full bg-white text-slate-800 px-3 py-1 text-[11px] font-bold shadow">
                  <Play className="size-3 fill-current" /> Play
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      <style>{`
        @keyframes gameIconFloat {
          0%,100% { transform: perspective(400px) rotateX(-8deg) translateY(0) rotate(-3deg); }
          50%     { transform: perspective(400px) rotateX(-8deg) translateY(-6px) rotate(3deg); }
        }
        @keyframes bearBounceHub {
          0%,100% { transform: translateY(0) rotate(-4deg); }
          50%     { transform: translateY(-6px) rotate(4deg); }
        }
      `}</style>
    </div>
  );
}
