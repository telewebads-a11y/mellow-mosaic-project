import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Home, Play, RotateCcw, Trophy } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import bgClouds from "@/assets/bg-clouds.jpg";
import bearFace from "@/assets/icons/bear-face.png";

export const Route = createFileRoute("/games/$gameId")({
  head: () => ({ meta: [{ title: "Play — Melly Kids" }] }),
  component: GameRunner,
});

type Diff = "easy" | "medium" | "hard";

const TITLES: Record<string, string> = {
  shooting: "Balloon Shoot",
  running: "Bear Run",
  jumping: "Jump Jump",
  snake: "Hungry Snake",
  tictactoe: "Tic-Tac-Toe",
  memory: "Memory Match",
  catch: "Catch the Fruit",
  maze: "Magic Maze",
  bubble: "Bubble Pop",
  colorsort: "Color Sort",
};

function GameRunner() {
  const { gameId } = useParams({ from: "/games/$gameId" as any }) as { gameId: string };
  const nav = useNavigate();
  const [diff, setDiff] = useState<Diff | null>(null);
  const [playing, setPlaying] = useState(false);
  const [round, setRound] = useState(0);

  const title = TITLES[gameId] ?? "Game";

  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgClouds})` }} />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-sky-200/50 to-pink-200/40" />

      <header className="mx-auto flex max-w-md items-center justify-between px-4 pt-5">
        <button onClick={() => (playing ? setPlaying(false) : nav({ to: "/games" }))}
          className="rounded-full bg-white/90 p-2 shadow">
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-2xl font-black text-slate-800 drop-shadow-sm">{title}</h1>
        <button onClick={() => nav({ to: "/" })} className="rounded-full bg-white/90 p-2 shadow">
          <Home className="size-5" />
        </button>
      </header>

      <main className="mx-auto max-w-md px-4 pb-8 pt-4">
        {!playing ? (
          <StartCard
            onStart={(d) => { setDiff(d); setPlaying(true); setRound((r) => r + 1); }}
            gameId={gameId}
          />
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
    <div className="mt-6 rounded-3xl bg-white/90 p-6 shadow-2xl ring-4 ring-white">
      <div className="flex items-center gap-3">
        <img src={bearFace} alt="" className="size-16 bear-bounce drop-shadow" />
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-500">Ready?</div>
          <div className="text-xl font-extrabold">Pick difficulty</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {(["easy", "medium", "hard"] as Diff[]).map((x) => (
          <button key={x} onClick={() => setD(x)}
            className={`rounded-2xl p-3 text-sm font-bold capitalize shadow transition ${
              d === x ? "bg-gradient-to-br from-emerald-400 to-green-600 text-white scale-105" : "bg-slate-100 text-slate-700"
            }`}>{x}</button>
        ))}
      </div>

      <button onClick={() => onStart(d)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 px-5 py-4 text-lg font-black text-white shadow-xl ring-4 ring-pink-200 active:scale-95">
        <Play className="size-6 fill-current" /> PLAY
      </button>
      <p className="mt-3 text-center text-xs text-slate-500">Game: {gameId}</p>
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
    default: return <div className="mt-6 rounded-2xl bg-white p-6 text-center">Coming soon!</div>;
  }
}

/* ---------- shared UI ---------- */
function HUD({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl bg-white/90 px-3 py-2 shadow text-center min-w-[70px]">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-lg font-black text-slate-800">{value}</div>
    </div>
  );
}
function EndCard({ title, score, onReplay, onExit }: { title: string; score?: any; onReplay: () => void; onExit: () => void }) {
  return (
    <div className="mt-6 rounded-3xl bg-white/95 p-6 text-center shadow-2xl ring-4 ring-yellow-200">
      <Trophy className="mx-auto size-12 text-yellow-500" />
      <div className="mt-2 text-2xl font-black">{title}</div>
      {score !== undefined && <div className="mt-1 text-slate-600">Score: <span className="font-bold">{score}</span></div>}
      <div className="mt-5 flex gap-3">
        <button onClick={onReplay} className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 font-bold text-white shadow active:scale-95 flex items-center justify-center gap-2">
          <RotateCcw className="size-5" /> Again
        </button>
        <button onClick={onExit} className="flex-1 rounded-2xl bg-slate-700 px-4 py-3 font-bold text-white shadow active:scale-95">
          Menu
        </button>
      </div>
    </div>
  );
}

/* ============= 1. SHOOTING ============= */
function ShootingGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [targets, setTargets] = useState<{ id: number; x: number; y: number; c: string }[]>([]);
  const spawnRate = diff === "easy" ? 1100 : diff === "medium" ? 750 : 450;
  const colors = ["#ff5e7e", "#ffb84a", "#5ec98a", "#5ec8ef", "#b48bff"];
  const over = time <= 0;

  useEffect(() => {
    if (over) return;
    const t = setInterval(() => setTime((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [over]);

  useEffect(() => {
    if (over) return;
    const s = setInterval(() => {
      setTargets((ts) => [...ts.slice(-8), {
        id: Date.now() + Math.random(), x: 8 + Math.random() * 78, y: 90,
        c: colors[Math.floor(Math.random() * colors.length)],
      }]);
    }, spawnRate);
    return () => clearInterval(s);
  }, [over, spawnRate]);

  useEffect(() => {
    if (over) return;
    const f = setInterval(() => {
      setTargets((ts) => ts.map((t) => ({ ...t, y: t.y - 1.2 })).filter((t) => t.y > -10));
    }, 50);
    return () => clearInterval(f);
  }, [over]);

  if (over) return <EndCard title="Time's Up!" score={score} onReplay={onReplay} onExit={onExit} />;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Time" value={time} /></div>
      <div className="relative mt-3 h-[460px] overflow-hidden rounded-3xl bg-gradient-to-b from-sky-300 to-sky-500 shadow-2xl ring-4 ring-white">
        {targets.map((t) => (
          <button key={t.id} onClick={() => { setScore((s) => s + 10); setTargets((ts) => ts.filter((x) => x.id !== t.id)); }}
            className="absolute size-12 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-xl active:scale-90"
            style={{ left: `${t.x}%`, top: `${t.y}%`, background: `radial-gradient(circle at 30% 30%, #fff8, ${t.c})`,
              boxShadow: `0 8px 20px ${t.c}80, inset -4px -8px 12px #0003` }}>
            <span className="absolute left-1/2 top-full w-px h-6 bg-white/70" />
          </button>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-slate-600">Tap balloons!</p>
    </div>
  );
}

