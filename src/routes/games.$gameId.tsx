import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Home, Play, RotateCcw, Trophy, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import bearFace from "@/assets/icons/bear-face.png";

export const Route = createFileRoute("/games/$gameId")({
  head: () => ({ meta: [{ title: "Play — Melly Kids" }] }),
  component: GameRunner,
});

type Diff = "easy" | "medium" | "hard";

const TITLES: Record<string, string> = {
  shooting: "Balloon Shoot",
  running: "Bear Run",
  jumping: "Lily Hop",
  snake: "Hungry Snake",
  tictactoe: "Tic-Tac-Toe",
  memory: "Memory Match",
  catch: "Catch the Fruit",
  maze: "Magic Maze",
  bubble: "Bubble Pop",
  colorsort: "Color Sort",
};

/* ---------------- SOUND ---------------- */
let _ac: AudioContext | null = null;
let _muted = false;
function getAC() {
  if (typeof window === "undefined") return null;
  if (!_ac) { try { _ac = new (window.AudioContext || (window as any).webkitAudioContext)(); } catch { return null; } }
  return _ac;
}
function beep(freq = 440, dur = 0.12, type: OscillatorType = "sine", vol = 0.2) {
  if (_muted) return;
  const ac = getAC(); if (!ac) return;
  const o = ac.createOscillator(); const g = ac.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + dur);
}
const SFX = {
  pop:   () => { beep(880, 0.08, "triangle", 0.25); setTimeout(() => beep(1320, 0.08, "triangle", 0.18), 60); },
  jump:  () => beep(520, 0.18, "sine", 0.22),
  eat:   () => { beep(660, 0.07, "square", 0.18); setTimeout(() => beep(990, 0.1, "square", 0.18), 60); },
  fail:  () => { beep(180, 0.25, "sawtooth", 0.22); },
  win:   () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.18, "triangle", 0.22), i * 120)); },
  click: () => beep(380, 0.05, "square", 0.15),
};

/* ---------------- BACKDROP ---------------- */
function SkyBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-pink-200" />
      <div className="absolute right-10 top-10 size-28 rounded-full bg-yellow-300 shadow-[0_0_80px_30px_rgba(253,224,71,0.6)] animate-[sunPulse_4s_ease-in-out_infinite]" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="absolute h-12 w-24 rounded-full bg-white/80 blur-[2px]"
          style={{ top: `${10 + i * 12}%`, left: `-30%`, animation: `cloudDrift ${20 + i * 4}s linear infinite`, animationDelay: `${-i * 5}s` }} />
      ))}
      <style>{`
        @keyframes cloudDrift { from{transform:translateX(0)} to{transform:translateX(160vw)} }
        @keyframes sunPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
      `}</style>
    </div>
  );
}

