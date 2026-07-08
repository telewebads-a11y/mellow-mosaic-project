import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Rocket, Sparkles, Rainbow, Brain, Baby, PartyPopper } from "lucide-react";
import bearFace from "@/assets/icons/bear-face.png";
import bgClouds from "@/assets/bg-clouds.jpg";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — Melly Kids TV" },
      { name: "description", content: "Set up your child's profile to personalise Melly Kids TV." },
    ],
  }),
  component: WelcomeFlow,
});

type AgeGroup = "tiny" | "little" | "smart" | "young";
type Fav = "animals" | "stories" | "colors" | "music" | "games" | "science" | "sports" | "space";

const AGE_GROUPS: {
  id: AgeGroup;
  title: string;
  range: string;
  subtitle: string;
  emoji: string;
  bg: string;
  text: string;
}[] = [
  { id: "tiny",   title: "Tiny Tots",       range: "2 – 3 Years",  subtitle: "Colors, Shapes & Animals",   emoji: "🌟", bg: "#ffd1dc", text: "#c2185b" },
  { id: "little", title: "Little Learners", range: "3 – 5 Years",  subtitle: "ABC, Numbers & Phonics",     emoji: "🌈", bg: "#b8e6f0", text: "#0277a8" },
  { id: "smart",  title: "Smart Kids",      range: "5 – 8 Years",  subtitle: "Stories, Science & Games",   emoji: "🧠", bg: "#c4ebb0", text: "#2e7d32" },
  { id: "young",  title: "Young Explorers", range: "8 – 10 Years", subtitle: "Quiz, AI Tutor & Explore World", emoji: "🚀", bg: "#ffd76a", text: "#a86b00" },
];

const FAVOURITES: { id: Fav; label: string; emoji: string }[] = [
  { id: "animals", label: "Animals", emoji: "🦁" },
  { id: "stories", label: "Stories", emoji: "📖" },
  { id: "colors",  label: "Colors",  emoji: "🎨" },
  { id: "music",   label: "Music",   emoji: "🎵" },
  { id: "games",   label: "Games",   emoji: "🎮" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "sports",  label: "Sports",  emoji: "⚽" },
  { id: "space",   label: "Space",   emoji: "🚀" },
];