/* ============= 2. RUNNING ============= */
function RunningGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const speed = diff === "easy" ? 4 : diff === "medium" ? 6 : 9;
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [jump, setJump] = useState(0);
  const [obs, setObs] = useState<{ id: number; x: number }[]>([]);
  const jumpingRef = useRef(false);

  const doJump = () => {
    if (jumpingRef.current || over) return;
    jumpingRef.current = true;
    setJump(1);
    setTimeout(() => setJump(0), 550);
    setTimeout(() => { jumpingRef.current = false; }, 600);
  };

  useEffect(() => {
    if (over) return;
    const i = setInterval(() => {
      setObs((o) => {
        const next = o.map((x) => ({ ...x, x: x.x - speed })).filter((x) => x.x > -10);
        if (next.length === 0 || next[next.length - 1].x < 100 - (30 + Math.random() * 40))
          if (Math.random() > 0.7) next.push({ id: Date.now() + Math.random(), x: 110 });
        return next;
      });
      setScore((s) => s + 1);
    }, 60);
    return () => clearInterval(i);
  }, [speed, over]);

  useEffect(() => {
    if (over) return;
    const i = setInterval(() => {
      obs.forEach((o) => { if (o.x > 8 && o.x < 22 && jump === 0) setOver(true); });
    }, 50);
    return () => clearInterval(i);
  }, [obs, jump, over]);

  if (over) return <EndCard title="Game Over" score={score} onReplay={onReplay} onExit={onExit} />;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Speed" value={diff} /></div>
      <div onClick={doJump} className="relative mt-3 h-[420px] overflow-hidden rounded-3xl bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-300 shadow-2xl ring-4 ring-white select-none cursor-pointer">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-emerald-500 to-emerald-700" />
        <div className="absolute left-[10%] bottom-24 transition-transform duration-500"
          style={{ transform: `translateY(${jump ? -130 : 0}px)` }}>
          <img src={bearFace} alt="" className="size-20 drop-shadow-xl" />
        </div>
        {obs.map((o) => (
          <div key={o.id} className="absolute bottom-24 size-10 rounded-lg bg-gradient-to-br from-stone-500 to-stone-800 shadow-xl"
            style={{ left: `${o.x}%` }} />
        ))}
        <div className="absolute inset-x-0 top-3 text-center text-xs font-bold text-slate-700/80">TAP to JUMP</div>
      </div>
    </div>
  );
}