function GameRunner() {
  const { gameId } = useParams({ from: "/games/$gameId" as any }) as { gameId: string };
  const nav = useNavigate();
  const [diff, setDiff] = useState<Diff | null>(null);
  const [playing, setPlaying] = useState(false);
  const [round, setRound] = useState(0);
  const [muted, setMuted] = useState(false);
  useEffect(() => { _muted = muted; }, [muted]);

  const title = TITLES[gameId] ?? "Game";

  return (
    <div className="relative min-h-screen">
      <SkyBackdrop />

      <header className="mx-auto flex max-w-md items-center justify-between px-4 pt-5">
        <button onClick={() => { SFX.click(); playing ? setPlaying(false) : nav({ to: "/games" }); }}
          className="rounded-full bg-white/90 p-2 shadow-lg active:scale-90">
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-2xl font-black text-slate-800 drop-shadow-sm">{title}</h1>
        <div className="flex gap-2">
          <button onClick={() => setMuted((m) => !m)} className="rounded-full bg-white/90 p-2 shadow-lg active:scale-90">
            {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
          <button onClick={() => nav({ to: "/" })} className="rounded-full bg-white/90 p-2 shadow-lg active:scale-90">
            <Home className="size-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pb-8 pt-4">
        {!playing ? (
          <StartCard onStart={(d) => { SFX.click(); setDiff(d); setPlaying(true); setRound((r) => r + 1); }} gameId={gameId} />
        ) : (
          <GameSwitch
            key={`${gameId}-${diff}-${round}`}
            gameId={gameId}
            diff={diff!}
            onExit={() => setPlaying(false)}
            onReplay={() => setRound((r) => r + 1)}
          />
        )}
      </main>
    </div>
  );
}

function StartCard({ onStart, gameId }: { onStart: (d: Diff) => void; gameId: string }) {
  const [d, setD] = useState<Diff>("easy");
  return (
    <div className="mt-6 rounded-3xl bg-white/95 p-6 shadow-2xl ring-4 ring-white"
      style={{ transform: "perspective(800px) rotateX(2deg)" }}>
      <div className="flex items-center gap-3">
        <img src={bearFace} alt="" className="size-20 drop-shadow-xl animate-[bearBounce_1.5s_ease-in-out_infinite]" />
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-500">Get Ready!</div>
          <div className="text-xl font-extrabold">Pick difficulty</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {(["easy", "medium", "hard"] as Diff[]).map((x) => (
          <button key={x} onClick={() => { setD(x); SFX.click(); }}
            className={`rounded-2xl p-3 text-sm font-bold capitalize shadow transition ${
              d === x ? "bg-gradient-to-br from-emerald-400 to-green-600 text-white scale-105 ring-2 ring-emerald-200" : "bg-slate-100 text-slate-700"
            }`}>{x}</button>
        ))}
      </div>

      <button onClick={() => onStart(d)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 px-5 py-4 text-lg font-black text-white shadow-xl ring-4 ring-pink-200 active:scale-95">
        <Play className="size-6 fill-current" /> PLAY
      </button>
      <p className="mt-3 text-center text-xs text-slate-500">Game: {gameId}</p>
      <style>{`@keyframes bearBounce { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-8px) rotate(3deg)} }`}</style>
    </div>
  );
}

function GameSwitch(props: { gameId: string; diff: Diff; onExit: () => void; onReplay: () => void }) {
  switch (props.gameId) {
    case "shooting":  return <ShootingGame {...props} />;
    case "running":   return <RunningGame {...props} />;
    case "jumping":   return <JumpingGame {...props} />;
    case "snake":     return <SnakeGame {...props} />;
    case "tictactoe": return <TicTacGame {...props} />;
    case "memory":    return <MemoryGame {...props} />;
    case "catch":     return <CatchGame {...props} />;
    case "maze":      return <MazeGame {...props} />;
    case "bubble":    return <BubbleGame {...props} />;
    case "colorsort": return <ColorSortGame {...props} />;
    case "fruitcut":  return <FruitCutGame {...props} />;
    case "bomber":    return <BomberGame {...props} />;
    case "mario":     return <MarioGame {...props} />;
    case "fly":       return <FlyGame {...props} />;
    case "rocket":    return <RocketGame {...props} />;
    case "racecar":   return <RaceCarGame {...props} />;
    case "helicopter":return <HelicopterGame {...props} />;
    case "ninja":     return <NinjaGame {...props} />;
    case "dino":      return <DinoGame {...props} />;
    case "frogger":   return <FroggerGame {...props} />;
    default: return <div className="mt-6 rounded-2xl bg-white p-6 text-center">Coming soon!</div>;
  }
}

function HUD({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl bg-white/95 px-3 py-2 shadow-lg text-center min-w-[70px] ring-2 ring-white/50">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-lg font-black text-slate-800">{value}</div>
    </div>
  );
}
function EndCard({ title, score, onReplay, onExit }: { title: string; score?: any; onReplay: () => void; onExit: () => void }) {
  useEffect(() => { SFX.win(); }, []);
  return (
    <div className="mt-6 rounded-3xl bg-white/95 p-6 text-center shadow-2xl ring-4 ring-yellow-200 animate-[scaleIn_0.4s_ease-out]"
      style={{ transform: "perspective(800px) rotateX(2deg)" }}>
      <img src={bearFace} alt="" className="mx-auto size-20 drop-shadow-xl animate-[bearBounce_1s_ease-in-out_infinite]" />
      <Trophy className="mx-auto -mt-4 size-12 text-yellow-500 drop-shadow" />
      <div className="mt-2 text-2xl font-black">{title}</div>
      {score !== undefined && <div className="mt-1 text-slate-600">Score: <span className="font-bold">{score}</span></div>}
      <div className="mt-5 flex gap-3">
        <button onClick={() => { SFX.click(); onReplay(); }} className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 font-bold text-white shadow active:scale-95 flex items-center justify-center gap-2">
          <RotateCcw className="size-5" /> Again
        </button>
        <button onClick={() => { SFX.click(); onExit(); }} className="flex-1 rounded-2xl bg-slate-700 px-4 py-3 font-bold text-white shadow active:scale-95">Menu</button>
      </div>
      <style>{`
        @keyframes scaleIn { from{transform:scale(0.85);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes bearBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      `}</style>
    </div>
  );
}

/* ============= 1. SHOOTING ============= */
function ShootingGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [targets, setTargets] = useState<{ id: number; x: number; y: number; c: string; vy: number }[]>([]);
  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([]);
  const spawnRate = diff === "easy" ? 1100 : diff === "medium" ? 750 : 450;
  const colors = ["#ff5e7e", "#ffb84a", "#5ec98a", "#5ec8ef", "#b48bff", "#ff9bd2"];
  const over = time <= 0;

  useEffect(() => { if (over) return; const t = setInterval(() => setTime((s) => s - 1), 1000); return () => clearInterval(t); }, [over]);
  useEffect(() => {
    if (over) return;
    const s = setInterval(() => {
      setTargets((ts) => [...ts.slice(-10), {
        id: Date.now() + Math.random(), x: 8 + Math.random() * 78, y: 100,
        vy: 0.9 + Math.random() * 0.8,
        c: colors[Math.floor(Math.random() * colors.length)],
      }]);
    }, spawnRate);
    return () => clearInterval(s);
  }, [over, spawnRate]);
  useEffect(() => {
    if (over) return;
    const f = setInterval(() => setTargets((ts) => ts.map((t) => ({ ...t, y: t.y - t.vy, x: t.x + Math.sin(t.y / 12) * 0.3 })).filter((t) => t.y > -10)), 50);
    return () => clearInterval(f);
  }, [over]);

  const pop = (t: any) => {
    SFX.pop(); setScore((s) => s + 10);
    setTargets((ts) => ts.filter((x) => x.id !== t.id));
    setPops((p) => [...p, { id: Date.now(), x: t.x, y: t.y }]);
    setTimeout(() => setPops((p) => p.slice(1)), 500);
  };

  if (over) return <EndCard title="Time's Up!" score={score} onReplay={onReplay} onExit={onExit} />;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Time" value={time} /></div>
      <div className="relative mt-3 h-[460px] overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white"
        style={{ background: "linear-gradient(to bottom, #7dd3fc 0%, #38bdf8 60%, #84cc16 100%)" }}>
        {/* sun */}
        <div className="absolute right-6 top-6 size-16 rounded-full bg-yellow-300 shadow-[0_0_50px_20px_rgba(253,224,71,0.6)]" />
        {/* clouds */}
        {[0, 1, 2].map((i) => (
          <div key={i} className="absolute h-8 w-16 rounded-full bg-white/90 blur-[1px]"
            style={{ top: `${15 + i * 20}%`, left: "-25%", animation: `cd ${14 + i * 3}s linear infinite`, animationDelay: `${-i * 4}s` }} />
        ))}
        {/* bear sniper */}
        <img src={bearFace} alt="" className="absolute bottom-2 left-1/2 size-16 -translate-x-1/2 drop-shadow-xl" />
        {/* grass */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-green-500 to-green-700" />

        {targets.map((t) => (
          <button key={t.id} onClick={() => pop(t)}
            className="absolute -translate-x-1/2 -translate-y-1/2 active:scale-90"
            style={{ left: `${t.x}%`, top: `${t.y}%` }}>
            <div className="relative size-14 rounded-full"
              style={{
                background: `radial-gradient(circle at 30% 28%, #ffffffee 0%, ${t.c}cc 45%, ${t.c} 100%)`,
                boxShadow: `0 10px 24px ${t.c}90, inset -6px -10px 14px #00000033, inset 4px 4px 8px #ffffff55`,
              }}>
              <span className="absolute left-1/2 top-1/4 size-3 -translate-x-1/2 rounded-full bg-white/80 blur-[1px]" />
            </div>
            <span className="absolute left-1/2 top-full block h-8 w-px bg-slate-700/60" />
          </button>
        ))}
        {pops.map((p) => (
          <div key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none text-3xl"
            style={{ left: `${p.x}%`, top: `${p.y}%`, animation: "popOut 0.5s ease-out forwards" }}>💥</div>
        ))}
        <style>{`
          @keyframes cd { from{transform:translateX(0)} to{transform:translateX(160%)} }
          @keyframes popOut { 0%{transform:translate(-50%,-50%) scale(0.5);opacity:1} 100%{transform:translate(-50%,-50%) scale(2);opacity:0} }
        `}</style>
      </div>
      <p className="mt-2 text-center text-xs text-slate-600">🎯 Tap balloons to pop!</p>
    </div>
  );
}

/* ============= 2. RUNNING ============= */
function RunningGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const speed = diff === "easy" ? 4 : diff === "medium" ? 6 : 9;
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [jump, setJump] = useState(false);
  const [obs, setObs] = useState<{ id: number; x: number; type: "rock" | "log" }[]>([]);
  const jumpingRef = useRef(false);

  const doJump = () => {
    if (jumpingRef.current || over) return;
    jumpingRef.current = true; SFX.jump(); setJump(true);
    setTimeout(() => setJump(false), 600);
    setTimeout(() => { jumpingRef.current = false; }, 650);
  };

  useEffect(() => {
    if (over) return;
    const i = setInterval(() => {
      setObs((o) => {
        const next = o.map((x) => ({ ...x, x: x.x - speed })).filter((x) => x.x > -15);
        if ((next.length === 0 || next[next.length - 1].x < 60) && Math.random() > 0.75)
          next.push({ id: Date.now() + Math.random(), x: 110, type: Math.random() > 0.5 ? "rock" : "log" });
        return next;
      });
      setScore((s) => s + 1);
    }, 60);
    return () => clearInterval(i);
  }, [speed, over]);

  useEffect(() => {
    if (over) return;
    const i = setInterval(() => {
      obs.forEach((o) => { if (o.x > 6 && o.x < 20 && !jump) { setOver(true); SFX.fail(); } });
    }, 50);
    return () => clearInterval(i);
  }, [obs, jump, over]);

  if (over) return <EndCard title="Oof!" score={score} onReplay={onReplay} onExit={onExit} />;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Speed" value={diff} /></div>
      <div onClick={doJump}
        className="relative mt-3 h-[420px] overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white select-none cursor-pointer"
        style={{ background: "linear-gradient(to bottom, #93c5fd 0%, #fde68a 70%, #86efac 100%)" }}>
        {/* sun */}
        <div className="absolute right-8 top-6 size-14 rounded-full bg-yellow-300 shadow-[0_0_40px_15px_rgba(253,224,71,0.6)]" />
        {/* far hills (parallax) */}
        <div className="absolute bottom-24 left-0 right-0 h-24">
          <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path d="M0 80 Q 50 40 100 60 T 200 50 T 300 60 T 400 50 V100 H0 Z" fill="#34d399" opacity="0.5" />
            <path d="M0 90 Q 60 50 120 70 T 240 60 T 360 70 T 480 60 V100 H0 Z" fill="#10b981" opacity="0.7" />
          </svg>
        </div>
        {/* trees scrolling */}
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="absolute bottom-24 text-3xl" style={{ left: `${(i * 30) % 120}%`, animation: `treeMove ${6 / (speed / 4)}s linear infinite`, animationDelay: `${-i * 1.5}s` }}>🌲</div>
        ))}
        {/* ground */}
        <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: "linear-gradient(to bottom, #65a30d, #3f6212)" }}>
          <div className="absolute inset-x-0 top-0 h-2 bg-emerald-400" />
        </div>
        {/* bear */}
        <div className="absolute left-[8%] bottom-24 transition-transform duration-500 ease-out"
          style={{ transform: `translateY(${jump ? -140 : 0}px) rotate(${jump ? -10 : 0}deg)` }}>
          <div style={{ animation: jump ? "none" : "bobbie 0.3s ease-in-out infinite" }}>
            <img src={bearFace} alt="" className="size-20 drop-shadow-2xl" />
          </div>
          {/* shadow */}
          <div className="mx-auto h-2 w-16 rounded-full bg-black/30 blur-sm" style={{ transform: `scale(${jump ? 0.6 : 1})`, opacity: jump ? 0.3 : 0.5 }} />
        </div>
        {obs.map((o) => (
          <div key={o.id} className="absolute bottom-24 text-4xl drop-shadow-lg" style={{ left: `${o.x}%` }}>
            {o.type === "rock" ? "🪨" : "🪵"}
          </div>
        ))}
        <div className="absolute inset-x-0 top-3 text-center text-xs font-bold text-slate-800/80 bg-white/40 mx-auto w-fit px-3 py-1 rounded-full backdrop-blur">TAP to JUMP</div>
        <style>{`
          @keyframes treeMove { from{transform:translateX(0)} to{transform:translateX(-150%)} }
          @keyframes bobbie { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        `}</style>
      </div>
    </div>
  );
}

