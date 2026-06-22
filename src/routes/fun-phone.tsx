import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Home, Phone, MessageCircle, Video, Music2, Hash, Delete, PhoneOff, Smile, Laugh, Frown, Sparkles, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import bearFace from "@/assets/icons/bear-face.png";
import bearHello from "@/assets/bear-hello.png";
import bearSmile from "@/assets/bear-smile.png";
import bearLaugh from "@/assets/bear-laugh.png";
import bearCry from "@/assets/bear-cry.png";
import bearDance from "@/assets/bear-dance.png";
import bearFunny from "@/assets/bear-funny.png";
import bgRainbow from "@/assets/bg-rainbow.jpg";

export const Route = createFileRoute("/fun-phone")({
  head: () => ({
    meta: [
      { title: "Fun Phone — Melly Kids TV" },
      { name: "description", content: "A kids phone with calls, chat and video with Melly the Bear." },
    ],
  }),
  component: FunPhone,
});

type Tab = "dial" | "chat" | "video";

/* -------------------- Audio helpers -------------------- */
let _ctx: AudioContext | null = null;
function audio() {
  if (typeof window === "undefined") return null;
  if (!_ctx) _ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}
function tone(freq: number, dur = 0.25, type: OscillatorType = "sine", gain = 0.18) {
  const ctx = audio();
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  o.connect(g).connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + dur);
}
function speak(text: string, lang = "en-US", rate = 0.95, pitch = 1.4) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = rate;
  u.pitch = pitch;
  window.speechSynthesis.speak(u);
}