/* ============= 3. JUMPING ============= */
function JumpingGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const size = 4;
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(diff === "easy" ? 40 : diff === "medium" ? 30 : 20);
  const [target, setTarget] = useState(1);
  const over = time <= 0;

  useEffect(() => { if (!over) { const t = setInterval(() => setTime((s) => s - 1), 1000); return () => clearInterval(t); } }, [over]);

  if (over) return <EndCard title="Time's Up!" score={score} onReplay={onReplay} onExit={onExit} />;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Time" value={time} /></div>
      <div className="relative mt-3 h-[420px] overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-300 to-purple-500 shadow-2xl ring-4 ring-white">
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-around p-4">
          {Array.from({ length: size }).map((_, i) => (
            <button key={i} onClick={() => {
              if (i === target) { setScore((s) => s + 5); setTarget(Math.floor(Math.random() * size)); }
              else setScore((s) => Math.max(0, s - 1));
              setPos(i);
            }}
              className={`h-16 w-16 rounded-xl shadow-xl transition-all ${i === target ? "bg-gradient-to-br from-yellow-300 to-orange-500 animate-pulse scale-110" : "bg-gradient-to-br from-slate-200 to-slate-400"}`}
              style={{ transform: `perspective(400px) rotateX(20deg) translateY(${i === target ? -10 : 0}px)` }}
            />
          ))}
        </div>
        <div className="absolute bottom-24 transition-all duration-300" style={{ left: `${10 + pos * 22}%` }}>
          <img src={bearFace} alt="" className="size-16 drop-shadow-2xl bear-bounce" />
        </div>
        <div className="absolute inset-x-0 top-3 text-center text-xs font-bold text-white/90">Tap the GLOWING platform!</div>
      </div>
    </div>
  );
}