/* ============= 3. JUMPING (lily pads) ============= */
function JumpingGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const size = 4;
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(diff === "easy" ? 40 : diff === "medium" ? 30 : 20);
  const [target, setTarget] = useState(1);
  const [jumping, setJumping] = useState(false);
  const over = time <= 0;

  useEffect(() => { if (!over) { const t = setInterval(() => setTime((s) => s - 1), 1000); return () => clearInterval(t); } }, [over]);

  const hop = (i: number) => {
    if (jumping) return;
    setJumping(true); SFX.jump();
    setTimeout(() => {
      setPos(i);
      if (i === target) { setScore((s) => s + 5); SFX.eat(); setTarget(Math.floor(Math.random() * size)); }
      else { setScore((s) => Math.max(0, s - 1)); SFX.fail(); }
      setJumping(false);
    }, 300);
  };

  if (over) return <EndCard title="Time's Up!" score={score} onReplay={onReplay} onExit={onExit} />;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Time" value={time} /></div>
      <div className="relative mt-3 h-[420px] overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white"
        style={{ background: "linear-gradient(to bottom, #67e8f9 0%, #06b6d4 60%, #0e7490 100%)" }}>
        {/* water ripples */}
        {[0,1,2,3].map(i => (
          <div key={i} className="absolute inset-x-0 h-1 bg-white/20 rounded-full" style={{ bottom: `${20 + i * 8}%`, animation: `ripple ${3 + i}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }} />
        ))}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-around p-4">
          {Array.from({ length: size }).map((_, i) => (
            <button key={i} onClick={() => hop(i)}
              className="relative h-20 w-20 active:scale-95"
              style={{ transform: `perspective(500px) rotateX(55deg) translateY(${i === target ? -6 : 0}px)` }}>
              <div className={`absolute inset-0 rounded-full shadow-2xl ${i === target ? "ring-4 ring-yellow-300 animate-pulse" : ""}`}
                style={{
                  background: i === target
                    ? "radial-gradient(circle at 35% 30%, #fef08a, #84cc16 60%, #4d7c0f)"
                    : "radial-gradient(circle at 35% 30%, #bef264, #65a30d 60%, #365314)",
                }} />
              <div className="absolute inset-x-3 top-2 h-2 rounded-full bg-white/40 blur-[1px]" />
            </button>
          ))}
        </div>
        {/* bear hopping */}
        <div className="absolute bottom-28 transition-all duration-300" style={{ left: `${10 + pos * 22}%`, transform: `translateY(${jumping ? -80 : 0}px)` }}>
          <img src={bearFace} alt="" className="size-16 drop-shadow-2xl" />
          <div className="mx-auto h-2 w-12 rounded-full bg-black/30 blur-sm" style={{ opacity: jumping ? 0.3 : 0.6 }} />
        </div>
        <div className="absolute inset-x-0 top-3 text-center text-xs font-bold text-white drop-shadow">Tap the GLOWING lily pad!</div>
        <style>{`@keyframes ripple { 0%,100%{transform:scaleX(1);opacity:0.2} 50%{transform:scaleX(1.1);opacity:0.4} }`}</style>
      </div>
    </div>
  );
}

/* ============= 4. SNAKE (visible mascot snake!) ============= */
function SnakeGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const N = 15;
  const speed = diff === "easy" ? 220 : diff === "medium" ? 140 : 90;
  type P = { x: number; y: number };
  const [snake, setSnake] = useState<P[]>([{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 7 }]);
  const [dir, setDir] = useState<P>({ x: 1, y: 0 });
  const dirRef = useRef(dir); dirRef.current = dir;
  const [food, setFood] = useState<P>({ x: 10, y: 7 });
  const [over, setOver] = useState(false);
  const score = snake.length - 4;

  useEffect(() => {
    if (over) return;
    const id = setInterval(() => {
      setSnake((s) => {
        const head = { x: (s[0].x + dirRef.current.x + N) % N, y: (s[0].y + dirRef.current.y + N) % N };
        if (s.some((p) => p.x === head.x && p.y === head.y)) { setOver(true); SFX.fail(); return s; }
        const next = [head, ...s];
        if (head.x === food.x && head.y === food.y) {
          SFX.eat();
          let nf: P;
          do { nf = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; }
          while (next.some((p) => p.x === nf.x && p.y === nf.y));
          setFood(nf);
        } else next.pop();
        return next;
      });
    }, speed);
    return () => clearInterval(id);
  }, [food, over, speed]);

  // keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === "ArrowUp") turn(0, -1);
      else if (k === "ArrowDown") turn(0, 1);
      else if (k === "ArrowLeft") turn(-1, 0);
      else if (k === "ArrowRight") turn(1, 0);
    };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);

  const turn = (nx: number, ny: number) => {
    const c = dirRef.current;
    if (c.x === -nx && c.y === -ny) return;
    setDir({ x: nx, y: ny });
  };

  if (over) return <EndCard title="Game Over" score={score} onReplay={onReplay} onExit={onExit} />;

  const cellPct = 100 / N;
  const head = snake[0];
  // determine head rotation
  const angle = dir.x === 1 ? 0 : dir.x === -1 ? 180 : dir.y === 1 ? 90 : -90;

  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Length" value={snake.length} /><HUD label="Food" value={score} /></div>
      <div className="relative mt-3 aspect-square overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white"
        style={{ background: "linear-gradient(135deg, #bbf7d0, #4ade80 50%, #16a34a)" }}>
        {/* grid pattern */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "linear-gradient(#0006 1px, transparent 1px), linear-gradient(90deg, #0006 1px, transparent 1px)", backgroundSize: `${cellPct}% ${cellPct}%` }} />
        {/* food = bug */}
        <div className="absolute flex items-center justify-center text-2xl drop-shadow-lg animate-bounce"
          style={{ left: `${food.x * cellPct}%`, top: `${food.y * cellPct}%`, width: `${cellPct}%`, height: `${cellPct}%` }}>🐞</div>
        {/* snake body */}
        {snake.slice(1).map((p, i) => {
          const t = i / snake.length;
          const sz = 88 - i * 1.2;
          return (
            <div key={i} className="absolute flex items-center justify-center"
              style={{ left: `${p.x * cellPct}%`, top: `${p.y * cellPct}%`, width: `${cellPct}%`, height: `${cellPct}%` }}>
              <div className="rounded-full"
                style={{
                  width: `${sz}%`, height: `${sz}%`,
                  background: `radial-gradient(circle at 30% 30%, #a7f3d0, #059669 60%, #064e3b)`,
                  boxShadow: `inset -3px -4px 6px #00000044, 0 2px 4px #0003`,
                  opacity: Math.max(0.5, 1 - t * 0.4),
                }} />
            </div>
          );
        })}
        {/* realistic snake head */}
        <div className="absolute flex items-center justify-center transition-all"
          style={{ left: `${head.x * cellPct}%`, top: `${head.y * cellPct}%`, width: `${cellPct}%`, height: `${cellPct}%` }}>
          <div className="relative" style={{ width: "100%", height: "100%", transform: `rotate(${angle}deg)` }}>
            {/* head shape (diamond / oval) */}
            <div className="absolute inset-[2%]"
              style={{
                background: "radial-gradient(ellipse at 30% 30%, #bbf7d0, #16a34a 55%, #052e16)",
                boxShadow: "inset -5px -7px 12px #00000066, 0 4px 8px #0005",
                borderRadius: "55% 70% 55% 70% / 55% 55% 70% 70%",
              }}>
              {/* scale pattern */}
              <div className="absolute inset-0 opacity-30"
                style={{ background: "repeating-radial-gradient(circle at 50% 50%, transparent 0 3px, #0003 3px 4px)", borderRadius: "inherit" }} />
              {/* nostrils */}
              <div className="absolute right-[8%] top-[38%] size-1 rounded-full bg-black/70" />
              <div className="absolute right-[8%] bottom-[38%] size-1 rounded-full bg-black/70" />
              {/* eyes — yellow with slit pupils */}
              <div className="absolute right-[22%] top-[15%] h-2.5 w-3 rounded-full bg-yellow-300 shadow-inner">
                <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-full bg-black" />
              </div>
              <div className="absolute right-[22%] bottom-[15%] h-2.5 w-3 rounded-full bg-yellow-300 shadow-inner">
                <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-full bg-black" />
              </div>
              {/* forked tongue */}
              <div className="absolute right-[-35%] top-1/2 -translate-y-1/2" style={{ animation: "tongue 0.4s ease-in-out infinite" }}>
                <div className="h-[3px] w-4 bg-rose-500 rounded-full" />
                <div className="absolute right-0 -top-1 h-[3px] w-2 bg-rose-500 rounded-full rotate-[20deg] origin-left" />
                <div className="absolute right-0 top-1 h-[3px] w-2 bg-rose-500 rounded-full -rotate-[20deg] origin-left" />
              </div>
            </div>
          </div>
        </div>
        <style>{`@keyframes tongue { 0%,100%{transform:translateY(-50%) scaleX(0.8)} 50%{transform:translateY(-50%) scaleX(1.3)} }`}</style>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-white max-w-[220px] mx-auto">
        <div></div>
        <button onClick={() => turn(0, -1)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow-lg active:scale-90">▲</button>
        <div></div>
        <button onClick={() => turn(-1, 0)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow-lg active:scale-90">◀</button>
        <button onClick={() => turn(0, 1)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow-lg active:scale-90">▼</button>
        <button onClick={() => turn(1, 0)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow-lg active:scale-90">▶</button>
      </div>
    </div>
  );
}

/* ============= 5. TIC-TAC-TOE ============= */
function TicTacGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const [b, setB] = useState<(null | "X" | "O")[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const win = checkWin(b);
  const full = b.every(Boolean);
  const over = win || full;

  function checkWin(bd: any[]): null | "X" | "O" {
    const L = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a,b2,c] of L) if (bd[a] && bd[a] === bd[b2] && bd[a] === bd[c]) return bd[a];
    return null;
  }
  function aiMove(bd: any[]): number {
    const empty = bd.map((v, i) => v ? -1 : i).filter((i) => i >= 0);
    if (diff !== "hard") {
      if (diff === "medium" && Math.random() > 0.4) {
        for (const i of empty) { const t = [...bd]; t[i] = "O"; if (checkWin(t) === "O") return i; }
        for (const i of empty) { const t = [...bd]; t[i] = "X"; if (checkWin(t) === "X") return i; }
      }
      return empty[Math.floor(Math.random() * empty.length)];
    }
    const mm = (bd2: any[], p: "X" | "O"): { i: number; s: number } => {
      const w = checkWin(bd2);
      if (w === "O") return { i: -1, s: 1 };
      if (w === "X") return { i: -1, s: -1 };
      const emp = bd2.map((v, i) => v ? -1 : i).filter((i) => i >= 0);
      if (emp.length === 0) return { i: -1, s: 0 };
      let best = { i: emp[0], s: p === "O" ? -2 : 2 };
      for (const i of emp) {
        const t = [...bd2]; t[i] = p;
        const r = mm(t, p === "O" ? "X" : "O");
        if (p === "O" ? r.s > best.s : r.s < best.s) best = { i, s: r.s };
      }
      return best;
    };
    return mm(bd, "O").i;
  }

  const play = (i: number) => {
    if (b[i] || over || turn !== "X") return;
    SFX.click();
    const nb = [...b]; nb[i] = "X"; setB(nb); setTurn("O");
  };
  useEffect(() => {
    if (turn === "O" && !checkWin(b) && b.some((v) => !v)) {
      const t = setTimeout(() => {
        const i = aiMove(b);
        if (i >= 0) { const nb = [...b]; nb[i] = "O"; SFX.click(); setB(nb); setTurn("X"); }
      }, 600);
      return () => clearTimeout(t);
    }
  }, [turn, b]);

  if (over) return <EndCard title={win === "X" ? "You Win! 🎉" : win === "O" ? "Bear Wins!" : "Draw!"} onReplay={onReplay} onExit={onExit} />;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="You" value="❌" /><HUD label="Bear" value="🐻" /><HUD label="Turn" value={turn === "X" ? "You" : "Bear"} /></div>
      <div className="mt-3 mx-auto grid aspect-square w-full max-w-sm grid-cols-3 gap-3 rounded-3xl p-4 shadow-2xl ring-4 ring-white"
        style={{ background: "linear-gradient(135deg, #fbbf24, #f97316 50%, #dc2626)", transform: "perspective(800px) rotateX(8deg)" }}>
        {b.map((v, i) => (
          <button key={i} onClick={() => play(i)}
            className="flex items-center justify-center rounded-2xl bg-white text-5xl font-black shadow-inner active:scale-95 transition-transform"
            style={{ boxShadow: "inset 0 6px 10px #0002, 0 4px 8px #0003" }}>
            {v === "X" && <span className="text-rose-500 animate-[scaleIn_0.3s_ease-out]">❌</span>}
            {v === "O" && <img src={bearFace} alt="" className="size-12 animate-[scaleIn_0.3s_ease-out]" />}
          </button>
        ))}
      </div>
      <style>{`@keyframes scaleIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }`}</style>
    </div>
  );
}

