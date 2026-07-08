import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Rocket, Sparkles } from "lucide-react";
import bearFace from "@/assets/icons/bear-face.png";

import favAnimals from "@/assets/onboarding/fav-animals.png";
import favStories from "@/assets/onboarding/fav-stories.png";
import favColors from "@/assets/onboarding/fav-colors.png";
import favMusic from "@/assets/onboarding/fav-music.png";
import favGames from "@/assets/onboarding/fav-games.png";
import favScience from "@/assets/onboarding/fav-science.png";
import favSports from "@/assets/onboarding/fav-sports.png";
import favSpace from "@/assets/onboarding/fav-space.png";

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
  glow: string;
}[] = [
  { id: "tiny",   title: "Tiny Tots",       range: "2 – 3 yrs",  subtitle: "Colors • Shapes • Animals",      emoji: "🌟", glow: "#ffb84a" },
  { id: "little", title: "Little Learners", range: "3 – 5 yrs",  subtitle: "ABC • Numbers • Phonics",        emoji: "🌈", glow: "#4dd4c4" },
  { id: "smart",  title: "Smart Kids",      range: "5 – 8 yrs",  subtitle: "Stories • Science • Games",      emoji: "🧠", glow: "#ff6ea8" },
  { id: "young",  title: "Young Explorers", range: "8 – 10 yrs", subtitle: "Quiz • AI Tutor • Explore",      emoji: "🚀", glow: "#8b6bff" },
];

const FAVOURITES: { id: Fav; label: string; img: string; glow: string }[] = [
  { id: "animals", label: "Animals", img: favAnimals, glow: "#ffa833" },
  { id: "stories", label: "Stories", img: favStories, glow: "#c48bff" },
  { id: "colors",  label: "Colors",  img: favColors,  glow: "#ff7ab8" },
  { id: "music",   label: "Music",   img: favMusic,   glow: "#ff5c9e" },
  { id: "games",   label: "Games",   img: favGames,   glow: "#ff6b5b" },
  { id: "science", label: "Science", img: favScience, glow: "#4dd4c4" },
  { id: "sports",  label: "Sports",  img: favSports,  glow: "#ffd23f" },
  { id: "space",   label: "Space",   img: favSpace,   glow: "#8b6bff" },
];

// -------- Shared UI --------

const BG = "linear-gradient(160deg,#1a0b3d 0%,#4a1466 35%,#a01f6b 65%,#ff8a4c 100%)";

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden" style={{ background: BG }}>
      {/* aurora glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-[#ff5c9e] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 size-80 rounded-full bg-[#4dd4c4] opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 size-72 rounded-full bg-[#ffb84a] opacity-30 blur-3xl" />
      {/* twinkles */}
      {[
        [12, 18], [78, 10], [30, 40], [88, 55], [8, 62], [55, 78], [70, 88], [22, 88],
      ].map(([x, y], i) => (
        <span
          key={i}
          className="pointer-events-none absolute size-1.5 rounded-full bg-white/80 animate-pulse"
          style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 300}ms`, boxShadow: "0 0 8px rgba(255,255,255,0.9)" }}
        />
      ))}
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  );
}

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === step ? "w-8 bg-[#4dd4c4] shadow-[0_0_10px_#4dd4c4]" : i < step ? "w-3 bg-white/70" : "w-3 bg-white/25"
          }`}
        />
      ))}
    </div>
  );
}

function Heading({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-center text-3xl font-black leading-tight text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.35)]">
      {children}
    </h1>
  );
}