/* ============= 4. SNAKE ============= */
function SnakeGame({ diff, onReplay, onExit }: { diff: Diff; onReplay: () => void; onExit: () => void }) {
  const N = 15;
  const speed = diff === "easy" ? 220 : diff === "medium" ? 140 : 90;
  type P = { x: number; y: number };
  const [snake, setSnake] = useState<P[]>([{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }]);
  const [dir, setDir] = useState<P>({ x: 1, y: 0 });
  const dirRef = useRef(dir); dirRef.current = dir;
  const [food, setFood] = useState<P>({ x: 10, y: 7 });
  const [over, setOver] = useState(false);
  const score = snake.length - 3;

  useEffect(() => {
    if (over) return;
    const id = setInterval(() => {
      setSnake((s) => {
        const head = { x: (s[0].x + dirRef.current.x + N) % N, y: (s[0].y + dirRef.current.y + N) % N };
        if (s.some((p) => p.x === head.x && p.y === head.y)) { setOver(true); return s; }
        const next = [head, ...s];
        if (head.x === food.x && head.y === food.y) {
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

  const turn = (nx: number, ny: number) => {
    const c = dirRef.current;
    if (c.x === -nx && c.y === -ny) return;
    setDir({ x: nx, y: ny });
  };

  if (over) return <EndCard title="Game Over" score={score} onReplay={onReplay} onExit={onExit} />;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Length" value={snake.length} /><HUD label="Food" value={score} /></div>
      <div className="relative mt-3 aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-200 to-green-400 shadow-2xl ring-4 ring-white p-2">
        <div className="grid h-full w-full gap-[2px]" style={{ gridTemplateColumns: `repeat(${N}, 1fr)`, gridTemplateRows: `repeat(${N}, 1fr)` }}>
          {Array.from({ length: N * N }).map((_, i) => {
            const x = i % N, y = Math.floor(i / N);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = !isHead && snake.some((p) => p.x === x && p.y === y);
            const isFood = food.x === x && food.y === y;
            return <div key={i} className={`rounded-sm ${isHead ? "bg-emerald-800" : isBody ? "bg-emerald-600" : isFood ? "bg-rose-500 animate-pulse" : "bg-white/30"}`} />;
          })}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-white">
        <div></div>
        <button onClick={() => turn(0, -1)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow active:scale-95">▲</button>
        <div></div>
        <button onClick={() => turn(-1, 0)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow active:scale-95">◀</button>
        <button onClick={() => turn(0, 1)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow active:scale-95">▼</button>
        <button onClick={() => turn(1, 0)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow active:scale-95">▶</button>
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
    // hard: minimax
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
    const nb = [...b]; nb[i] = "X";
    setB(nb); setTurn("O");
  };
  useEffect(() => {
    if (turn === "O" && !checkWin(b) && b.some((v) => !v)) {
      const t = setTimeout(() => {
        const i = aiMove(b);
        if (i >= 0) { const nb = [...b]; nb[i] = "O"; setB(nb); setTurn("X"); }
      }, 500);
      return () => clearTimeout(t);
    }
  }, [turn, b]);

  if (over) return <EndCard title={win === "X" ? "You Win! 🎉" : win === "O" ? "Bear Wins!" : "Draw!"} onReplay={onReplay} onExit={onExit} />;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="You" value="X" /><HUD label="Bear" value="O" /><HUD label="Turn" value={turn === "X" ? "You" : "Bear"} /></div>
      <div className="mt-3 mx-auto grid aspect-square w-full max-w-sm grid-cols-3 gap-3 rounded-3xl bg-gradient-to-br from-sky-300 to-blue-500 p-4 shadow-2xl ring-4 ring-white">
        {b.map((v, i) => (
          <button key={i} onClick={() => play(i)}
            className="flex items-center justify-center rounded-2xl bg-white text-6xl font-black shadow-inner active:scale-95"
            style={{ color: v === "X" ? "#ef4444" : "#3b82f6" }}>{v}</button>
        ))}
      </div>
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
    const nc = cards.map((c, k) => k === i ? { ...c, flipped: true } : c);
    const np = [...pick, i];
    setCards(nc); setPick(np);
    if (np.length === 2) {
      setMoves((m) => m + 1);
      setTimeout(() => {
        setCards((cc) => {
          const [a, b] = np;
          if (cc[a].e === cc[b].e) return cc.map((c, k) => (k === a || k === b ? { ...c, matched: true } : c));
          return cc.map((c, k) => (k === a || k === b ? { ...c, flipped: false } : c));
        });
        setPick([]);
      }, 700);
    }
  };

  if (done) return <EndCard title="All Matched!" score={moves + " moves"} onReplay={onReplay} onExit={onExit} />;
  const cols = pairs <= 6 ? 3 : 4;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Moves" value={moves} /><HUD label="Pairs" value={pairs} /></div>
      <div className="mt-3 grid gap-2 rounded-3xl bg-gradient-to-br from-violet-300 to-purple-500 p-3 shadow-2xl ring-4 ring-white"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cards.map((c, i) => (
          <button key={c.id} onClick={() => flip(i)}
            className={`aspect-square rounded-2xl text-4xl font-black shadow-lg transition-transform ${c.flipped || c.matched ? "bg-white scale-100" : "bg-gradient-to-br from-pink-400 to-rose-600 scale-95"}`}>
            {c.flipped || c.matched ? c.e : "❓"}
          </button>
        ))}
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
  const fruits = ["🍎","🍌","🍊","🍇","🍓","🍑","🍉","🥝"];
  const [items, setItems] = useState<{ id: number; x: number; y: number; e: string }[]>([]);
  const over = lives <= 0;
  const ref = useRef<HTMLDivElement>(null);

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
          if (ny >= 92) {
            if (Math.abs(i.x - x) < 12) setScore((s) => s + 1);
            else setLives((l) => l - 1);
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
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Lives" value={"❤️".repeat(lives)} /></div>
      <div ref={ref} onPointerMove={(e) => {
        const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        setX(Math.max(8, Math.min(92, ((e.clientX - r.left) / r.width) * 100)));
      }} className="relative mt-3 h-[460px] overflow-hidden rounded-3xl bg-gradient-to-b from-pink-200 to-rose-400 shadow-2xl ring-4 ring-white touch-none">
        {items.map((i) => (
          <div key={i.id} className="absolute text-3xl -translate-x-1/2 drop-shadow" style={{ left: `${i.x}%`, top: `${i.y}%` }}>{i.e}</div>
        ))}
        <div className="absolute bottom-2 -translate-x-1/2 text-5xl" style={{ left: `${x}%` }}>🧺</div>
        <div className="absolute inset-x-0 top-3 text-center text-xs font-bold text-slate-700/80">Move basket with finger</div>
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
    setPos({ x: nx, y: ny }); setMoves((m) => m + 1);
  };

  if (done) return <EndCard title="You Escaped!" score={moves + " moves"} onReplay={onReplay} onExit={onExit} />;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Size" value={`${size}×${size}`} /><HUD label="Moves" value={moves} /></div>
      <div className="mt-3 aspect-square rounded-3xl bg-gradient-to-br from-indigo-300 to-blue-600 p-2 shadow-2xl ring-4 ring-white">
        <div className="grid h-full w-full" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
          {maze.flat().map((c, i) => {
            const x = i % size, y = Math.floor(i / size);
            const isP = pos.x === x && pos.y === y;
            const isG = goal.x === x && goal.y === y;
            return (
              <div key={i} className="relative bg-white/80"
                style={{
                  borderRight: c.r ? "2px solid #1e293b" : "none",
                  borderBottom: c.b ? "2px solid #1e293b" : "none",
                  borderTop: y === 0 ? "2px solid #1e293b" : undefined,
                  borderLeft: x === 0 ? "2px solid #1e293b" : undefined,
                }}>
                {isG && <div className="absolute inset-1 rounded-full bg-yellow-400 animate-pulse" />}
                {isP && <div className="absolute inset-1 rounded-full bg-rose-500 shadow" />}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-white">
        <div></div>
        <button onClick={() => move(0, -1)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow active:scale-95">▲</button>
        <div></div>
        <button onClick={() => move(-1, 0)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow active:scale-95">◀</button>
        <button onClick={() => move(0, 1)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow active:scale-95">▼</button>
        <button onClick={() => move(1, 0)} className="rounded-2xl bg-slate-700 py-3 font-bold shadow active:scale-95">▶</button>
      </div>
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
      <div className="relative mt-3 h-[460px] overflow-hidden rounded-3xl bg-gradient-to-b from-cyan-200 to-blue-500 shadow-2xl ring-4 ring-white">
        {bubbles.map((b, i) => !b.popped && (
          <button key={i} onClick={() => setBubbles((bb) => bb.map((x, j) => j === i ? { ...x, popped: true } : x))}
            className="absolute rounded-full active:scale-50 transition-transform"
            style={{
              left: `${b.x}%`, top: `${b.y}%`, width: b.s, height: b.s,
              background: `radial-gradient(circle at 30% 30%, #ffffffcc, ${b.c}aa, ${b.c})`,
              boxShadow: `0 6px 14px ${b.c}80, inset -4px -6px 8px #00000022`,
              animation: `bubbleFloat ${3 + (i % 5) * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.1}s`,
            }} />
        ))}
        <style>{`@keyframes bubbleFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }`}</style>
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
  const choices = useMemo(() => {
    const sh = [...colors].sort(() => Math.random() - 0.5).slice(0, opts);
    return sh;
  }, [round, opts]);
  const target = choices[Math.floor((round * 7919) % choices.length)] ?? choices[0];
  const over = time <= 0;

  useEffect(() => { if (!over) { const t = setInterval(() => setTime((s) => s - 1), 1000); return () => clearInterval(t); } }, [over]);

  if (over) return <EndCard title="Time's Up!" score={score} onReplay={onReplay} onExit={onExit} />;
  return (
    <div>
      <div className="flex justify-between gap-2"><HUD label="Score" value={score} /><HUD label="Time" value={time} /></div>
      <div className="mt-3 rounded-3xl bg-gradient-to-br from-fuchsia-300 to-pink-500 p-6 shadow-2xl ring-4 ring-white">
        <div className="text-center text-white">
          <div className="text-xs uppercase tracking-widest opacity-90">Tap the color</div>
          <div className="my-2 text-5xl font-black drop-shadow">{target.n}</div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {choices.map((c) => (
            <button key={c.n} onClick={() => { if (c.n === target.n) setScore((s) => s + 1); else setScore((s) => Math.max(0, s - 1)); setRound((r) => r + 1); }}
              className="aspect-square rounded-2xl shadow-xl active:scale-90 transition-transform"
              style={{ background: `radial-gradient(circle at 30% 30%, #ffffffaa, ${c.c})`, boxShadow: `0 10px 24px ${c.c}80` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