/* ============= 6. MEMORY ============= */
function MemoryGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const pairs = diff === "easy" ? 6 : diff === "medium" ? 8 : 10;
  const emojis = ["🐻","🦊","🐰","🐼","🦁","🐯","🐮","🐸","🦄","🐵","🐨","🐷"];
  const deck = useMemo(() => {
    const pick = emojis.slice(0, pairs);
    const d = [...pick, ...pick].map((e, i) => ({ id: i, e, flipped: false, matched: false }));
    for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
    return d;
  }, [pairs]);
  const [cards, setCards] = useState(deck);
  const [pick, setPick] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const done = cards.every((c) => c.matched);

  const flip = (i: number) => {
    if (pick.length === 2 || cards[i].flipped || cards[i].matched) return;
    SFX.click();
    const nc = cards.map((c, k) => k === i ? { ...c, flipped: true } : c);
    const np = [...pick, i];
    setCards(nc); setPick(np);
    if (np.length === 2) {
      setMoves((m) => m + 1);
      setTimeout(() => {
        setCards((cc) => {
          const [a, b] = np;
          if (cc[a].e === cc[b].e) { SFX.eat(); return cc.map((c, k) => (k === a || k === b ? { ...c, matched: true } : c)); }
          SFX.fail();
          return cc.map((c, k) => (k === a || k === b ? { ...c, flipped: false } : c));
        });
        setPick([]);
      }, 800);
    }
  };

  if (done) return <EndCard title="All Matched!" score={moves + " moves"} onReplay={onReplay} onExit={onExit} />;
  const cols = pairs <= 6 ? 3 : 4;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Moves" value={moves} /><HUD label="Pairs" value={pairs} /></div>
      <div className="mt-3 grid gap-2 rounded-3xl p-3 shadow-2xl ring-4 ring-white"
        style={{ background: "linear-gradient(135deg, #c084fc, #7c3aed 60%, #4c1d95)", gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cards.map((c, i) => {
          const showFront = c.flipped || c.matched;
          return (
            <button key={c.id} onClick={() => flip(i)} className="aspect-square" style={{ perspective: "600px" }}>
              <div className="relative h-full w-full transition-transform duration-500" style={{ transformStyle: "preserve-3d", transform: showFront ? "rotateY(180deg)" : "rotateY(0deg)" }}>
                {/* back */}
                <div className="absolute inset-0 rounded-2xl shadow-lg flex items-center justify-center text-white text-2xl font-black"
                  style={{ backfaceVisibility: "hidden", background: "linear-gradient(135deg, #ec4899, #be185d)", boxShadow: "inset -4px -6px 10px #00000055, 0 4px 10px #0004" }}>?</div>
                {/* front */}
                <div className="absolute inset-0 rounded-2xl bg-white shadow-lg flex items-center justify-center text-4xl"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", boxShadow: c.matched ? "0 0 20px #fde047" : "0 4px 10px #0003" }}>
                  {c.e}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============= 7. CATCH FRUIT ============= */
function CatchGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const speed = diff === "easy" ? 2 : diff === "medium" ? 3.2 : 4.6;
  const spawn = diff === "easy" ? 1100 : diff === "medium" ? 800 : 550;
  const [x, setX] = useState(50);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const fruits = ["🍎","🍌","🍊","🍇","🍓","🍑","🍉","🥝","🍍"];
  const [items, setItems] = useState<{ id: number; x: number; y: number; e: string }[]>([]);
  const over = lives <= 0;

  useEffect(() => {
    if (over) return;
    const s = setInterval(() => setItems((it) => [...it, { id: Date.now() + Math.random(), x: 10 + Math.random() * 80, y: 0, e: fruits[Math.floor(Math.random() * fruits.length)] }]), spawn);
    return () => clearInterval(s);
  }, [over, spawn]);
  useEffect(() => {
    if (over) return;
    const f = setInterval(() => {
      setItems((it) => {
        const out: typeof it = [];
        for (const i of it) {
          const ny = i.y + speed;
          if (ny >= 86) {
            if (Math.abs(i.x - x) < 14) { setScore((s) => s + 1); SFX.eat(); }
            else { setLives((l) => l - 1); SFX.fail(); }
          } else out.push({ ...i, y: ny });
        }
        return out;
      });
    }, 50);
    return () => clearInterval(f);
  }, [x, speed, over]);

  if (over) return <EndCard title="Game Over" score={score} onReplay={onReplay} onExit={onExit} />;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Lives" value={"❤️".repeat(lives) || "💀"} /></div>
      <div onPointerMove={(e) => {
          const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          setX(Math.max(8, Math.min(92, ((e.clientX - r.left) / r.width) * 100)));
        }}
        onTouchMove={(e) => {
          const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          const t = e.touches[0];
          setX(Math.max(8, Math.min(92, ((t.clientX - r.left) / r.width) * 100)));
        }}
        className="relative mt-3 h-[460px] overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white touch-none"
        style={{ background: "linear-gradient(to bottom, #fda4af, #fb7185 60%, #be123c)" }}>
        {/* sparkles */}
        {[0,1,2,3,4].map(i => (
          <div key={i} className="absolute size-1.5 rounded-full bg-white" style={{ left: `${15 + i * 18}%`, top: `${10 + (i*13)%50}%`, animation: `twinkle ${2 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />
        ))}
        {items.map((i) => (
          <div key={i.id} className="absolute text-4xl -translate-x-1/2 drop-shadow-lg" style={{ left: `${i.x}%`, top: `${i.y}%`, animation: "spin 2s linear infinite" }}>{i.e}</div>
        ))}
        {/* bear with basket */}
        <div className="absolute bottom-2 -translate-x-1/2 transition-all" style={{ left: `${x}%` }}>
          <img src={bearFace} alt="" className="size-12 mx-auto -mb-2 drop-shadow-xl" />
          <div className="text-5xl drop-shadow-xl">🧺</div>
        </div>
        <div className="absolute inset-x-0 top-3 text-center text-xs font-bold text-white bg-black/30 mx-auto w-fit px-3 py-1 rounded-full">Drag to move basket</div>
        <style>{`
          @keyframes spin { from{transform:translateX(-50%) rotate(0)} to{transform:translateX(-50%) rotate(360deg)} }
          @keyframes twinkle { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.5)} }
        `}</style>
      </div>
    </div>
  );
}

/* ============= 8. MAZE ============= */
function MazeGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const size = diff === "easy" ? 6 : diff === "medium" ? 9 : 12;
  const maze = useMemo(() => genMaze(size), [size]);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const goal = { x: size - 1, y: size - 1 };
  const [moves, setMoves] = useState(0);
  const done = pos.x === goal.x && pos.y === goal.y;

  const move = (dx: number, dy: number) => {
    if (done) return;
    const nx = pos.x + dx, ny = pos.y + dy;
    if (nx < 0 || ny < 0 || nx >= size || ny >= size) return;
    const cell = maze[pos.y][pos.x];
    if (dx === 1 && cell.r) return;
    if (dx === -1 && maze[ny][nx].r) return;
    if (dy === 1 && cell.b) return;
    if (dy === -1 && maze[ny][nx].b) return;
    SFX.click();
    setPos({ x: nx, y: ny }); setMoves((m) => m + 1);
  };

  useEffect(() => { if (done) SFX.win(); }, [done]);

  if (done) return <EndCard title="You Escaped!" score={moves + " moves"} onReplay={onReplay} onExit={onExit} />;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Size" value={`${size}×${size}`} /><HUD label="Moves" value={moves} /></div>
      <div className="mt-3 aspect-square rounded-3xl p-2 shadow-2xl ring-4 ring-white"
        style={{ background: "linear-gradient(135deg, #818cf8, #4338ca 60%, #1e1b4b)", transform: "perspective(900px) rotateX(6deg)" }}>
        <div className="relative grid h-full w-full" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
          {maze.flat().map((c, i) => {
            const x = i % size, y = Math.floor(i / size);
            const isP = pos.x === x && pos.y === y;
            const isG = goal.x === x && goal.y === y;
            return (
              <div key={i} className="relative flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                  borderRight: c.r ? "3px solid #1e1b4b" : "none",
                  borderBottom: c.b ? "3px solid #1e1b4b" : "none",
                  borderTop: y === 0 ? "3px solid #1e1b4b" : undefined,
                  borderLeft: x === 0 ? "3px solid #1e1b4b" : undefined,
                }}>
                {isG && <div className="text-xl animate-bounce">🍯</div>}
                {isP && <img src={bearFace} alt="" className="size-[80%] drop-shadow-lg" />}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-white max-w-[220px] mx-auto">
        <div></div>
        <button onClick={() => move(0, -1)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow-lg active:scale-90">▲</button>
        <div></div>
        <button onClick={() => move(-1, 0)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow-lg active:scale-90">◀</button>
        <button onClick={() => move(0, 1)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow-lg active:scale-90">▼</button>
        <button onClick={() => move(1, 0)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow-lg active:scale-90">▶</button>
      </div>
      <p className="mt-2 text-center text-xs text-slate-700">Guide Bear to the honey pot 🍯</p>
    </div>
  );
}

type Cell = { r: boolean; b: boolean; v: boolean };
function genMaze(n: number): Cell[][] {
  const g: Cell[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => ({ r: true, b: true, v: false })));
  const stack: [number, number][] = [[0, 0]]; g[0][0].v = true;
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const neigh: [number, number, string][] = [];
    if (x > 0 && !g[y][x - 1].v) neigh.push([x - 1, y, "L"]);
    if (x < n - 1 && !g[y][x + 1].v) neigh.push([x + 1, y, "R"]);
    if (y > 0 && !g[y - 1][x].v) neigh.push([x, y - 1, "U"]);
    if (y < n - 1 && !g[y + 1][x].v) neigh.push([x, y + 1, "D"]);
    if (!neigh.length) { stack.pop(); continue; }
    const [nx, ny, d] = neigh[Math.floor(Math.random() * neigh.length)];
    if (d === "R") g[y][x].r = false;
    if (d === "L") g[ny][nx].r = false;
    if (d === "D") g[y][x].b = false;
    if (d === "U") g[ny][nx].b = false;
    g[ny][nx].v = true; stack.push([nx, ny]);
  }
  return g;
}

/* ============= 9. BUBBLE POP ============= */
function BubbleGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const count = diff === "easy" ? 15 : diff === "medium" ? 25 : 40;
  const [bubbles, setBubbles] = useState(() => makeBubbles(count));
  const [time, setTime] = useState(0);
  const done = bubbles.every((b) => b.popped);

  useEffect(() => { if (done) return; const t = setInterval(() => setTime((s) => s + 1), 1000); return () => clearInterval(t); }, [done]);

  if (done) return <EndCard title="All Popped!" score={time + "s"} onReplay={onReplay} onExit={onExit} />;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Time" value={time + "s"} /><HUD label="Left" value={bubbles.filter((b) => !b.popped).length} /></div>
      <div className="relative mt-3 h-[460px] overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white"
        style={{ background: "linear-gradient(to bottom, #67e8f9 0%, #06b6d4 60%, #0c4a6e 100%)" }}>
        {/* deep water specks */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="absolute size-1 rounded-full bg-white/60" style={{ left: `${(i*37)%100}%`, top: `${(i*53)%100}%`, animation: `rise ${4 + (i%4)}s linear infinite`, animationDelay: `${-i*0.5}s` }} />
        ))}
        {bubbles.map((b, i) => !b.popped && (
          <button key={i} onClick={() => { SFX.pop(); setBubbles((bb) => bb.map((x, j) => j === i ? { ...x, popped: true } : x)); }}
            className="absolute rounded-full active:scale-50 transition-transform"
            style={{
              left: `${b.x}%`, top: `${b.y}%`, width: b.s, height: b.s,
              background: `radial-gradient(circle at 30% 28%, #ffffffee 0%, ${b.c}aa 50%, ${b.c} 100%)`,
              boxShadow: `0 8px 18px ${b.c}90, inset -6px -8px 10px #00000033, inset 4px 4px 8px #ffffff66`,
              animation: `bubbleFloat ${3 + (i % 5) * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.1}s`,
            }}>
            <span className="absolute left-1/3 top-1/4 size-2 rounded-full bg-white/80 blur-[1px]" />
          </button>
        ))}
        <style>{`
          @keyframes bubbleFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }
          @keyframes rise { from{transform:translateY(0);opacity:0.6} to{transform:translateY(-460px);opacity:0} }
        `}</style>
      </div>
    </div>
  );
}
function makeBubbles(n: number) {
  const cs = ["#ff5e7e", "#ffb84a", "#5ec98a", "#5ec8ef", "#b48bff", "#ff9bd2"];
  return Array.from({ length: n }, () => ({
    x: 5 + Math.random() * 85, y: 5 + Math.random() * 85, s: 40 + Math.random() * 30,
    c: cs[Math.floor(Math.random() * cs.length)], popped: false,
  }));
}

/* ============= 10. COLOR SORT ============= */
function ColorSortGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const opts = diff === "easy" ? 3 : diff === "medium" ? 4 : 5;
  const colors = [
    { n: "Red", c: "#ef4444" }, { n: "Blue", c: "#3b82f6" }, { n: "Green", c: "#22c55e" },
    { n: "Yellow", c: "#facc15" }, { n: "Purple", c: "#a855f7" }, { n: "Orange", c: "#f97316" },
  ];
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [round, setRound] = useState(0);
  const choices = useMemo(() => [...colors].sort(() => Math.random() - 0.5).slice(0, opts), [round, opts]);
  const target = choices[Math.floor((round * 7919) % choices.length)] ?? choices[0];
  const over = time <= 0;

  useEffect(() => { if (!over) { const t = setInterval(() => setTime((s) => s - 1), 1000); return () => clearInterval(t); } }, [over]);

  if (over) return <EndCard title="Time's Up!" score={score} onReplay={onReplay} onExit={onExit} />;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Time" value={time} /></div>
      <div className="mt-3 rounded-3xl p-6 shadow-2xl ring-4 ring-white"
        style={{ background: "linear-gradient(135deg, #f0abfc, #c026d3 60%, #701a75)" }}>
        <div className="flex items-center justify-center gap-3 text-white">
          <img src={bearFace} alt="" className="size-12 drop-shadow" />
          <div>
            <div className="text-xs uppercase tracking-widest opacity-90">Tap the color</div>
            <div className="text-4xl font-black drop-shadow" style={{ color: target.c, WebkitTextStroke: "1.5px white" }}>{target.n}</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {choices.map((c) => (
            <button key={c.n} onClick={() => { if (c.n === target.n) { setScore((s) => s + 1); SFX.eat(); } else { setScore((s) => Math.max(0, s - 1)); SFX.fail(); } setRound((r) => r + 1); }}
              className="aspect-square rounded-full active:scale-90 transition-transform"
              style={{
                background: `radial-gradient(circle at 30% 28%, #ffffffcc, ${c.c}cc 50%, ${c.c})`,
                boxShadow: `0 12px 28px ${c.c}90, inset -8px -12px 18px #00000044, inset 6px 6px 12px #ffffff66`,
              }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============= SHARED HELPERS for new games ============= */
function useTick(active: boolean, ms: number, fn: () => void) {
  useEffect(() => {
    if (!active) return;
    const id = setInterval(fn, ms);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, ms]);
}
function ArenaShell({ children, bg }: { children: any; bg: string }) {
  return (
    <div className="relative mt-3 aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white" style={{ background: bg }}>
      {children}
    </div>
  );
}
function GameOver({ score, onReplay, onExit, label = "Score" }: { score: number; onReplay: () => void; onExit: () => void; label?: string }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white">
      <Trophy className="size-14 text-yellow-300 drop-shadow" />
      <div className="mt-2 text-3xl font-black">Game Over</div>
      <div className="mt-1 text-lg">{label}: <b>{score}</b></div>
      <div className="mt-4 flex gap-3">
        <button onClick={onReplay} className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-bold shadow-lg active:scale-95"><RotateCcw className="size-4" /> Play Again</button>
        <button onClick={onExit} className="rounded-2xl bg-white/20 px-5 py-3 font-bold shadow-lg active:scale-95">Exit</button>
      </div>
    </div>
  );
}

/* ============= 11. FRUIT CUTTER ============= */
function FruitCutGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  type F = { id: number; x: number; y: number; vy: number; emoji: string; cut: boolean; bomb: boolean };
  const speed = diff === "easy" ? 1 : diff === "medium" ? 1.5 : 2.2;
  const spawn = diff === "easy" ? 900 : diff === "medium" ? 650 : 450;
  const [items, setItems] = useState<F[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [over, setOver] = useState(false);
  const idR = useRef(0);
  const fruits = ["🍎","🍌","🍇","🍓","🍊","🍉","🥝","🍑","🍍"];
  useTick(!over, 30, () => {
    setItems((arr) => arr.map(f => ({ ...f, y: f.y + f.vy * speed })).filter(f => {
      if (f.y > 110 && !f.cut && !f.bomb) { setLives(l => { const n = l - 1; if (n <= 0) { setOver(true); SFX.fail(); } return n; }); return false; }
      return f.y < 120;
    }));
  });
  useTick(!over, spawn, () => {
    const bomb = Math.random() < 0.18;
    setItems(a => [...a, { id: idR.current++, x: 10 + Math.random() * 80, y: -10, vy: 0.8 + Math.random() * 0.6, emoji: bomb ? "💣" : fruits[Math.floor(Math.random() * fruits.length)], cut: false, bomb }]);
  });
  function slice(id: number) {
    setItems(arr => arr.map(f => {
      if (f.id !== id || f.cut) return f;
      if (f.bomb) { setOver(true); SFX.fail(); return f; }
      SFX.pop(); setScore(s => s + 1);
      return { ...f, cut: true };
    }));
  }
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Lives" value={"❤️".repeat(lives)} /></div>
      <ArenaShell bg="linear-gradient(180deg,#0f172a,#1e3a8a 70%,#312e81)">
        {items.map(f => (
          <div key={f.id} onPointerEnter={() => slice(f.id)} onPointerDown={() => slice(f.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-5xl select-none cursor-pointer"
            style={{ left: `${f.x}%`, top: `${f.y}%`, transform: `translate(-50%,-50%) rotate(${f.y * 4}deg) scale(${f.cut ? 1.4 : 1})`, opacity: f.cut ? 0 : 1, transition: "opacity .25s, transform .25s", filter: "drop-shadow(0 4px 6px #0008)" }}>
            {f.emoji}
          </div>
        ))}
        {over && <GameOver score={score} onReplay={onReplay} onExit={onExit} />}
      </ArenaShell>
      <p className="mt-2 text-center text-xs text-slate-600">Swipe through fruits to slice them. Avoid bombs!</p>
    </div>
  );
}

/* ============= 12. BOMB DODGER ============= */
function BomberGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  type B = { id: number; x: number; y: number; vy: number; bomb: boolean };
  const speed = diff === "easy" ? 0.8 : diff === "medium" ? 1.2 : 1.8;
  const [px, setPx] = useState(50);
  const [items, setItems] = useState<B[]>([]);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const idR = useRef(0);
  useTick(!over, 50, () => {
    setItems(arr => {
      const next = arr.map(b => ({ ...b, y: b.y + b.vy * speed })).filter(b => b.y < 110);
      // collision at bottom
      for (const b of next) {
        if (b.y > 78 && b.y < 92 && Math.abs(b.x - px) < 9) {
          if (b.bomb) { setOver(true); SFX.fail(); }
          else { setScore(s => s + 1); SFX.eat(); b.y = 200; }
        }
      }
      return next.filter(b => b.y < 110);
    });
  });
  useTick(!over, 500, () => {
    const bomb = Math.random() < 0.45;
    setItems(a => [...a, { id: idR.current++, x: 8 + Math.random() * 84, y: -8, vy: 0.8 + Math.random() * 0.8, bomb }]);
  });
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Caught" value={score} /><HUD label="Mode" value={diff} /></div>
      <ArenaShell bg="linear-gradient(180deg,#374151,#0f172a)">
        {items.map(b => (
          <div key={b.id} className="absolute -translate-x-1/2 text-4xl" style={{ left: `${b.x}%`, top: `${b.y}%`, filter: "drop-shadow(0 3px 4px #000a)" }}>
            {b.bomb ? "💣" : "🍒"}
          </div>
        ))}
        {/* basket player */}
        <div className="absolute bottom-2 -translate-x-1/2 text-5xl" style={{ left: `${px}%`, filter: "drop-shadow(0 4px 6px #0008)" }}>🧺</div>
        {/* invisible drag layer */}
        <div className="absolute inset-0" onPointerMove={(e) => {
          const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          setPx(Math.max(6, Math.min(94, ((e.clientX - r.left) / r.width) * 100)));
        }} onPointerDown={(e) => {
          const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          setPx(Math.max(6, Math.min(94, ((e.clientX - r.left) / r.width) * 100)));
        }} />
        {over && <GameOver score={score} onReplay={onReplay} onExit={onExit} label="Caught" />}
      </ArenaShell>
      <p className="mt-2 text-center text-xs text-slate-600">Drag the basket. Catch cherries — dodge bombs!</p>
    </div>
  );
}

/* ============= 13. BEAR BROS (Mario-style) ============= */
function MarioGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const G = 0.7, JUMP = -11;
  const speed = diff === "easy" ? 3 : diff === "medium" ? 4.5 : 6;
  const [y, setY] = useState(0); const yR = useRef(0); const vR = useRef(0); const onG = useRef(true);
  type Ob = { id: number; x: number; type: "goomba" | "pipe" | "coin"; alive: boolean };
  const [obs, setObs] = useState<Ob[]>([]); const [score, setScore] = useState(0); const [over, setOver] = useState(false);
  const idR = useRef(0); const spawnR = useRef(0);
  useTick(!over, 30, () => {
    vR.current += G; yR.current += vR.current;
    if (yR.current >= 0) { yR.current = 0; vR.current = 0; onG.current = true; } else onG.current = false;
    setY(yR.current);
    setObs(arr => {
      let next = arr.map(o => ({ ...o, x: o.x - speed })).filter(o => o.x > -15);
      for (const o of next) {
        if (!o.alive) continue;
        if (o.x > 8 && o.x < 24) {
          if (o.type === "coin") { o.alive = false; SFX.eat(); setScore(s => s + 5); }
          else if (o.type === "goomba") {
            if (yR.current < -20 && vR.current > 0) { o.alive = false; vR.current = -7; SFX.pop(); setScore(s => s + 3); }
            else if (yR.current > -18) { setOver(true); SFX.fail(); }
          } else if (o.type === "pipe" && yR.current > -40) { setOver(true); SFX.fail(); }
        }
      }
      spawnR.current--;
      if (spawnR.current <= 0) {
        spawnR.current = 25 + Math.floor(Math.random() * 30);
        const r = Math.random();
        const type = r < 0.4 ? "goomba" : r < 0.7 ? "coin" : "pipe";
        next.push({ id: idR.current++, x: 110, type, alive: true });
      }
      return next;
    });
  });
  function jump() { if (onG.current && !over) { vR.current = JUMP; SFX.jump(); } }
  return (
    <div onPointerDown={jump}>
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Tap" value="Jump" /></div>
      <ArenaShell bg="linear-gradient(180deg,#7dd3fc,#bae6fd 70%,#92400e 71%,#78350f)">
        {/* clouds */}
        <div className="absolute top-4 left-6 text-4xl opacity-80">☁️</div>
        <div className="absolute top-10 right-8 text-3xl opacity-80">☁️</div>
        {/* bricks ground line */}
        <div className="absolute bottom-0 left-0 right-0 h-[29%]" style={{ background: "repeating-linear-gradient(90deg,#92400e 0 24px,#7c2d12 24px 26px), linear-gradient(180deg,#a16207,#78350f)" }} />
        {/* player */}
        <div className="absolute left-[10%] text-5xl" style={{ bottom: `calc(29% + ${-y}px)`, transition: "none", filter: "drop-shadow(0 4px 4px #0006)" }}>🐻</div>
        {/* obstacles */}
        {obs.map(o => o.alive && (
          <div key={o.id} className="absolute text-4xl" style={{ left: `${o.x}%`, bottom: o.type === "coin" ? "45%" : "29%", filter: "drop-shadow(0 3px 4px #0007)" }}>
            {o.type === "goomba" ? "👾" : o.type === "pipe" ? "🟢" : "🪙"}
          </div>
        ))}
        {over && <GameOver score={score} onReplay={onReplay} onExit={onExit} />}
      </ArenaShell>
      <p className="mt-2 text-center text-xs text-slate-600">Tap to jump. Stomp 👾, grab 🪙, avoid 🟢 pipes!</p>
    </div>
  );
}

/* ============= 14. FLAPPY BEAR ============= */
function FlyGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const G = 0.5, FLAP = -7;
  const gap = diff === "easy" ? 36 : diff === "medium" ? 28 : 22;
  const speed = diff === "easy" ? 1.5 : diff === "medium" ? 2.2 : 3;
  const [y, setY] = useState(40); const yR = useRef(40); const vR = useRef(0);
  type Pipe = { id: number; x: number; top: number; scored: boolean };
  const [pipes, setPipes] = useState<Pipe[]>([]); const [score, setScore] = useState(0); const [over, setOver] = useState(false);
  const idR = useRef(0); const spawnR = useRef(0);
  useTick(!over, 30, () => {
    vR.current += G; yR.current += vR.current; setY(yR.current);
    if (yR.current < -2 || yR.current > 96) { setOver(true); SFX.fail(); return; }
    setPipes(arr => {
      let next = arr.map(p => ({ ...p, x: p.x - speed })).filter(p => p.x > -20);
      for (const p of next) {
        if (!p.scored && p.x < 18) { p.scored = true; SFX.pop(); setScore(s => s + 1); }
        if (p.x > 10 && p.x < 26) {
          if (yR.current < p.top || yR.current > p.top + gap) { setOver(true); SFX.fail(); }
        }
      }
      spawnR.current--;
      if (spawnR.current <= 0) { spawnR.current = 60; next.push({ id: idR.current++, x: 105, top: 10 + Math.random() * (70 - gap), scored: false }); }
      return next;
    });
  });
  function flap() { if (!over) { vR.current = FLAP; SFX.jump(); } }
  return (
    <div onPointerDown={flap}>
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Tap" value="Flap" /></div>
      <ArenaShell bg="linear-gradient(180deg,#38bdf8,#7dd3fc 70%,#bef264 71%,#65a30d)">
        {pipes.map(p => (
          <div key={p.id}>
            <div className="absolute w-[14%]" style={{ left: `${p.x}%`, top: 0, height: `${p.top}%`, background: "linear-gradient(90deg,#15803d,#22c55e,#15803d)", borderBottom: "4px solid #14532d", boxShadow: "inset -6px 0 0 #14532d44" }} />
            <div className="absolute w-[14%]" style={{ left: `${p.x}%`, top: `${p.top + gap}%`, bottom: 0, background: "linear-gradient(90deg,#15803d,#22c55e,#15803d)", borderTop: "4px solid #14532d" }} />
          </div>
        ))}
        <div className="absolute text-4xl" style={{ left: "10%", top: `${y}%`, transform: `translate(-50%,-50%) rotate(${Math.max(-30, Math.min(60, vR.current * 6))}deg)`, filter: "drop-shadow(0 3px 4px #0008)" }}>🐻</div>
        {over && <GameOver score={score} onReplay={onReplay} onExit={onExit} />}
      </ArenaShell>
      <p className="mt-2 text-center text-xs text-slate-600">Tap to flap and fly through gaps!</p>
    </div>
  );
}

/* ============= 15. ROCKET SHOOTER ============= */
function RocketGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const enemySpd = diff === "easy" ? 0.7 : diff === "medium" ? 1.1 : 1.6;
  const spawn = diff === "easy" ? 900 : diff === "medium" ? 600 : 400;
  const [px, setPx] = useState(50);
  type E = { id: number; x: number; y: number };
  const [enemies, setEnemies] = useState<E[]>([]);
  const [bullets, setBullets] = useState<E[]>([]);
  const [score, setScore] = useState(0); const [lives, setLives] = useState(3); const [over, setOver] = useState(false);
  const idR = useRef(0);
  useTick(!over, 30, () => {
    setBullets(b => b.map(x => ({ ...x, y: x.y - 4 })).filter(x => x.y > -5));
    setEnemies(es => es.map(e => ({ ...e, y: e.y + enemySpd })).filter(e => {
      if (e.y > 95) { setLives(l => { const n = l - 1; if (n <= 0) { setOver(true); SFX.fail(); } return n; }); return false; }
      return true;
    }));
    // collisions
    setEnemies(es => {
      const ks = new Set<number>(); const bks = new Set<number>();
      setBullets(bs => {
        for (const b of bs) for (const e of es) {
          if (!ks.has(e.id) && !bks.has(b.id) && Math.abs(b.x - e.x) < 7 && Math.abs(b.y - e.y) < 7) {
            ks.add(e.id); bks.add(b.id); SFX.pop(); setScore(s => s + 1);
          }
        }
        return bs.filter(b => !bks.has(b.id));
      });
      return es.filter(e => !ks.has(e.id));
    });
  });
  useTick(!over, spawn, () => setEnemies(a => [...a, { id: idR.current++, x: 8 + Math.random() * 84, y: -5 }]));
  useTick(!over, 280, () => setBullets(b => [...b, { id: idR.current++, x: px, y: 82 }]));
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Lives" value={"❤️".repeat(lives)} /></div>
      <ArenaShell bg="radial-gradient(ellipse at 50% 20%, #312e81, #0b1437 70%, #000)">
        {/* stars */}
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="absolute size-[2px] rounded-full bg-white" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, opacity: 0.5 + (i % 5) * 0.1 }} />
        ))}
        {enemies.map(e => (
          <div key={e.id} className="absolute -translate-x-1/2 text-3xl" style={{ left: `${e.x}%`, top: `${e.y}%`, filter: "drop-shadow(0 0 6px #a855f7)" }}>👾</div>
        ))}
        {bullets.map(b => (
          <div key={b.id} className="absolute -translate-x-1/2 h-3 w-1 rounded-full bg-yellow-300" style={{ left: `${b.x}%`, top: `${b.y}%`, boxShadow: "0 0 8px #fde047" }} />
        ))}
        <div className="absolute bottom-3 -translate-x-1/2 text-5xl" style={{ left: `${px}%`, filter: "drop-shadow(0 0 8px #60a5fa)", transform: "translateX(-50%) rotate(-45deg)" }}>🚀</div>
        <div className="absolute inset-0" onPointerMove={(e) => {
          const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          setPx(Math.max(6, Math.min(94, ((e.clientX - r.left) / r.width) * 100)));
        }} onPointerDown={(e) => {
          const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          setPx(Math.max(6, Math.min(94, ((e.clientX - r.left) / r.width) * 100)));
        }} />
        {over && <GameOver score={score} onReplay={onReplay} onExit={onExit} />}
      </ArenaShell>
      <p className="mt-2 text-center text-xs text-slate-600">Drag to move. Rocket auto-fires!</p>
    </div>
  );
}