function RainbowTitle({ text, className = "" }: { text: string; className?: string }) {
  const palette = ["#ff6b6b", "#ffb347", "#ffd23f", "#6dd47e", "#4ac6e8", "#b78ce8"];
  return (
    <h1 className={`melly-title leading-tight ${className}`}>
      {text.split("").map((ch, i) => (
        <span key={i} style={{ color: ch === " " ? undefined : palette[i % palette.length] }}>
          {ch}
        </span>
      ))}
    </h1>
  );
}

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-2 rounded-full transition-all ${i === step ? "w-8 bg-[#4ac6e8]" : "w-2 bg-white/70 ring-1 ring-slate-300"}`}
        />
      ))}
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${bgClouds})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* soft overlay */}
      <div className="pointer-events-none absolute inset-0 bg-white/10" />
      {/* floating deco */}
      <div className="pointer-events-none absolute -left-10 top-24 size-32 rounded-full bg-white/40 blur-2xl" />
      <div className="pointer-events-none absolute -right-8 top-48 size-24 rounded-full bg-white/50 blur-xl" />
      <div className="pointer-events-none absolute left-8 bottom-40 size-28 rounded-full bg-white/40 blur-2xl" />
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  );
}

function PrimaryButton({
  onClick,
  disabled,
  children,
  color = "#ff8e3c",
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group relative flex h-14 flex-1 items-center justify-center rounded-full px-6 font-black uppercase tracking-wider text-white ring-4 ring-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        background: `linear-gradient(180deg, ${color}, color-mix(in oklab, ${color} 70%, black))`,
        boxShadow: `0 10px 24px -6px ${color}80`,
      }}
    >
      <span className="text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]">{children}</span>
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-14 items-center justify-center gap-1 rounded-full bg-white px-5 font-black text-slate-600 shadow-md ring-2 ring-slate-200 transition active:scale-95"
    >
      <ArrowLeft className="size-4" /> Back
    </button>
  );
}

function WelcomeFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState<AgeGroup | null>(null);
  const [favs, setFavs] = useState<Fav[]>([]);
  const [parent, setParent] = useState("");
  const [phone, setPhone] = useState("");

  const displayName = name.trim() || "Friend";
  const activeAge = AGE_GROUPS.find((a) => a.id === age);

  const finish = () => {
    try {
      window.localStorage.setItem(
        "mellyProfile",
        JSON.stringify({ name: name.trim(), age, favs, parent, phone, createdAt: Date.now() }),
      );
    } catch {}
    navigate({ to: "/" });
  };

  const toggleFav = (id: Fav) =>
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  // Step 1 — Intro
  if (step === 0) {
    return (
      <Shell>
        <div className="flex flex-1 flex-col items-center justify-between px-6 pt-10 pb-10">
          <div className="flex flex-col items-center gap-4">
            <img
              src={bearFace}
              alt="Melly Bear"
              className="size-32 drop-shadow-[0_15px_25px_rgba(0,0,0,0.25)] bear-bounce"
            />
            <RainbowTitle text="Welcome to" className="text-4xl text-center" />
            <RainbowTitle text="Melly Kids TV!" className="text-5xl text-center" />
            <p className="mt-1 flex items-center gap-2 text-base font-extrabold text-slate-700">
              <Sparkles className="size-5 text-amber-500" /> Learn, Play &amp; Grow Every Day!{" "}
              <Sparkles className="size-5 text-amber-500" />
            </p>
          </div>

          <div className="w-full rounded-3xl bg-white/85 p-5 shadow-xl ring-2 ring-white backdrop-blur">
            <ul className="space-y-3 text-lg font-extrabold text-slate-800">
              <li className="flex items-center gap-3"><span className="text-2xl">👶</span> Tiny Tots <span className="text-slate-500">(2-3)</span></li>
              <li className="flex items-center gap-3"><span className="text-2xl">🌈</span> Little Learners <span className="text-slate-500">(3-5)</span></li>
              <li className="flex items-center gap-3"><span className="text-2xl">🧠</span> Smart Kids <span className="text-slate-500">(5-8)</span></li>
              <li className="flex items-center gap-3"><span className="text-2xl">🚀</span> Young Explorers <span className="text-slate-500">(8-10)</span></li>
            </ul>
            <p className="mt-4 text-center text-sm font-bold text-slate-600">
              Tell us about your child and we'll personalise everything just for them!
            </p>
          </div>

          <PrimaryButton onClick={() => setStep(1)}>
            Let's Get Started! 🚀
          </PrimaryButton>
        </div>
      </Shell>
    );
  }

  // Step 2 — Name
  if (step === 1) {
    return (
      <Shell>
        <div className="flex flex-1 flex-col px-6 pt-10 pb-10">
          <div className="flex flex-col items-center gap-3">
            <img src={bearFace} alt="Bear" className="size-24 bear-bounce drop-shadow-lg" />
            <StepDots step={0} total={4} />
            <div className="text-6xl animate-bounce">👶</div>
            <RainbowTitle text="What's your child's name?" className="text-3xl text-center mt-2" />
            <p className="text-base font-bold text-slate-700">We'll use this to personalise the app!</p>
          </div>

          <div className="mt-8 w-full">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your name…"
              className="h-16 w-full rounded-full bg-white px-6 text-xl font-extrabold text-slate-800 placeholder:text-slate-400 shadow-lg ring-2 ring-white outline-none focus:ring-4 focus:ring-[#4ac6e8]"
            />
          </div>

          <div className="mt-auto flex items-center gap-3 pt-8">
            <BackButton onClick={() => setStep(0)} />
            <PrimaryButton color="#3ba9e0" disabled={!name.trim()} onClick={() => setStep(2)}>
              Next <ArrowRight className="ml-1 inline size-5" />
            </PrimaryButton>
          </div>
        </div>
      </Shell>
    );
  }

  // Step 3 — Age
  if (step === 2) {
    return (
      <Shell>
        <div className="flex flex-1 flex-col px-6 pt-10 pb-8">
          <div className="flex flex-col items-center gap-3">
            <img src={bearFace} alt="Bear" className="size-24 bear-bounce drop-shadow-lg" />
            <StepDots step={1} total={4} />
            <RainbowTitle text={`How old is ${displayName}?`} className="text-3xl text-center mt-2" />
            <p className="text-base font-bold text-slate-700">We'll show the right content for their age!</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {AGE_GROUPS.map((g) => {
              const selected = age === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setAge(g.id)}
                  className={`flex flex-col items-center gap-2 rounded-3xl p-4 text-center shadow-lg ring-2 transition-all active:scale-95 ${
                    selected ? "ring-4 ring-[#4ac6e8] scale-[1.02]" : "ring-white"
                  }`}
                  style={{ background: g.bg, color: g.text }}
                >
                  <span className="text-4xl">{g.emoji}</span>
                  <span className="melly-title text-xl leading-none">{g.title}</span>
                  <span className="text-sm font-black">{g.range}</span>
                  <span className="text-[11px] font-bold opacity-80">{g.subtitle}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto flex items-center gap-3 pt-6">
            <BackButton onClick={() => setStep(1)} />
            <PrimaryButton color="#4ac95a" disabled={!age} onClick={() => setStep(3)}>
              Next <ArrowRight className="ml-1 inline size-5" />
            </PrimaryButton>
          </div>
        </div>
      </Shell>
    );
  }

  // Step 4 — Favourites
  if (step === 3) {
    return (
      <Shell>
        <div className="flex flex-1 flex-col px-6 pt-10 pb-8">
          <div className="flex flex-col items-center gap-3">
            <img src={bearFace} alt="Bear" className="size-24 bear-bounce drop-shadow-lg" />
            <StepDots step={2} total={4} />
            <div className="text-5xl animate-pulse">❤️</div>
            <RainbowTitle text={`What does ${displayName} love most?`} className="text-2xl text-center mt-1" />
            <p className="text-sm font-bold text-slate-700">Pick any favourites! (optional)</p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {FAVOURITES.map((f) => {
              const selected = favs.includes(f.id);
              return (
                <button
                  key={f.id}
                  onClick={() => toggleFav(f.id)}
                  className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl bg-white/90 p-2 shadow-md ring-2 transition active:scale-95 ${
                    selected ? "ring-4 ring-[#b78ce8] bg-[#f3ebff]" : "ring-white"
                  }`}
                >
                  <span className="text-3xl">{f.emoji}</span>
                  <span className="text-xs font-black text-slate-700">{f.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto flex items-center gap-3 pt-6">
            <BackButton onClick={() => setStep(2)} />
            <PrimaryButton color="#8a5cd6" onClick={() => setStep(4)}>
              Next <ArrowRight className="ml-1 inline size-5" />
            </PrimaryButton>
          </div>
        </div>
      </Shell>
    );
  }

  // Step 5 — All Set
  return (
    <Shell>
      <div className="flex flex-1 flex-col px-6 pt-10 pb-8">
        <div className="flex flex-col items-center gap-3">
          <img src={bearFace} alt="Bear" className="size-24 bear-bounce drop-shadow-lg" />
          <div className="relative">
            <PartyPopper className="absolute -left-8 -top-2 size-8 text-amber-500 animate-bounce" />
            <RainbowTitle text="All Set!" className="text-5xl text-center" />
            <PartyPopper className="absolute -right-8 -top-2 size-8 text-pink-500 animate-bounce" />
          </div>
          <p className="text-xl font-black text-slate-800">
            Welcome, <span className="text-[#ff6b6b]">{displayName}</span>! 🐻
          </p>
        </div>

        <div className="mt-5 rounded-3xl bg-white/90 p-4 shadow-lg ring-2 ring-[#ffd76a] backdrop-blur">
          <p className="text-center text-base font-black text-[#7c5cd6]">Your Profile</p>
          <ul className="mt-2 space-y-1.5 text-sm font-bold text-slate-800">
            <li className="flex items-center gap-2"><Baby className="size-4 text-amber-500" /> Name: <span className="font-black">{displayName}</span></li>
            <li className="flex items-center gap-2"><Brain className="size-4 text-emerald-500" /> Age Group: <span className="font-black">{activeAge?.title ?? "—"}</span></li>
            <li className="flex items-center gap-2"><Rainbow className="size-4 text-pink-500" /> Favourites:{" "}
              <span className="font-black">
                {favs.length === 0 ? "All topics!" : favs.map((f) => FAVOURITES.find((x) => x.id === f)!.label).join(", ")}
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-5">
          <p className="text-center text-base font-black text-slate-800">Parent Details (Optional)</p>
          <p className="text-center text-xs font-bold text-slate-500">For weekly progress reports</p>
          <div className="mt-3 space-y-3">
            <input
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              placeholder="Parent's name 👨‍👩‍👧"
              className="h-12 w-full rounded-full bg-white px-5 text-base font-bold text-slate-800 placeholder:text-slate-400 shadow ring-2 ring-white outline-none focus:ring-4 focus:ring-[#4ac6e8]"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="WhatsApp number 📱"
              inputMode="tel"
              className="h-12 w-full rounded-full bg-white px-5 text-base font-bold text-slate-800 placeholder:text-slate-400 shadow ring-2 ring-white outline-none focus:ring-4 focus:ring-[#4ac6e8]"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <PrimaryButton onClick={finish}>
            <Rocket className="mr-2 inline size-5" /> Let's Start Learning!
          </PrimaryButton>
          <button
            onClick={() => {
              setParent("");
              setPhone("");
              finish();
            }}
            className="text-sm font-black text-slate-600 underline underline-offset-4"
          >
            Skip parent details →
          </button>
        </div>
      </div>
    </Shell>
  );
}