function GlowButton({
  onClick,
  disabled,
  children,
  tone = "mint",
  full,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  tone?: "mint" | "peach" | "ghost";
  full?: boolean;
}) {
  const tones = {
    mint:  { bg: "linear-gradient(180deg,#5ee8d3,#2ab19a)", glow: "rgba(77,212,196,0.55)", text: "#062a25" },
    peach: { bg: "linear-gradient(180deg,#ffb27a,#ff6a4c)", glow: "rgba(255,138,76,0.55)",  text: "#3a0f00" },
    ghost: { bg: "rgba(255,255,255,0.12)", glow: "rgba(255,255,255,0.15)", text: "#ffffff" },
  }[tone];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex h-14 items-center justify-center gap-2 rounded-2xl px-6 font-black uppercase tracking-wider transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
        full ? "w-full" : ""
      }`}
      style={{
        background: tones.bg,
        color: tones.text,
        boxShadow: `0 10px 30px -6px ${tones.glow}, inset 0 1px 0 rgba(255,255,255,0.35)`,
        border: tone === "ghost" ? "1px solid rgba(255,255,255,0.25)" : "none",
      }}
    >
      {children}
    </button>
  );
}

function BearHeader() {
  return (
    <div className="relative flex justify-center">
      <div className="absolute inset-0 -z-10 mx-auto size-24 rounded-full bg-[#4dd4c4]/40 blur-2xl" />
      <img src={bearFace} alt="Melly" className="size-20 drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] bear-bounce" />
    </div>
  );
}

// -------- Flow --------

function WelcomeFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState<AgeGroup | null>(null);
  const [favs, setFavs] = useState<Fav[]>([]);
  const [parent, setParent] = useState("");
  const [phone, setPhone] = useState("");

  const displayName = name.trim() || "your child";
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

  // ---- Step 0: Intro ----
  if (step === 0) {
    return (
      <Shell>
        <div className="flex flex-1 flex-col items-center justify-between px-6 pt-14 pb-10 text-white">
          <div className="flex flex-col items-center gap-5">
            <BearHeader />
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#4dd4c4] ring-1 ring-white/20 backdrop-blur">
              <Sparkles className="size-3.5" /> Melly Kids TV
            </span>
            <Heading>
              A tiny universe of<br />
              <span className="bg-gradient-to-r from-[#4dd4c4] via-[#ffd23f] to-[#ff7ab8] bg-clip-text text-transparent">
                learning, made playful.
              </span>
            </Heading>
            <p className="max-w-xs text-center text-sm font-semibold text-white/80">
              Tell us about your little explorer and we'll shape everything just for them.
            </p>
          </div>

          <div className="w-full rounded-3xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-xl">
            <p className="mb-3 text-center text-[11px] font-black uppercase tracking-[0.25em] text-white/60">
              Made for ages 2 – 10
            </p>
            <div className="grid grid-cols-2 gap-2">
              {AGE_GROUPS.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center gap-2 rounded-2xl bg-white/8 px-3 py-2 ring-1 ring-white/15"
                  style={{ boxShadow: `inset 0 0 0 1px ${g.glow}22` }}
                >
                  <span className="text-xl">{g.emoji}</span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[13px] font-black text-white">{g.title}</span>
                    <span className="text-[10px] font-bold text-white/60">{g.range}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <GlowButton onClick={() => setStep(1)} tone="mint" full>
            Begin the Journey <Rocket className="size-5" />
          </GlowButton>
        </div>
      </Shell>
    );
  }

  // ---- Step 1: Name ----
  if (step === 1) {
    return (
      <Shell>
        <div className="flex flex-1 flex-col px-6 pt-12 pb-10 text-white">
          <div className="flex flex-col items-center gap-4">
            <BearHeader />
            <StepDots step={0} total={4} />
            <Heading>What should we call your little one?</Heading>
            <p className="text-sm font-semibold text-white/75">We'll personalise everything with their name.</p>
          </div>

          <div className="mt-10">
            <label className="mb-2 block px-2 text-[11px] font-black uppercase tracking-[0.25em] text-white/60">
              Child's name
            </label>
            <div
              className="rounded-3xl bg-white/10 p-1 ring-1 ring-white/20 backdrop-blur-xl"
              style={{ boxShadow: "0 20px 40px -20px rgba(77,212,196,0.5)" }}
            >
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sunny"
                className="h-14 w-full rounded-[20px] bg-transparent px-5 text-xl font-black text-white placeholder:text-white/40 outline-none"
              />
            </div>
          </div>

          <div className="mt-auto flex items-center gap-3 pt-10">
            <GlowButton onClick={() => setStep(0)} tone="ghost">
              <ArrowLeft className="size-5" /> Back
            </GlowButton>
            <div className="flex-1">
              <GlowButton onClick={() => setStep(2)} tone="mint" disabled={!name.trim()} full>
                Next <ArrowRight className="size-5" />
              </GlowButton>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  // ---- Step 2: Age ----
  if (step === 2) {
    return (
      <Shell>
        <div className="flex flex-1 flex-col px-6 pt-12 pb-8 text-white">
          <div className="flex flex-col items-center gap-3">
            <BearHeader />
            <StepDots step={1} total={4} />
            <Heading>How old is {name.trim() || "your star"}?</Heading>
            <p className="text-sm font-semibold text-white/75">We'll tune the content for their age.</p>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3">
            {AGE_GROUPS.map((g) => {
              const selected = age === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setAge(g.id)}
                  className="group relative flex items-center gap-4 rounded-3xl bg-white/10 p-4 text-left ring-1 ring-white/15 backdrop-blur-xl transition-all active:scale-[0.98]"
                  style={{
                    boxShadow: selected
                      ? `0 0 0 2px ${g.glow}, 0 15px 40px -10px ${g.glow}90`
                      : "0 10px 30px -20px rgba(0,0,0,0.5)",
                  }}
                >
                  <div
                    className="flex size-14 items-center justify-center rounded-2xl text-3xl"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${g.glow}, ${g.glow}66)`,
                      boxShadow: `0 8px 20px -6px ${g.glow}90, inset 0 1px 0 rgba(255,255,255,0.4)`,
                    }}
                  >
                    {g.emoji}
                  </div>
                  <div className="flex flex-1 flex-col leading-tight">
                    <span className="text-lg font-black text-white">{g.title}</span>
                    <span className="text-xs font-bold text-white/60">{g.range}</span>
                    <span className="mt-0.5 text-[11px] font-semibold text-white/70">{g.subtitle}</span>
                  </div>
                  <div
                    className={`flex size-7 items-center justify-center rounded-full border-2 transition ${
                      selected ? "border-white bg-white text-slate-900" : "border-white/40"
                    }`}
                  >
                    {selected && <Check className="size-4" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-auto flex items-center gap-3 pt-6">
            <GlowButton onClick={() => setStep(1)} tone="ghost">
              <ArrowLeft className="size-5" /> Back
            </GlowButton>
            <div className="flex-1">
              <GlowButton onClick={() => setStep(3)} tone="mint" disabled={!age} full>
                Next <ArrowRight className="size-5" />
              </GlowButton>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  // ---- Step 3: Favourites (3D images) ----
  if (step === 3) {
    return (
      <Shell>
        <div className="flex flex-1 flex-col px-5 pt-12 pb-8 text-white">
          <div className="flex flex-col items-center gap-3">
            <BearHeader />
            <StepDots step={2} total={4} />
            <Heading>What does {name.trim() || "your child"} love most?</Heading>
            <p className="text-sm font-semibold text-white/75">Tap any favourites — pick a few or all!</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {FAVOURITES.map((f) => {
              const selected = favs.includes(f.id);
              return (
                <button
                  key={f.id}
                  onClick={() => toggleFav(f.id)}
                  className="group relative flex flex-col items-center gap-2 rounded-3xl bg-white/10 p-3 pt-4 ring-1 ring-white/15 backdrop-blur-xl transition-all active:scale-95"
                  style={{
                    boxShadow: selected
                      ? `0 0 0 2px ${f.glow}, 0 18px 40px -10px ${f.glow}aa`
                      : "0 10px 30px -20px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="relative flex size-24 items-center justify-center">
                    <div
                      className="absolute inset-2 rounded-full blur-2xl transition-opacity"
                      style={{ background: f.glow, opacity: selected ? 0.75 : 0.35 }}
                    />
                    <img
                      src={f.img}
                      alt={f.label}
                      loading="lazy"
                      width={512}
                      height={512}
                      className={`relative size-24 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] transition-transform ${
                        selected ? "scale-110" : "group-active:scale-95"
                      }`}
                    />
                  </div>
                  <span className="text-sm font-black text-white">{f.label}</span>
                  {selected && (
                    <span
                      className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-white text-slate-900"
                      style={{ boxShadow: `0 4px 12px ${f.glow}` }}
                    >
                      <Check className="size-4" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-auto flex items-center gap-3 pt-6">
            <GlowButton onClick={() => setStep(2)} tone="ghost">
              <ArrowLeft className="size-5" /> Back
            </GlowButton>
            <div className="flex-1">
              <GlowButton onClick={() => setStep(4)} tone="mint" full>
                Next <ArrowRight className="size-5" />
              </GlowButton>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  // ---- Step 4: All set ----
  return (
    <Shell>
      <div className="flex flex-1 flex-col px-6 pt-12 pb-8 text-white">
        <div className="flex flex-col items-center gap-3">
          <BearHeader />
          <StepDots step={3} total={4} />
          <span className="inline-flex items-center gap-2 rounded-full bg-[#4dd4c4]/20 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-[#4dd4c4] ring-1 ring-[#4dd4c4]/40">
            <Sparkles className="size-3.5" /> All Set!
          </span>
          <Heading>
            Welcome,{" "}
            <span className="bg-gradient-to-r from-[#ffd23f] via-[#ff7ab8] to-[#4dd4c4] bg-clip-text text-transparent">
              {displayName}
            </span>
            !
          </Heading>
        </div>

        <div
          className="mt-5 rounded-3xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-xl"
          style={{ boxShadow: "0 20px 50px -20px rgba(77,212,196,0.35)" }}
        >
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.25em] text-[#4dd4c4]">Profile</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-3 border-b border-white/10 pb-2">
              <span className="font-semibold text-white/60">Name</span>
              <span className="font-black text-white">{displayName}</span>
            </div>
            <div className="flex justify-between gap-3 border-b border-white/10 pb-2">
              <span className="font-semibold text-white/60">Age Group</span>
              <span className="font-black text-white">{activeAge?.title ?? "—"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="font-semibold text-white/60">Loves</span>
              <span className="text-right font-black text-white">
                {favs.length === 0
                  ? "Everything!"
                  : favs.map((f) => FAVOURITES.find((x) => x.id === f)!.label).join(" • ")}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-1 text-center text-[11px] font-black uppercase tracking-[0.25em] text-white/60">
            Parent Details · Optional
          </p>
          <p className="mb-3 text-center text-xs font-semibold text-white/50">For weekly progress reports</p>
          <div className="space-y-2">
            <input
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              placeholder="Parent's name"
              className="h-12 w-full rounded-2xl bg-white/10 px-5 text-base font-bold text-white placeholder:text-white/40 ring-1 ring-white/20 outline-none backdrop-blur focus:ring-2 focus:ring-[#4dd4c4]"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="WhatsApp number"
              inputMode="tel"
              className="h-12 w-full rounded-2xl bg-white/10 px-5 text-base font-bold text-white placeholder:text-white/40 ring-1 ring-white/20 outline-none backdrop-blur focus:ring-2 focus:ring-[#4dd4c4]"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <GlowButton onClick={finish} tone="peach" full>
            <Rocket className="size-5" /> Let's Start Learning
          </GlowButton>
          <button
            onClick={() => {
              setParent("");
              setPhone("");
              finish();
            }}
            className="text-xs font-black uppercase tracking-[0.2em] text-white/60 underline underline-offset-4"
          >
            Skip parent details →
          </button>
        </div>
      </div>
    </Shell>
  );
}