/* ============= 16. RACE CAR ============= */
function RaceCarGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const speed = diff === "easy" ? 2 : diff === "medium" ? 3 : 4.5;
  const lanes = [20, 50, 80];
  const [lane, setLane] = useState(1);
  type C = { id: number; lane: number; y: number };
  const [cars, setCars] = useState<C[]>([]);
  const [score, setScore] = useState(0); const [over, setOver] = useState(false);
  const idR = useRef(0); const sR = useRef(0); const tR = useRef(0);
  useTick(!over, 30, () => {
    tR.current++;
    setCars(arr => {
      let next = arr.map(c => ({ ...c, y: c.y + speed })).filter(c => c.y < 110);
      for (const c of next) {
        if (c.y > 75 && c.y < 90 && c.lane === lane) { setOver(true); SFX.fail(); }
      }
      sR.current--;
      if (sR.current <= 0) {
        sR.current = 30 + Math.floor(Math.random() * 25);
        next.push({ id: idR.current++, lane: Math.floor(Math.random() * 3), y: -10 });
      }
      return next;
    });
    if (tR.current % 10 === 0) setScore(s => s + 1);
  });
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Distance" value={score} /><HUD label="Mode" value={diff} /></div>
      <ArenaShell bg="linear-gradient(180deg,#1f2937,#111827)">
        {/* lane markers */}
        {[33, 66].map((p, i) => (
          <div key={i} className="absolute top-0 bottom-0 w-1" style={{ left: `${p}%`, background: "repeating-linear-gradient(180deg,#fde047 0 14px,transparent 14px 28px)", animation: `roadDash 0.4s linear infinite` }} />
        ))}
        {cars.map(c => (
          <div key={c.id} className="absolute text-4xl" style={{ left: `${lanes[c.lane]}%`, top: `${c.y}%`, filter: "drop-shadow(0 4px 6px #000a)", transform: "translateX(-50%) rotate(-90deg) scaleX(-1)" }}>🚙</div>
        ))}
        <div className="absolute text-5xl transition-all" style={{ left: `${lanes[lane]}%`, bottom: "8%", filter: "drop-shadow(0 4px 6px #0008)", transform: "translateX(-50%) rotate(-90deg)" }}>🏎️</div>
        {/* controls */}
        <div className="absolute inset-y-0 left-0 w-1/2" onPointerDown={() => setLane(l => Math.max(0, l - 1))} />
        <div className="absolute inset-y-0 right-0 w-1/2" onPointerDown={() => setLane(l => Math.min(2, l + 1))} />
        {over && <GameOver score={score} onReplay={onReplay} onExit={onExit} label="Distance" />}
        <style>{`@keyframes roadDash { to { background-position: 0 28px; } }`}</style>
      </ArenaShell>
      <p className="mt-2 text-center text-xs text-slate-600">Tap left / right side to switch lanes.</p>
    </div>
  );
}