/* -------------------- Page -------------------- */
function FunPhone() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("dial");

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url(${bgRainbow})` }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/45" />

      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <button
          aria-label="Back"
          onClick={() => navigate({ to: "/" })}
          className="flex size-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-2 ring-white"
        >
          <ArrowLeft className="size-6" />
        </button>
        <img src={bearFace} alt="" width={64} height={64} className="size-16 drop-shadow-lg bear-bounce" />
        <Link
          to="/games"
          aria-label="Home"
          className="flex size-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-2 ring-white"
        >
          <Home className="size-6" />
        </Link>
      </header>

      <h1 className="melly-title px-5 pb-2 text-center leading-tight">
        <span style={{ color: "#ff6b6b" }}>F</span>
        <span style={{ color: "#ffb347" }}>u</span>
        <span style={{ color: "#ffd23f" }}>n </span>
        <span style={{ color: "#6dd47e" }}>P</span>
        <span style={{ color: "#4ac6e8" }}>h</span>
        <span style={{ color: "#b78ce8" }}>o</span>
        <span style={{ color: "#ff6b6b" }}>n</span>
        <span style={{ color: "#ffb347" }}>e</span>
      </h1>

      {/* Tab switcher */}
      <div className="mx-4 mb-3 grid grid-cols-3 gap-2 rounded-2xl bg-white/80 p-2 shadow-md ring-2 ring-white">
        <TabBtn active={tab === "dial"} onClick={() => setTab("dial")} icon={<Phone className="size-5" />} label="Dial" color="#ff6b6b" />
        <TabBtn active={tab === "chat"} onClick={() => setTab("chat")} icon={<MessageCircle className="size-5" />} label="Chat" color="#4ac6e8" />
        <TabBtn active={tab === "video"} onClick={() => setTab("video")} icon={<Video className="size-5" />} label="Video" color="#b78ce8" />
      </div>

      <main className="flex-1 px-4 pb-8">
        {tab === "dial" && <DialScreen />}
        {tab === "chat" && <ChatScreen />}
        {tab === "video" && <VideoScreen />}
      </main>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label, color }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; color: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-sm font-extrabold transition"
      style={{
        background: active ? color : "transparent",
        color: active ? "#fff" : color,
        boxShadow: active ? "0 4px 0 rgba(0,0,0,0.15)" : "none",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

/* ===================== SCREEN 1: DIAL ===================== */
type Mode = "num" | "music";
const KEY_TONES: Record<string, number> = {
  "1": 523.25, "2": 587.33, "3": 659.25,
  "4": 698.46, "5": 783.99, "6": 880.0,
  "7": 987.77, "8": 1046.5, "9": 1174.66,
  "0": 440.0, "*": 392.0, "#": 349.23,
};
const NUM_WORDS: Record<string, string> = {
  "1": "One", "2": "Two", "3": "Three", "4": "Four", "5": "Five",
  "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine", "0": "Zero",
  "*": "Star", "#": "Hash",
};

function DialScreen() {
  const [mode, setMode] = useState<Mode>("num");
  const [display, setDisplay] = useState("");
  const [bearHidden, setBearHidden] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);

  function pressKey(k: string) {
    setBearHidden(true);
    setDisplay((d) => (d.length < 14 ? d + k : d));
    setPressed(k);
    setTimeout(() => setPressed(null), 200);

    if (mode === "num") {
      tone(KEY_TONES[k], 0.18, "sine", 0.18);
      if (NUM_WORDS[k]) speak(NUM_WORDS[k], "en-US", 0.95, 1.3);
    } else {
      // Each key plays a different musical note (kids music)
      tone(KEY_TONES[k], 0.35, "triangle", 0.2);
      // sparkly overtone
      setTimeout(() => tone(KEY_TONES[k] * 2, 0.2, "sine", 0.1), 60);
    }
  }
  function back() {
    setDisplay((d) => d.slice(0, -1));
    tone(300, 0.08, "square", 0.12);
  }
  function call() {
    if (!display) return;
    tone(800, 0.15);
    setTimeout(() => tone(1000, 0.15), 180);
    speak(`Calling ${display.split("").join(" ")}`, "en-US", 0.9, 1.3);
  }

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
  const keyColors = ["#ff6b6b", "#ffb347", "#ffd23f", "#6dd47e", "#4ac6e8", "#b78ce8", "#ec6a5a", "#f5b73a", "#5ec98a", "#4aa6cf", "#d96cb0", "#7c5cd6"];

  return (
    <div className="mx-auto w-full max-w-[360px] rounded-[36px] bg-gradient-to-b from-pink-200 via-yellow-100 to-sky-200 p-3 shadow-[0_10px_0_rgba(0,0,0,0.15)] ring-4 ring-white">
      {/* Phone screen */}
      <div className="relative h-[180px] overflow-hidden rounded-3xl bg-gradient-to-b from-sky-300 to-emerald-200 shadow-inner ring-2 ring-white/60">
        {!bearHidden && display === "" ? (
          <div className="flex h-full flex-col items-center justify-center">
            <img src={bearFace} alt="" className="size-20 drop-shadow-lg bear-bounce" />
            <div className="mt-2 rounded-full bg-white/90 px-4 py-1 text-base font-extrabold text-pink-500 shadow">
              Hello! 👋
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center px-4">
            <div className="melly-title break-all text-center" style={{ fontSize: "2.4rem", color: "#0f172a", textShadow: "0 2px 0 rgba(255,255,255,0.6)" }}>
              {display || " "}
            </div>
          </div>
        )}
        {/* Mode pill */}
        <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-extrabold text-slate-600 shadow">
          {mode === "num" ? "123" : "🎵"}
        </div>
      </div>

      {/* Mode toggle */}
      <button
        onClick={() => {
          setMode((m) => (m === "num" ? "music" : "num"));
          tone(660, 0.12, "triangle", 0.18);
        }}
        className="mx-auto mt-3 flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-extrabold text-slate-700 shadow-md ring-2 ring-white transition active:scale-95"
      >
        {mode === "num" ? <><Music2 className="size-4 text-purple-500" /> Switch to Music</> : <><Hash className="size-4 text-pink-500" /> Switch to 123</>}
      </button>

      {/* Keypad */}
      <div className="mt-3 grid grid-cols-3 gap-2.5 px-1">
        {keys.map((k, i) => {
          const c = keyColors[i];
          const isPressed = pressed === k;
          return (
            <button
              key={k}
              onClick={() => pressKey(k)}
              className="relative flex aspect-square items-center justify-center rounded-2xl text-white shadow-[0_4px_0_rgba(0,0,0,0.2)] ring-2 ring-white/80 transition active:translate-y-1 active:shadow-[0_0_0_rgba(0,0,0,0.2)]"
              style={{
                background: `linear-gradient(135deg, ${c}, ${c}cc)`,
                transform: isPressed ? "scale(0.92)" : undefined,
              }}
            >
              <span className="melly-title leading-none" style={{ fontSize: "1.9rem", textShadow: "0 2px 0 rgba(0,0,0,0.25)" }}>
                {mode === "num" ? k : ["🎵", "🎶", "🎸", "🎺", "🥁", "🎷", "🎹", "🎻", "🪈", "🎤", "🔔", "🎼"][i]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action row */}
      <div className="mt-3 grid grid-cols-3 gap-2 px-1 pb-1">
        <button onClick={back} className="flex items-center justify-center gap-1 rounded-2xl bg-white py-2 text-sm font-extrabold text-slate-700 shadow ring-2 ring-white active:scale-95">
          <Delete className="size-4" /> Back
        </button>
        <button onClick={call} className="flex items-center justify-center gap-1 rounded-2xl bg-emerald-500 py-2 text-sm font-extrabold text-white shadow ring-2 ring-white active:scale-95">
          <Phone className="size-4" /> Call
        </button>
        <button
          onClick={() => { setDisplay(""); setBearHidden(false); tone(220, 0.08, "square", 0.1); }}
          className="flex items-center justify-center gap-1 rounded-2xl bg-rose-400 py-2 text-sm font-extrabold text-white shadow ring-2 ring-white active:scale-95"
        >
          <Sparkles className="size-4" /> Clear
        </button>
      </div>
    </div>
  );
}

/* ===================== SCREEN 2: CHAT ===================== */
type Msg = { from: "me" | "bear"; text: string; emoji?: string };
const KID_PROMPTS: { text: string; reply: string; emoji?: string }[] = [
  { text: "Hi Melly! How are you? 🐻", reply: "I'm super happy to see you! 🌈", emoji: "👋" },
  { text: "Let's sing a song! 🎵", reply: "Twinkle twinkle little star ⭐", emoji: "🎤" },
  { text: "Can we play? 🎮", reply: "Yay! Let's play hide and seek! 🙈", emoji: "🎲" },
  { text: "I love you Melly! ❤️", reply: "I love you too, sweetie! 🥰", emoji: "💖" },
  { text: "Tell me a joke! 😂", reply: "Why do bears wear fur coats? Because they look silly in jackets! 😆", emoji: "🤣" },
  { text: "I'm hungry 🍪", reply: "Yum! Let's eat honey and cookies! 🍯🍪", emoji: "🍕" },
  { text: "Good night Melly 🌙", reply: "Sweet dreams little star! 😴✨", emoji: "🛏️" },
  { text: "Dance with me! 💃", reply: "Boogie boogie! Shake your paws! 🕺", emoji: "🪩" },
];

function ChatScreen() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bear", text: "Hi friend! Tap a message to chat with me! 🐻" },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  function send(p: typeof KID_PROMPTS[number]) {
    tone(660, 0.1, "triangle", 0.15);
    setMsgs((m) => [...m, { from: "me", text: p.text, emoji: p.emoji }]);
    setTimeout(() => {
      tone(880, 0.12, "sine", 0.15);
      setMsgs((m) => [...m, { from: "bear", text: p.reply }]);
      speak(p.reply.replace(/[^\w\s,.!?']/g, ""), "en-US", 0.95, 1.4);
    }, 700);
  }

  return (
    <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-[32px] bg-white/95 shadow-[0_10px_0_rgba(0,0,0,0.12)] ring-4 ring-white">
      <div className="flex items-center gap-3 bg-gradient-to-r from-sky-400 to-purple-400 px-4 py-3 text-white">
        <img src={bearFace} alt="" className="size-10 rounded-full bg-white/80 p-1 ring-2 ring-white" />
        <div>
          <div className="font-extrabold leading-tight">Melly Bear</div>
          <div className="text-[11px] font-bold opacity-90">● online</div>
        </div>
      </div>

      <div ref={scrollRef} className="h-[300px] space-y-2 overflow-y-auto bg-gradient-to-b from-yellow-50 to-pink-50 px-3 py-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div
              className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm font-bold shadow ${
                m.from === "me"
                  ? "rounded-br-sm bg-sky-400 text-white"
                  : "rounded-bl-sm bg-white text-slate-700 ring-1 ring-pink-100"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-pink-100 bg-white p-2">
        <div className="mb-1 px-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Tap to say</div>
        <div className="flex flex-wrap gap-1.5">
          {KID_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => send(p)}
              className="flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-200 to-yellow-200 px-3 py-1.5 text-xs font-extrabold text-slate-700 shadow ring-1 ring-white transition active:scale-95"
            >
              <Send className="size-3" /> {p.text.length > 22 ? p.text.slice(0, 20) + "…" : p.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===================== SCREEN 3: VIDEO CALL ===================== */
type Action = "idle" | "entering" | "hello" | "smile" | "laugh" | "cry" | "dance" | "funny";

// Simple kid-friendly dance loop (C major arpeggio)
const DANCE_NOTES = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 659.25];

function VideoScreen() {
  const [calling, setCalling] = useState(false);
  const [action, setAction] = useState<Action>("idle");
  const [duration, setDuration] = useState(0);
  const danceTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!calling) return;
    const t = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(t);
  }, [calling]);

  // Background dance music — runs only while action === "dance"
  useEffect(() => {
    if (danceTimer.current) {
      clearInterval(danceTimer.current);
      danceTimer.current = null;
    }
    if (action === "dance") {
      let i = 0;
      danceTimer.current = setInterval(() => {
        tone(DANCE_NOTES[i % DANCE_NOTES.length], 0.18, "triangle", 0.15);
        if (i % 2 === 0) tone(120, 0.08, "square", 0.18);
        i++;
      }, 230);
    }
    return () => {
      if (danceTimer.current) {
        clearInterval(danceTimer.current);
        danceTimer.current = null;
      }
    };
  }, [action]);

  function startCall() {
    setCalling(true);
    setDuration(0);
    setAction("entering");
    tone(700, 0.2);
    setTimeout(() => tone(900, 0.25), 220);
    setTimeout(() => {
      setAction("hello");
      speak("Hello! Hello my friend! I'm so happy to see you!", "en-US", 0.95, 1.4);
    }, 1400);
  }
  function endCall() {
    window.speechSynthesis?.cancel();
    setCalling(false);
    setAction("idle");
    tone(400, 0.18, "square", 0.15);
  }
  function doAction(a: Action, line: string, freq: number) {
    setAction(a);
    tone(freq, 0.18, "triangle", 0.18);
    speak(line, "en-US", 0.95, 1.5);
  }

  const mm = String(Math.floor(duration / 60)).padStart(2, "0");
  const ss = String(duration % 60).padStart(2, "0");

  return (
    <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-[32px] bg-slate-900 shadow-[0_10px_0_rgba(0,0,0,0.2)] ring-4 ring-white">
      {/* Video stage */}
      <div className="relative h-[340px] overflow-hidden bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-400">
        {!calling ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <img src={bearFace} alt="" className="size-32 drop-shadow-2xl bear-bounce" />
            <div className="text-center">
              <div className="text-xl font-extrabold text-white drop-shadow">Melly Bear</div>
              <div className="text-xs font-bold text-white/80">Tap to video call</div>
            </div>
            <button
              onClick={startCall}
              className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-base font-extrabold text-white shadow-[0_6px_0_rgba(0,0,0,0.25)] ring-2 ring-white transition active:translate-y-1 active:shadow-none"
            >
              <Video className="size-5" /> Start Call
            </button>
          </div>
        ) : (
          <>
            <BearActor action={action} />
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs font-extrabold text-white backdrop-blur-sm">
              <span className="size-2 animate-pulse rounded-full bg-red-500" /> LIVE {mm}:{ss}
            </div>
            <div className="absolute right-3 top-3 rounded-2xl bg-black/40 px-2 py-1 text-[10px] font-extrabold text-white backdrop-blur-sm">
              You
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="bg-slate-800 p-3">
        {calling ? (
          <>
            <div className="mb-2 grid grid-cols-5 gap-2">
              <ActionBtn icon={<Smile className="size-5" />} label="Smile" color="#ffd23f" onClick={() => doAction("smile", "Hehe, you make me smile!", 700)} />
              <ActionBtn icon={<Laugh className="size-5" />} label="Laugh" color="#ff6b6b" onClick={() => doAction("laugh", "Ha ha ha ha! That's so funny!", 800)} />
              <ActionBtn icon={<Frown className="size-5" />} label="Cry" color="#4ac6e8" onClick={() => doAction("cry", "Boo hoo, I'm sad! Hug me please!", 350)} />
              <ActionBtn icon={<Music2 className="size-5" />} label="Dance" color="#b78ce8" onClick={() => doAction("dance", "La la la! Dance with me!", 900)} />
              <ActionBtn icon={<Sparkles className="size-5" />} label="Funny" color="#6dd47e" onClick={() => doAction("funny", "Wobble wobble! Silly bear!", 1000)} />
            </div>
            <button
              onClick={endCall}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-2.5 text-base font-extrabold text-white shadow ring-2 ring-white active:scale-95"
            >
              <PhoneOff className="size-5" /> End Call
            </button>
          </>
        ) : (
          <div className="text-center text-xs font-bold text-white/70">
            Start the call to play with Melly
          </div>
        )}
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, color, onClick }: { icon: React.ReactNode; label: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-0.5 rounded-2xl py-2 text-[10px] font-extrabold text-white shadow ring-2 ring-white/30 transition active:scale-90"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
    >
      {icon}
      {label}
    </button>
  );
}

/* Animated bear actor — pure CSS / SVG motion, no emoji */
function BearActor({ action }: { action: Action }) {
  const bearRef = useRef<HTMLDivElement>(null);

  // Funny mode: play laugh sound each time bear hits a wall
  useEffect(() => {
    if (action !== "funny") return;
    const el = bearRef.current;
    if (!el) return;
    let hitLeft = true;
    const onIter = () => {
      tone(hitLeft ? 880 : 1100, 0.12, "triangle", 0.2);
      setTimeout(() => tone(hitLeft ? 660 : 990, 0.18, "triangle", 0.18), 90);
      hitLeft = !hitLeft;
    };
    el.addEventListener("animationiteration", onIter);
    return () => el.removeEventListener("animationiteration", onIter);
  }, [action]);

  const config: Record<Action, { img: string; bg: string; caption: string; animation?: string }> = {
    idle:     { img: bearHello, bg: "transparent",            caption: "" },
    entering: { img: bearHello, bg: "transparent",            caption: "",                   animation: "bearEnter 1s ease-out forwards" },
    hello:    { img: bearHello, bg: "rgba(255,255,255,0.15)", caption: "Hello, friend!",     animation: "bearWave 1.2s ease-in-out infinite" },
    smile:    { img: bearSmile, bg: "rgba(255,210,63,0.25)",  caption: "You make me smile!", animation: "bearSmileBounce 0.7s ease-in-out infinite" },
    laugh:    { img: bearLaugh, bg: "rgba(255,107,107,0.25)", caption: "Hahahaha!",          animation: "bearLaugh 0.35s ease-in-out infinite" },
    cry:      { img: bearCry,   bg: "rgba(74,198,232,0.3)",   caption: "Boo hoo...",         animation: "bearCrySway 1.6s ease-in-out infinite" },
    dance:    { img: bearDance, bg: "rgba(183,140,232,0.35)", caption: "La la la!",          animation: "bearDanceRoam 3.2s ease-in-out infinite" },
    funny:    { img: bearFunny, bg: "rgba(109,212,126,0.3)",  caption: "Silly bear!",        animation: "bearFunnyWall 2.4s ease-in-out infinite" },
  };
  const cur = config[action];

  return (
    <div className="absolute inset-0" style={{ background: cur.bg, transition: "background 0.4s" }}>
      <div
        ref={bearRef}
        className="absolute left-1/2 bottom-6"
        style={{
          width: 180,
          height: 180,
          marginLeft: -90,
          animation: cur.animation,
          willChange: "transform",
        }}
      >
        <img
          key={action}
          src={cur.img}
          alt=""
          className="size-full drop-shadow-2xl animate-scale-in"
          style={{ objectFit: "contain" }}
        />

        {action === "cry" && (
          <>
            <span className="tear tear-l" />
            <span className="tear tear-r" />
            <span className="tear tear-l" style={{ animationDelay: "0.6s" }} />
            <span className="tear tear-r" style={{ animationDelay: "0.9s" }} />
          </>
        )}

        {action === "funny" && (
          <div className="dizzy-birds">
            <Bird style={{ animationDelay: "0s" }} />
            <Bird style={{ animationDelay: "-0.4s" }} />
            <Bird style={{ animationDelay: "-0.8s" }} />
          </div>
        )}
      </div>

      {cur.caption && (
        <div className="absolute left-1/2 top-4 -translate-x-1/2 animate-fade-in rounded-full bg-white px-4 py-1.5 text-base font-extrabold text-pink-500 shadow-lg">
          {cur.caption}
        </div>
      )}

      <style>{`
        @keyframes bearEnter        { 0% { transform: translateX(-140%);} 100% { transform: translateX(0);} }
        @keyframes bearWave         { 0%,100% { transform: rotate(-4deg);} 50% { transform: rotate(6deg);} }

        @keyframes bearSmileBounce  { 0%,100% { transform: translateY(0)     scale(1);}
                                      50%     { transform: translateY(-26px) scale(1.04);} }

        @keyframes bearLaugh        { 0%,100% { transform: translateY(0)    scale(1.05);}
                                      50%     { transform: translateY(-10px) scale(1.1);} }

        @keyframes bearCrySway      { 0%,100% { transform: rotate(-2deg) translateY(0);}
                                      50%     { transform: rotate(2deg)  translateY(4px);} }
        .tear {
          position: absolute;
          width: 10px; height: 14px;
          background: #4ac6e8;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          box-shadow: inset -2px -2px 0 rgba(255,255,255,0.4);
          opacity: 0;
          animation: tearFall 1.4s ease-in infinite;
          top: 70px;
        }
        .tear-l { left: 56px; }
        .tear-r { left: 114px; animation-delay: 0.3s; }
        @keyframes tearFall {
          0%   { transform: translateY(0)   scale(0.6); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateY(90px) scale(1);  opacity: 0; }
        }

        @keyframes bearDanceRoam {
          0%   { transform: translate(0,    0)     rotate(-8deg)  scale(1);}
          15%  { transform: translate(-90px,-40px) rotate(-14deg) scale(0.95);}
          30%  { transform: translate(80px, -80px) rotate(12deg)  scale(1.05);}
          45%  { transform: translate(-70px,-110px)rotate(-10deg) scale(1);}
          60%  { transform: translate(100px,-30px) rotate(14deg)  scale(1.08);}
          75%  { transform: translate(-50px,-60px) rotate(-12deg) scale(0.98);}
          90%  { transform: translate(60px, -10px) rotate(8deg)   scale(1.04);}
          100% { transform: translate(0,    0)     rotate(-8deg)  scale(1);}
        }

        @keyframes bearFunnyWall {
          0%   { transform: translateX(-95px) rotate(-12deg);}
          50%  { transform: translateX( 95px) rotate( 12deg);}
          100% { transform: translateX(-95px) rotate(-12deg);}
        }

        .dizzy-birds {
          position: absolute;
          top: -28px;
          left: 50%;
          width: 120px;
          height: 40px;
          margin-left: -60px;
          pointer-events: none;
        }
        .dizzy-bird {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 22px;
          height: 16px;
          margin: -8px 0 0 -11px;
          animation: birdOrbit 1.2s linear infinite;
        }
        @keyframes birdOrbit {
          0%   { transform: rotate(0deg)   translateX(46px) rotate(0deg);}
          100% { transform: rotate(360deg) translateX(46px) rotate(-360deg);}
        }
        .wing { transform-origin: 50% 50%; animation: wingFlap 0.18s ease-in-out infinite; }
        @keyframes wingFlap { 0%,100% { transform: scaleY(1);} 50% { transform: scaleY(0.3);} }
      `}</style>
    </div>
  );
}

function Bird({ style }: { style?: React.CSSProperties }) {
  return (
    <svg className="dizzy-bird" viewBox="0 0 22 16" style={style} aria-hidden>
      <g fill="#1f2937">
        <ellipse cx="11" cy="10" rx="4" ry="3" />
        <polygon className="wing" points="3,4 11,9 11,11" />
        <polygon className="wing" points="19,4 11,9 11,11" />
      </g>
    </svg>
  );
}


