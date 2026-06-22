import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Globe, Medal, ScrollText, Users, Info, FileText, LogOut, User, Volume2, Vibrate, Bell } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Switch } from "@/components/ui/switch";

import bgClouds from "@/assets/bg-clouds.jpg";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Parental & Profile Settings — Melly Kids TV" },
      { name: "description", content: "Manage child profile, language, rewards, certificates and more." },
    ],
  }),
  component: SettingsPage,
});

type Card = {
  label: string;
  icon: ReactNode;
  topColor: string;
  iconBg: string;
  to?: string;
};

const cards: Card[] = [
  { label: "Language",          icon: <Globe className="size-10 text-white" />,      topColor: "from-sky-300 to-sky-400",       iconBg: "from-sky-400 to-sky-600" },
  { label: "My Rewards",        icon: <Medal className="size-10 text-white" />,      topColor: "from-fuchsia-400 to-purple-500", iconBg: "from-amber-300 to-amber-500" },
  { label: "My Certificates",   icon: <ScrollText className="size-10 text-white" />, topColor: "from-orange-300 to-orange-400", iconBg: "from-amber-400 to-orange-500" },
  { label: "Search for Friends",icon: <Users className="size-10 text-white" />,      topColor: "from-violet-400 to-purple-500", iconBg: "from-violet-400 to-purple-600" },
  { label: "About Melly Kids TV", icon: <Info className="size-10 text-white" />,    topColor: "from-emerald-300 to-emerald-400", iconBg: "from-sky-400 to-sky-600" },
  { label: "Terms & Conditions",icon: <FileText className="size-10 text-white" />,   topColor: "from-sky-300 to-blue-400",      iconBg: "from-sky-400 to-blue-600" },
];

function SettingsPage() {
  const navigate = useNavigate();
  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-top"
        style={{ backgroundImage: `url(${bgClouds})` }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-sky-200/40" />

      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <Link
          to="/"
          aria-label="Back"
          className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 shadow-lg ring-4 ring-white active:translate-y-[2px] transition"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-b from-sky-300 to-sky-500 shadow-inner">
            <ArrowLeft className="size-6 text-white" strokeWidth={3} />
          </div>
        </Link>
        <h1 className="melly-title flex-1 text-center leading-tight text-2xl">
          <span style={{ color: "#ff6b6b" }}>P</span>
          <span style={{ color: "#ffb347" }}>a</span>
          <span style={{ color: "#ffd23f" }}>r</span>
          <span style={{ color: "#6dd47e" }}>e</span>
          <span style={{ color: "#4ac6e8" }}>n</span>
          <span style={{ color: "#b78ce8" }}>t</span>
          <span style={{ color: "#ff6b6b" }}>a</span>
          <span style={{ color: "#ffb347" }}>l </span>
          <span style={{ color: "#6dd47e" }}>& </span>
          <span style={{ color: "#4ac6e8" }}>P</span>
          <span style={{ color: "#b78ce8" }}>r</span>
          <span style={{ color: "#ff6b6b" }}>o</span>
          <span style={{ color: "#ffb347" }}>f</span>
          <span style={{ color: "#ffd23f" }}>i</span>
          <span style={{ color: "#6dd47e" }}>l</span>
          <span style={{ color: "#4ac6e8" }}>e</span>
          <br />
          <span style={{ color: "#ff6b6b" }}>S</span>
          <span style={{ color: "#ffb347" }}>e</span>
          <span style={{ color: "#ffd23f" }}>t</span>
          <span style={{ color: "#6dd47e" }}>t</span>
          <span style={{ color: "#4ac6e8" }}>i</span>
          <span style={{ color: "#b78ce8" }}>n</span>
          <span style={{ color: "#ff6b6b" }}>g</span>
          <span style={{ color: "#ffb347" }}>s</span>
        </h1>
        <div className="w-14" />
      </header>

      <main className="px-4 pb-28">
        {/* Profile card */}
        <Link
          to="/profile"
          className="block rounded-3xl bg-gradient-to-b from-sky-100 to-sky-200 p-4 shadow-lg ring-2 ring-white/70 active:translate-y-[2px] transition"
        >
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-b from-amber-200 to-amber-400 shadow-inner ring-4 ring-white">
                <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-b from-orange-100 to-orange-200">
                  <User className="size-12 text-amber-800" strokeWidth={2.4} />
                </div>
              </div>
              <p className="mt-1 text-xs font-extrabold text-amber-900">Profile Photo</p>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-extrabold text-amber-900 drop-shadow-sm">Child Profile</h2>
              <div className="mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 ring-2 ring-amber-200">
                Tap to edit profile
              </div>
            </div>
          </div>
        </Link>

        {/* Toggles */}
        <ToggleRow />


        {/* Grid */}
        <section className="mt-4 grid grid-cols-2 gap-4">
          {cards.map((c) => (
            <button
              key={c.label}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-lg ring-2 ring-white/80 transition active:translate-y-[2px]"
            >
              <div className={`h-20 bg-gradient-to-b ${c.topColor} flex items-end justify-center pb-2`}>
                <div className={`flex size-14 -mb-6 items-center justify-center rounded-2xl bg-gradient-to-b ${c.iconBg} shadow-md ring-2 ring-white`}>
                  {c.icon}
                </div>
              </div>
              <div className="pt-8 pb-3 px-2">
                <p className="text-center text-sm font-extrabold text-amber-900 leading-tight">
                  {c.label}
                </p>
              </div>
            </button>
          ))}
        </section>

        {/* Logout */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate({ to: "/games" })}
            className="flex items-center gap-2 rounded-full bg-gradient-to-b from-rose-400 to-rose-600 px-10 py-3 text-xl font-extrabold text-white shadow-lg ring-4 ring-white active:translate-y-[2px] transition"
          >
            <LogOut className="size-5" />
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}

function ToggleRow() {
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [notif, setNotif] = useState(true);
  const items = [
    { label: "Sound",         icon: <Volume2 className="size-5 text-white" />,  bg: "from-sky-400 to-sky-600",       value: sound,     set: setSound },
    { label: "Vibration",     icon: <Vibrate className="size-5 text-white" />,  bg: "from-violet-400 to-purple-600", value: vibration, set: setVibration },
    { label: "Notifications", icon: <Bell className="size-5 text-white" />,     bg: "from-amber-400 to-orange-500",  value: notif,     set: setNotif },
  ];
  return (
    <section className="mt-4 space-y-2">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow ring-2 ring-white/80">
          <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-b ${i.bg} shadow-inner`}>
            {i.icon}
          </div>
          <span className="flex-1 text-base font-extrabold text-amber-900">{i.label}</span>
          <Switch checked={i.value} onCheckedChange={i.set} className="h-7 w-12 data-[state=checked]:bg-emerald-500" />
        </div>
      ))}
    </section>
  );
}