/* ============= 17. HELICOPTER ============= */
function HelicopterGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const G = 0.4, LIFT = -0.7;
  const gap = diff === "easy" ? 40 : diff === "medium" ? 30 : 22;
  const speed = diff === "easy" ? 1.5 : diff === "medium" ? 2.2 : 3;
  const [y, setY] = useState(50); const yR = useRef(50); const vR = useRef(0); const liftR = useRef(false);
  type W = { x: number; top: number; bot: number };
  const [walls, setWalls] = useState<W[]>(() => Array.from({ length: 10 }, (_, i) => ({ x: i * 10, top: 10, bot: 10 })));
  const [score, setScore] = useState(0); const [over, setOver] = useState(false);
  const tR = useRef(0);
  useTick(!over, 30, () => {
    tR.current++;
    vR.current += liftR.current ? LIFT : G; vR.current = Math.max(-6, Math.min(6, vR.current));
    yR.current += vR.current; setY(yR.current);
    setWalls(ws => {
      const next = ws.map(w => ({ ...w, x: w.x - speed }));
      while (next.length && next[0].x < -10) next.shift();
      while (next.length < 14) {
        const last = next[next.length - 1] || { x: 0, top: 10, bot: 10 };
        const t = Math.max(5, Math.min(70 - gap, last.top + (Math.random() - 0.5) * 8));
        next.push({ x: last.x + 10, top: t, bot: 100 - t - gap });
      }
      // collision with current at x near player (player at x=15)
      for (const w of next) {
        if (w.x > 8 && w.x < 22) {
          if (yR.current < w.top || yR.current > 100 - w.bot) { setOver(true); SFX.fail(); }
        }
      }
      return next;
    });
    if (tR.current % 10 === 0) setScore(s => s + 1);
  });
  return (
    <div onPointerDown={() => { liftR.current = true; SFX.click(); }} onPointerUp={() => { liftR.current = false; }} onPointerLeave={() => { liftR.current = false; }}>
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Hold" value="Lift" /></div>
      <ArenaShell bg="linear-gradient(180deg,#0c4a6e,#0e7490)">
        {walls.map((w, i) => (
          <div key={i}>
            <div className="absolute w-[10%]" style={{ left: `${w.x}%`, top: 0, height: `${w.top}%`, background: "linear-gradient(180deg,#451a03,#78350f)", borderBottom: "3px solid #292524" }} />
            <div className="absolute w-[10%]" style={{ left: `${w.x}%`, bottom: 0, height: `${w.bot}%`, background: "linear-gradient(0deg,#451a03,#78350f)", borderTop: "3px solid #292524" }} />
          </div>
        ))}
        <div className="absolute text-4xl" style={{ left: "15%", top: `${y}%`, transform: `translate(-50%,-50%) rotate(${Math.max(-25, Math.min(25, vR.current * 4))}deg)`, filter: "drop-shadow(0 0 6px #06b6d4)" }}>🚁</div>
        {over && <GameOver score={score} onReplay={onReplay} onExit={onExit} />}
      </ArenaShell>
      <p className="mt-2 text-center text-xs text-slate-600">Hold to lift, release to drop.</p>
    </div>
  );
}

