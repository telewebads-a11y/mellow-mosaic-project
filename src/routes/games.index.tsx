import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Home, Play } from "lucide-react";
import {
  Crosshair, Footprints, ArrowUpFromLine, Worm, Hash,
  Brain, Apple, Grid3x3, Circle, Palette,
} from "lucide-react";
import bgClouds from "@/assets/bg-clouds.jpg";
import bearFace from "@/assets/icons/bear-face.png";

export const Route = createFileRoute("/games/")({
  head: () => ({
    meta: [
      { title: "Games — Melly Kids" },
      { name: "description", content: "10 fun kid-friendly mini games." },
    ],
  }),
  component: GamesHub,
});

type GameDef = {
  id: string;
  name: string;
  desc: string;
  Icon: any;
  color: string;
  ring: string;
};

const GAMES: GameDef[] = [
  { id: "shooting",   name: "Shooting",     desc: "Pop the balloons!",   Icon: Crosshair,      color: "from-rose-400 to-red-500",        ring: "ring-red-300" },
  { id: "running",    name: "Running",      desc: "Jump the rocks",       Icon: Footprints,     color: "from-amber-400 to-orange-500",    ring: "ring-orange-300" },
  { id: "jumping",    name: "Jumping",      desc: "Hop the platforms",    Icon: ArrowUpFromLine,color: "from-emerald-400 to-green-500",   ring: "ring-green-300" },
  { id: "snake",      name: "Snake",        desc: "Eat & grow long",      Icon: Worm,           color: "from-lime-400 to-emerald-500",    ring: "ring-lime-300" },
  { id: "tictactoe",  name: "Tic-Tac-Toe",  desc: "Beat the bear",        Icon: Hash,           color: "from-sky-400 to-blue-500",        ring: "ring-sky-300" },
  { id: "memory",     name: "Memory Match", desc: "Find the pairs",       Icon: Brain,          color: "from-violet-400 to-purple-500",   ring: "ring-violet-300" },
  { id: "catch",      name: "Catch Fruit",  desc: "Catch the fruits",     Icon: Apple,          color: "from-pink-400 to-rose-500",       ring: "ring-pink-300" },
  { id: "maze",       name: "Maze",         desc: "Find the goal",        Icon: Grid3x3,        color: "from-indigo-400 to-blue-600",     ring: "ring-indigo-300" },
  { id: "bubble",     name: "Bubble Pop",   desc: "Pop all bubbles",      Icon: Circle,         color: "from-cyan-400 to-sky-500",        ring: "ring-cyan-300" },
  { id: "colorsort",  name: "Color Sort",   desc: "Match the color",      Icon: Palette,        color: "from-fuchsia-400 to-pink-500",    ring: "ring-fuchsia-300" },
];

function GamesHub() {
  const nav = useNavigate();
  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgClouds})` }} />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-sky-200/40 to-pink-200/40" />

      <header className="mx-auto flex max-w-md items-center justify-between px-4 pt-5">
        <button onClick={() => nav({ to: "/" })} className="rounded-full bg-white/80 p-2 shadow">
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex items-center gap-2">
          <img src={bearFace} alt="" className="size-12 drop-shadow bear-bounce" />
          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-rose-500">G</span>
            <span className="text-amber-500">a</span>
            <span className="text-emerald-500">m</span>
            <span className="text-sky-500">e</span>
            <span className="text-violet-500">s</span>
          </h1>
        </div>
        <button onClick={() => nav({ to: "/" })} className="rounded-full bg-white/80 p-2 shadow">
          <Home className="size-5" />
        </button>
      </header>

      <main className="mx-auto max-w-md px-4 pb-10 pt-4">
        <div className="grid grid-cols-2 gap-4">
          {GAMES.map((g) => (
            <button
              key={g.id}
              onClick={() => nav({ to: "/games/$gameId" as any, params: { gameId: g.id } as any })}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${g.color} p-4 text-left text-white shadow-xl ring-4 ${g.ring} transition active:scale-95`}
              style={{ transform: "perspective(600px) rotateX(4deg)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              <div className="relative flex flex-col gap-2">
                <div className="self-end rounded-full bg-white/25 p-2 backdrop-blur">
                  <g.Icon className="size-7" />
                </div>
                <div className="font-extrabold text-xl drop-shadow">{g.name}</div>
                <div className="text-xs opacity-90">{g.desc}</div>
                <div className="mt-1 flex items-center gap-1 self-start rounded-full bg-white text-slate-800 px-3 py-1 text-xs font-bold shadow">
                  <Play className="size-3 fill-current" /> Play
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
