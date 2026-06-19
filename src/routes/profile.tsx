import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Camera, Check } from "lucide-react";
import { useRef, useState } from "react";

import bgClouds from "@/assets/bg-clouds.jpg";
import girl1 from "@/assets/avatars/girl-1.png";
import girl2 from "@/assets/avatars/girl-2.png";
import girl3 from "@/assets/avatars/girl-3.png";
import boy1 from "@/assets/avatars/boy-1.png";
import boy2 from "@/assets/avatars/boy-2.png";
import boy3 from "@/assets/avatars/boy-3.png";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Create Kid Profile — Melly Kids TV" },
      { name: "description", content: "Set up your child's profile: name, age, and avatar." },
    ],
  }),
  component: ProfilePage,
});

const presetAvatars = [
  { src: girl1, label: "Girl 1" },
  { src: girl2, label: "Girl 2" },
  { src: girl3, label: "Girl 3" },
  { src: boy1,  label: "Boy 1" },
  { src: boy2,  label: "Boy 2" },
  { src: boy3,  label: "Boy 3" },
];

function ProfilePage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"girl" | "boy" | "">("");
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);

  const activeAvatar = uploaded ?? picked;

  const handleFile = (f: File | null) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    setUploaded(url);
    setPicked(null);
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/settings" });
  };

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-top"
        style={{ backgroundImage: `url(${bgClouds})` }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-sky-200/40" />

      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <Link
          to="/settings"
          aria-label="Back"
          className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 shadow-lg ring-4 ring-white active:translate-y-[2px] transition"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-b from-sky-300 to-sky-500 shadow-inner">
            <ArrowLeft className="size-6 text-white" strokeWidth={3} />
          </div>
        </Link>
        <h1 className="melly-title flex-1 text-center text-3xl leading-tight">
          <span style={{ color: "#ff6b6b" }}>K</span>
          <span style={{ color: "#ffb347" }}>i</span>
          <span style={{ color: "#ffd23f" }}>d </span>
          <span style={{ color: "#6dd47e" }}>P</span>
          <span style={{ color: "#4ac6e8" }}>r</span>
          <span style={{ color: "#b78ce8" }}>o</span>
          <span style={{ color: "#ff6b6b" }}>f</span>
          <span style={{ color: "#ffb347" }}>i</span>
          <span style={{ color: "#ffd23f" }}>l</span>
          <span style={{ color: "#6dd47e" }}>e</span>
        </h1>
        <div className="w-14" />
      </header>

      <form onSubmit={onSave} className="px-4 pb-28 space-y-4">
        {/* Avatar uploader */}
        <section className="rounded-3xl bg-white/90 p-5 shadow-lg ring-2 ring-white/80">
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative flex size-28 items-center justify-center rounded-full bg-gradient-to-b from-amber-200 to-amber-400 ring-4 ring-white shadow-inner overflow-hidden"
            >
              {activeAvatar ? (
                <img src={activeAvatar} alt="Selected avatar" className="size-full object-cover" />
              ) : (
                <Camera className="size-10 text-amber-800" />
              )}
              <span className="absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-full bg-sky-500 text-white shadow ring-2 ring-white">
                <Camera className="size-4" />
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <p className="mt-2 text-sm font-bold text-amber-900">Upload Profile Picture</p>
          </div>

          <p className="mt-4 text-center text-sm font-extrabold text-amber-900">Or choose one</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {presetAvatars.map((a) => {
              const isPicked = picked === a.src && !uploaded;
              return (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => { setPicked(a.src); setUploaded(null); }}
                  className={`relative aspect-square rounded-2xl overflow-hidden ring-4 transition ${isPicked ? "ring-emerald-400" : "ring-white"} bg-gradient-to-b from-sky-100 to-sky-200 shadow`}
                >
                  <img src={a.src} alt={a.label} className="size-full object-contain" loading="lazy" />
                  {isPicked && (
                    <span className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
                      <Check className="size-4" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Details */}
        <section className="rounded-3xl bg-white/90 p-5 shadow-lg ring-2 ring-white/80 space-y-4">
          <div>
            <label className="text-sm font-extrabold text-amber-900">Child's Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              placeholder="e.g. Ava"
              className="mt-1 w-full rounded-2xl border-2 border-sky-200 bg-sky-50 px-4 py-3 text-base font-bold text-amber-900 placeholder:text-amber-400 focus:outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="text-sm font-extrabold text-amber-900">Age</label>
            <input
              required
              type="number"
              min={1}
              max={15}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 5"
              className="mt-1 w-full rounded-2xl border-2 border-sky-200 bg-sky-50 px-4 py-3 text-base font-bold text-amber-900 placeholder:text-amber-400 focus:outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="text-sm font-extrabold text-amber-900">Gender</label>
            <div className="mt-1 grid grid-cols-2 gap-3">
              {(["girl", "boy"] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGender(g)}
                  className={`rounded-2xl px-4 py-3 text-base font-extrabold capitalize ring-2 transition ${
                    gender === g
                      ? "bg-gradient-to-b from-emerald-400 to-emerald-600 text-white ring-white shadow"
                      : "bg-white text-amber-900 ring-sky-200"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="mx-auto flex items-center gap-2 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-10 py-3 text-xl font-extrabold text-white shadow-lg ring-4 ring-white active:translate-y-[2px] transition"
        >
          <Check className="size-6" strokeWidth={3} />
          Save Profile
        </button>
      </form>
    </div>
  );
}