/* ============= 18. NINJA WALL JUMP ============= */
function NinjaGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const speed = diff === "easy" ? 1.5 : diff === "medium" ? 2.2 : 3;
  const [side, setSide] = useState<0 | 1>(0); // 0 left, 1 right
  const [y, setY] = useState(20);
  type S = { id: number; side: 0 | 1; y: number };
  const [spikes, setSpikes] = useState<S[]>([]);
  const [score, setScore] = useState(0); const [over, setOver] = useState(false);
  const idR = useRef(0); const spawnR = useRef(0); const tR = useRef(0);
  useTick(!over, 30, () => {
    tR.current++;
    setY(v => Math.min(95, v + 0.4));
    setSpikes(arr => {
      let next = arr.map(s => ({ ...s, y: s.y + speed })).filter(s => s.y < 110);
      for (const s of next) {
        if (s.side === side && Math.abs(s.y - y) < 8) { setOver(true); SFX.fail(); }
      }
      spawnR.current--;
      if (spawnR.current <= 0) {
        spawnR.current = 18 + Math.floor(Math.random() * 14);
        next.push({ id: idR.current++, side: Math.random() < 0.5 ? 0 : 1, y: -10 });
      }
      return next;
    });
    if (tR.current % 8 === 0) setScore(s => s + 1);
  });
  function flip() { if (!over) { setSide(s => (s === 0 ? 1 : 0)); SFX.jump(); setY(v => Math.max(8, v - 6)); } }
  return (
    <div onPointerDown={flip}>
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Tap" value="Jump" /></div>
      <ArenaShell bg="linear-gradient(180deg,#1c1917,#0c0a09)">
        {/* walls */}
        <div className="absolute top-0 bottom-0 left-0 w-[15%]" style={{ background: "linear-gradient(90deg,#44403c,#292524)", boxShadow: "inset -3px 0 0 #000" }} />
        <div className="absolute top-0 bottom-0 right-0 w-[15%]" style={{ background: "linear-gradient(-90deg,#44403c,#292524)", boxShadow: "inset 3px 0 0 #000" }} />
        {spikes.map(s => (
          <div key={s.id} className="absolute text-2xl" style={{ [s.side === 0 ? "left" : "right"]: "12%", top: `${s.y}%`, transform: s.side === 0 ? "rotate(90deg)" : "rotate(-90deg)", filter: "drop-shadow(0 0 4px #ef4444)" } as any}>🔺</div>
        ))}
        <div className="absolute text-4xl transition-all duration-150" style={{ [side === 0 ? "left" : "right"]: "16%", top: `${y}%`, transform: side === 1 ? "scaleX(-1)" : "none", filter: "drop-shadow(0 0 6px #f59e0b)" } as any}>🥷</div>
        {over && <GameOver score={score} onReplay={onReplay} onExit={onExit} />}
      </ArenaShell>
      <p className="mt-2 text-center text-xs text-slate-600">Tap to wall-jump. Dodge the spikes!</p>
    </div>
  );
}

/* ============= 19. DINO RUN ============= */
function DinoGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const G = 0.7, JUMP = -12;
  const speed = diff === "easy" ? 3 : diff === "medium" ? 4.5 : 6.5;
  const [y, setY] = useState(0); const yR = useRef(0); const vR = useRef(0); const onG = useRef(true);
  type O = { id: number; x: number };
  const [obs, setObs] = useState<O[]>([]);
  const [score, setScore] = useState(0); const [over, setOver] = useState(false);
  const idR = useRef(0); const sR = useRef(0); const tR = useRef(0);
  useTick(!over, 30, () => {
    tR.current++;
    vR.current += G; yR.current += vR.current;
    if (yR.current >= 0) { yR.current = 0; vR.current = 0; onG.current = true; } else onG.current = false;
    setY(yR.current);
    setObs(arr => {
      let next = arr.map(o => ({ ...o, x: o.x - speed })).filter(o => o.x > -10);
      for (const o of next) if (o.x > 8 && o.x < 20 && yR.current > -25) { setOver(true); SFX.fail(); }
      sR.current--;
      if (sR.current <= 0) { sR.current = 35 + Math.floor(Math.random() * 35); next.push({ id: idR.current++, x: 105 }); }
      return next;
    });
    if (tR.current % 5 === 0) setScore(s => s + 1);
  });
  function jump() { if (onG.current && !over) { vR.current = JUMP; SFX.jump(); } }
  return (
    <div onPointerDown={jump}>
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Tap" value="Jump" /></div>
      <ArenaShell bg="linear-gradient(180deg,#fde68a,#fbbf24 70%,#a16207 71%,#78350f)">
        <div className="absolute top-6 right-8 text-5xl">☀️</div>
        <div className="absolute bottom-0 left-0 right-0 h-[29%]" style={{ background: "linear-gradient(180deg,#a16207,#78350f)", boxShadow: "inset 0 3px 0 #fbbf24" }} />
        <div className="absolute text-5xl" style={{ left: "10%", bottom: `calc(29% + ${-y}px)`, filter: "drop-shadow(0 4px 4px #0006)" }}>🦖</div>
        {obs.map(o => (
          <div key={o.id} className="absolute text-3xl" style={{ left: `${o.x}%`, bottom: "29%", filter: "drop-shadow(0 3px 4px #0006)" }}>🌵</div>
        ))}
        {over && <GameOver score={score} onReplay={onReplay} onExit={onExit} />}
      </ArenaShell>
      <p className="mt-2 text-center text-xs text-slate-600">Tap to jump over the cactus!</p>
    </div>
  );
}

/* ============= 20. FROG CROSS ============= */
function FroggerGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const ROWS = 7;
  const carSpeed = diff === "easy" ? 0.8 : diff === "medium" ? 1.3 : 2;
  const [px, setPx] = useState(50); const [py, setPy] = useState(ROWS); // ROWS = bottom row
  type C = { id: number; row: number; x: number; dir: 1 | -1; emoji: string };
  const [cars, setCars] = useState<C[]>(() => {
    const arr: C[] = []; let id = 0;
    for (let r = 1; r < ROWS; r++) {
      const dir = (r % 2 === 0 ? 1 : -1) as 1 | -1;
      const emoji = r % 3 === 0 ? "🚚" : r % 2 === 0 ? "🚗" : "🏍️";
      for (let i = 0; i < 2; i++) arr.push({ id: id++, row: r, x: (i * 50 + r * 13) % 100, dir, emoji });
    }
    return arr;
  });
  const [score, setScore] = useState(0); const [over, setOver] = useState(false);
  const rowH = 100 / (ROWS + 1);
  useTick(!over, 50, () => {
    setCars(arr => arr.map(c => {
      let nx = c.x + c.dir * carSpeed;
      if (nx > 110) nx = -10; if (nx < -10) nx = 110;
      return { ...c, x: nx };
    }));
  });
  // collisions
  useEffect(() => {
    if (over) return;
    for (const c of cars) {
      if (c.row === py && Math.abs(c.x - px) < 8) { setOver(true); SFX.fail(); return; }
    }
  }, [cars, px, py, over]);
  function move(dx: number, dy: number) {
    if (over) return;
    setPx(v => Math.max(4, Math.min(96, v + dx * 12)));
    setPy(v => {
      const n = Math.max(0, Math.min(ROWS, v + dy));
      if (n === 0 && v !== 0) { setScore(s => s + 1); SFX.eat(); return ROWS; }
      return n;
    });
    SFX.jump();
  }
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Crosses" value={score} /><HUD label="Mode" value={diff} /></div>
      <ArenaShell bg="linear-gradient(180deg,#86efac 0 14%,#4b5563 14% 86%,#86efac 86% 100%)">
        {/* lane lines */}
        {Array.from({ length: ROWS - 1 }).map((_, i) => (
          <div key={i} className="absolute left-0 right-0 h-[2px]" style={{ top: `${(i + 1) * rowH}%`, background: i === 0 || i === ROWS - 2 ? "transparent" : "repeating-linear-gradient(90deg,#fde047 0 16px,transparent 16px 32px)" }} />
        ))}
        {cars.map(c => (
          <div key={c.id} className="absolute -translate-x-1/2 text-3xl" style={{ left: `${c.x}%`, top: `${c.row * rowH + rowH / 2}%`, transform: `translate(-50%,-50%) scaleX(${c.dir})`, filter: "drop-shadow(0 3px 4px #0007)" }}>{c.emoji}</div>
        ))}
        <div className="absolute -translate-x-1/2 text-4xl transition-all" style={{ left: `${px}%`, top: `${py * rowH + rowH / 2}%`, transform: "translate(-50%,-50%)", filter: "drop-shadow(0 3px 4px #0008)" }}>🐸</div>
        {over && <GameOver score={score} onReplay={onReplay} onExit={onExit} label="Crosses" />}
      </ArenaShell>
      <div className="mt-3 grid grid-cols-3 gap-2 text-white max-w-[220px] mx-auto">
        <div></div>
        <button onClick={() => move(0, -1)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow-lg active:scale-90">▲</button>
        <div></div>
        <button onClick={() => move(-1, 0)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow-lg active:scale-90">◀</button>
        <button onClick={() => move(0, 1)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow-lg active:scale-90">▼</button>
        <button onClick={() => move(1, 0)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow-lg active:scale-90">▶</button>
      </div>
    </div>
  );
}
