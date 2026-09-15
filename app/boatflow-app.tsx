"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Anchor, BatteryCharging, BellRing, Check, CheckCircle2, ChevronRight,
  CloudSnow, CloudSun, Flame, Gauge, Home, Lamp, LockKeyhole, Moon,
  Navigation, Pencil, PlugZap, Radio, Save, ShieldCheck, ShipWheel,
  Sparkles, TestTube2, Timer, X,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Tab = "home" | "builder" | "uses" | "test";
type Rating = "Useful" | "Maybe" | "Not useful";
type YesNo = "Yes" | "No";

const navItems = [
  { value: "home" as Tab, label: "Boat home", short: "Home", icon: ShipWheel },
  { value: "builder" as Tab, label: "Automations", short: "Build", icon: Sparkles },
  { value: "uses" as Tab, label: "Smart uses", short: "Ideas", icon: Radio },
  { value: "test" as Tab, label: "User test", short: "Test", icon: TestTube2 },
];

const secureSteps = [
  { label: "Turn off lights", icon: Lamp },
  { label: "Turn off electrical equipment", icon: PlugZap },
  { label: "Close gas supply", icon: Flame },
  { label: "Activate alarm", icon: BellRing },
  { label: "Send confirmation", icon: CheckCircle2 },
];

const builderActions = [
  { key: "lights", label: "Turn off lights", detail: "Cabin, deck and navigation lights", icon: Lamp },
  { key: "equipment", label: "Turn off electrical equipment", detail: "Entertainment, pumps and outlets", icon: PlugZap },
  { key: "gas", label: "Close gas", detail: "Shut the galley gas valve", icon: Flame },
  { key: "alarm", label: "Activate alarm", detail: "Secure doors and monitor movement", icon: BellRing },
] as const;

const useCases = [
  { name: "Leaving the Boat", description: "Secure the boat and switch off equipment after you step ashore.", icon: LockKeyhole },
  { name: "Arriving", description: "Warm up the cabin, switch on lights and prepare essential systems.", icon: Home },
  { name: "Night Mode", description: "Dim the cabin, quiet alerts and keep only safety lights on.", icon: Moon },
  { name: "Battery Protection", description: "Switch off non-essential equipment before the battery runs low.", icon: BatteryCharging },
  { name: "Cold Weather Protection", description: "Protect pipes and key systems when the temperature drops.", icon: CloudSnow },
];

function Choice({ value, onChange, options, label }: { value: string; onChange: (value: string) => void; options: string[]; label: string }) {
  return (
    <div className="choice-group" role="group" aria-label={label}>
      {options.map((option) => (
        <button key={option} type="button" aria-pressed={value === option} onClick={() => onChange(option)} className={value === option ? "choice-active" : ""}>{option}</button>
      ))}
    </div>
  );
}

export default function BoatFlowApp() {
  const [tab, setTab] = useState<Tab>("home");

  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const allowed: Tab[] = ["home", "builder", "uses", "test"];
    void Promise.resolve(context.registerTool({
      name: "open_boatflow_screen",
      title: "Open a BoatFlow screen",
      description: "Open Boat home, the automation builder, smart use cases, or the user test in the visible BoatFlow prototype.",
      inputSchema: { type: "object", properties: { screen: { type: "string", enum: allowed } }, required: ["screen"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        const screen = (input as { screen?: string })?.screen;
        if (!allowed.includes(screen as Tab)) throw new Error("Choose home, builder, uses, or test.");
        setTab(screen as Tab);
        return { screen, status: "opened" };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)} className="min-h-screen gap-0 bg-background text-foreground">
      <Header />
      <div className="mx-auto grid w-full max-w-[1440px] lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="border-b border-border/70 px-3 py-3 lg:min-h-[calc(100vh-73px)] lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
          <TabsList className="grid h-auto w-full grid-cols-4 gap-2 bg-transparent p-0 lg:grid-cols-1" aria-label="Main navigation">
            {navItems.map(({ value, label, short, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="h-auto min-h-12 flex-col gap-1 rounded-xl px-2 py-2.5 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-sm">
                <Icon className="size-4" /><span className="lg:hidden">{short}</span><span className="hidden lg:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <BoatHealth />
        </aside>
        <div className="min-w-0">
          <TabsContent value="home" className="m-0"><BoatHome goToBuilder={() => setTab("builder")} /></TabsContent>
          <TabsContent value="builder" className="m-0"><AutomationBuilder /></TabsContent>
          <TabsContent value="uses" className="m-0"><SmartUses /></TabsContent>
          <TabsContent value="test" className="m-0"><UserTest goToBuilder={() => setTab("builder")} /></TabsContent>
        </div>
      </div>
    </Tabs>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(8,42,54,.18)]"><Anchor className="size-5" strokeWidth={2.2} /></div><div><div className="text-lg font-semibold tracking-[-.03em]">BoatFlow</div><div className="text-xs font-medium text-muted-foreground">S/Y Seabird</div></div></div>
        <div className="hidden rounded-full border border-cyan-200 bg-cyan-50 px-3.5 py-2 text-xs font-semibold text-cyan-950 md:block">Research Prototype — Synthetic Boat &amp; Evaluation Data</div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-sm font-medium shadow-sm"><span className="size-2 rounded-full bg-emerald-500" /><span className="hidden sm:inline">All systems online</span><span className="sm:hidden">Online</span></div>
      </div>
    </header>
  );
}

function BoatHealth() {
  return (
    <div className="mt-8 hidden rounded-2xl border border-border bg-card p-4 shadow-sm lg:block">
      <div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">Boat health</span><span className="text-xs font-semibold text-emerald-700">Excellent</span></div>
      <div className="flex items-center gap-3"><BatteryCharging className="size-5 text-cyan-700" /><div className="flex-1"><div className="flex justify-between text-sm font-semibold"><span>Battery</span><span>84%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full w-[84%] rounded-full bg-cyan-600" /></div></div></div>
      <div className="mt-4 border-t border-border pt-4 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Shore power</span><strong>Connected</strong></div><div className="mt-2 flex justify-between"><span className="text-muted-foreground">Last check</span><strong>2 min ago</strong></div></div>
    </div>
  );
}

function PageIntro({ eyebrow, title, text, side }: { eyebrow: string; title: string; text: string; side?: React.ReactNode }) {
  return <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-1.5 text-sm font-semibold text-cyan-700">{eyebrow}</p><h1 className="text-3xl font-semibold tracking-[-.045em] sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-base text-muted-foreground">{text}</p></div>{side}</div>;
}

function BoatHome({ goToBuilder }: { goToBuilder: () => void }) {
  const [mode, setMode] = useState<string | null>(null);
  const [secureOpen, setSecureOpen] = useState(false);
  const [phase, setPhase] = useState(-1);
  const modes = [
    { name: "Arriving", note: "Lights on · systems ready", icon: Home },
    { name: "Night Mode", note: "Deck quiet · cabin dimmed", icon: Moon },
    { name: "Cruising", note: "Navigation · instruments on", icon: Navigation },
    { name: "Leaving the Boat", note: "Secure everything in one tap", icon: ShieldCheck, featured: true },
  ];

  useEffect(() => {
    if (!secureOpen || phase < 0 || phase >= secureSteps.length) return;
    const timer = window.setTimeout(() => setPhase((current) => current + 1), 420);
    return () => window.clearTimeout(timer);
  }, [secureOpen, phase]);

  function activate(name: string) {
    if (name === "Leaving the Boat") { setSecureOpen(true); setPhase(-1); return; }
    setMode(name);
  }

  return (
    <section className="page-shell">
      <PageIntro eyebrow="Tuesday, 16 June · Port Solent" title="Good afternoon, Alex." text="Seabird is safely moored and ready when you are." side={<div className="flex gap-3"><div className="status-pill"><CloudSun className="size-4" /><span><strong>18°</strong> Calm</span></div><div className="status-pill"><Gauge className="size-4" /><span><strong>0.0 kn</strong> Moored</span></div></div>} />
      <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-lg font-semibold tracking-tight">Choose a mode</h2><span className="text-sm text-muted-foreground">One tap sets the whole boat</span></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modes.map(({ name, note, icon: Icon, featured }) => <button key={name} type="button" onClick={() => activate(name)} className={`mode-card group ${featured ? "mode-featured" : ""}`}><div className={`mb-10 grid size-11 place-items-center rounded-xl ${featured ? "bg-white/12" : "bg-cyan-50 text-cyan-800"}`}><Icon className="size-5" /></div><div className="flex items-center justify-between gap-3"><div><h3 className="text-lg font-semibold tracking-[-.02em]">{name}</h3><p className={`mt-1 text-sm ${featured ? "text-cyan-100/80" : "text-muted-foreground"}`}>{note}</p></div><ChevronRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" /></div></button>)}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-[1.2fr_.8fr]">
        <div className="panel"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-muted-foreground">Current state</p><h3 className="mt-1 text-xl font-semibold">Quiet and secure</h3></div><div className="grid size-11 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Check className="size-5" /></div></div><div className="mt-5 grid grid-cols-3 gap-3 text-sm"><div className="metric"><span>Cabin</span><strong>21°C</strong></div><div className="metric"><span>Shore power</span><strong>Connected</strong></div><div className="metric"><span>Alarm</span><strong>Ready</strong></div></div></div>
        <button type="button" onClick={goToBuilder} className="rounded-[22px] bg-[#dff7f5] p-5 text-left text-[#083640] transition hover:-translate-y-0.5 hover:shadow-lg"><p className="text-sm font-semibold">Your last automation</p><h3 className="mt-1 text-xl font-semibold">Leaving the Boat</h3><p className="mt-2 text-sm text-[#315f67]">Completed yesterday at 18:42. All five steps finished.</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">Edit automation <ChevronRight className="size-4" /></span></button>
      </div>
      {mode && <div className="toast-card" role="status"><div className="success-icon"><Check className="size-5" /></div><div className="flex-1"><p className="font-semibold">{mode} is active</p><p className="text-sm text-muted-foreground">Your boat settings have been updated.</p></div><button onClick={() => setMode(null)} className="text-button" type="button">Done</button></div>}
      {secureOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#041b24]/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="leaving-title"><div className="w-full max-w-lg rounded-[26px] bg-white p-6 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-cyan-700">Leaving the Boat</p><h2 id="leaving-title" className="mt-1 text-2xl font-semibold tracking-tight">Secure Seabird?</h2><p className="mt-1 text-sm text-muted-foreground">We’ll take care of these steps in order.</p></div><button type="button" aria-label="Close" onClick={() => setSecureOpen(false)} className="icon-button"><X className="size-5" /></button></div><div className="my-6 space-y-2">{secureSteps.map(({ label, icon: Icon }, index) => { const done = phase > index; const current = phase === index; return <div key={label} className={`secure-row ${done ? "secure-done" : ""}`}><div className="grid size-9 place-items-center rounded-lg bg-secondary"><Icon className="size-4" /></div><span className="flex-1 font-medium">{label}</span>{done ? <CheckCircle2 className="size-5 text-emerald-600" /> : current ? <span className="size-5 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" /> : <span className="size-5 rounded-full border border-border" />}</div>; })}</div>{phase < 0 ? <button type="button" onClick={() => setPhase(0)} className="primary-button w-full"><ShieldCheck className="size-4" /> Secure the boat</button> : phase < secureSteps.length ? <div className="flex items-center justify-center gap-2 rounded-xl bg-cyan-50 py-3 text-sm font-semibold text-cyan-900"><span className="size-4 animate-spin rounded-full border-2 border-cyan-700 border-t-transparent" /> Securing your boat…</div> : <div className="rounded-2xl bg-emerald-50 p-4 text-center"><div className="mx-auto mb-2 grid size-10 place-items-center rounded-full bg-emerald-600 text-white"><Check className="size-5" /></div><h3 className="font-semibold text-emerald-950">Boat secured</h3><p className="mt-1 text-sm text-emerald-800">All five steps completed. Confirmation sent.</p><button type="button" onClick={() => setSecureOpen(false)} className="mt-4 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white">Done</button></div>}</div></div>}
    </section>
  );
}

function AutomationBuilder() {
  const [title, setTitle] = useState("Leaving the Boat");
  const [editing, setEditing] = useState(false);
  const [trigger, setTrigger] = useState("I leave the boat");
  const [actions, setActions] = useState<Record<string, boolean>>({ lights: true, equipment: true, gas: true, alarm: true });
  const [confirmation, setConfirmation] = useState(true);
  const [saved, setSaved] = useState(false);
  const count = Object.values(actions).filter(Boolean).length;

  function updateAction(key: string, checked: boolean) { setSaved(false); setActions((current) => ({ ...current, [key]: checked })); }

  return (
    <section className="page-shell">
      <PageIntro eyebrow="No-code automation builder" title="Make the boat look after itself." text="Choose what starts the routine, what the boat should do, and how you want to know it worked." side={<div className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold shadow-sm ring-1 ring-border">{count + Number(confirmation)} steps on</div>} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="space-y-4">
          <div className="panel p-0"><div className="border-b border-border px-5 py-4"><div className="flex items-center justify-between gap-3"><div><span className="section-kicker">WHEN</span>{editing ? <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => setEditing(false)} autoFocus className="ml-3 rounded-lg border border-input px-2 py-1 text-lg font-semibold outline-none focus:ring-2 focus:ring-ring" aria-label="Automation name" /> : <h2 className="mt-1 text-xl font-semibold">{title}</h2>}</div><button type="button" onClick={() => setEditing(true)} className="icon-button" aria-label="Rename automation"><Pencil className="size-4" /></button></div></div><div className="grid gap-2 p-4 sm:grid-cols-3">{["I leave the boat", "I arrive at the boat", "Battery is low"].map((item) => <button type="button" key={item} onClick={() => { setTrigger(item); setSaved(false); }} className={`trigger-card ${trigger === item ? "trigger-selected" : ""}`}><span className="font-semibold">{item}</span>{trigger === item && <CheckCircle2 className="size-5 text-cyan-700" />}</button>)}</div></div>
          <div className="panel p-0"><div className="border-b border-border px-5 py-4"><span className="section-kicker">DO</span><h2 className="mt-1 text-xl font-semibold">Choose what happens</h2></div><div className="divide-y divide-border">{builderActions.map(({ key, label, detail, icon: Icon }) => <label key={key} className="flex cursor-pointer items-center gap-4 px-5 py-4 hover:bg-secondary/45"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-800"><Icon className="size-5" /></div><div className="min-w-0 flex-1"><div className="font-semibold">{label}</div><div className="text-sm text-muted-foreground">{detail}</div></div><Switch checked={actions[key]} onCheckedChange={(checked) => updateAction(key, checked)} aria-label={label} className="scale-125 data-[state=checked]:bg-cyan-700" /></label>)}</div></div>
          <div className="panel p-0"><div className="border-b border-border px-5 py-4"><span className="section-kicker">THEN</span><h2 className="mt-1 text-xl font-semibold">Keep me informed</h2></div><label className="flex cursor-pointer items-center gap-4 px-5 py-4"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-800"><CheckCircle2 className="size-5" /></div><div className="flex-1"><div className="font-semibold">Send confirmation</div><div className="text-sm text-muted-foreground">Let me know when every step is complete</div></div><Switch checked={confirmation} onCheckedChange={(checked) => { setConfirmation(checked); setSaved(false); }} aria-label="Send confirmation" className="scale-125 data-[state=checked]:bg-cyan-700" /></label></div>
        </div>
        <aside className="xl:sticky xl:top-24 xl:self-start"><div className="rounded-[24px] bg-primary p-6 text-primary-foreground shadow-[0_20px_50px_rgba(8,42,54,.16)]"><span className="text-xs font-semibold uppercase tracking-[.14em] text-cyan-200">In plain language</span><h3 className="mt-4 text-2xl font-semibold tracking-tight">When {trigger.toLowerCase()},</h3><p className="mt-3 leading-7 text-cyan-50/80">Seabird will {count === 0 ? "wait for your instructions" : builderActions.filter((item) => actions[item.key]).map((item) => item.label.toLowerCase()).join(", ")}{confirmation ? ", then send you a confirmation" : ""}.</p><div className="my-6 h-px bg-white/10" /><p className="text-sm text-cyan-100/70">No code. Change any choice and this summary updates with you.</p><button type="button" onClick={() => setSaved(true)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7ce5df] px-4 py-3 font-semibold text-[#062e38] transition hover:bg-white"><Save className="size-4" /> Save automation</button></div>{saved && <div role="status" className="mt-3 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"><CheckCircle2 className="size-5 shrink-0" /><div><p className="font-semibold">Automation saved</p><p className="text-sm">It’s ready for your next departure.</p></div></div>}</aside>
      </div>
    </section>
  );
}

function SmartUses() {
  const initial = { "Leaving the Boat": "Useful", Arriving: "Useful", "Night Mode": "Maybe", "Battery Protection": "Useful", "Cold Weather Protection": "Not useful" } as Record<string, Rating>;
  const [ratings, setRatings] = useState<Record<string, Rating>>(initial);
  const useful = Object.values(ratings).filter((value) => value === "Useful").length;
  return (
    <section className="page-shell"><PageIntro eyebrow="Smart use cases" title="What would help on your boat?" text="There are no right answers. Tell us which ideas fit the way you use your boat." side={<div className="rounded-full bg-cyan-50 px-3.5 py-2 text-sm font-semibold text-cyan-900">{useful} marked useful</div>} /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{useCases.map(({ name, description, icon: Icon }, index) => <article key={name} className={`use-card ${index === 0 ? "md:col-span-2 xl:col-span-1" : ""}`}><div className="mb-8 flex items-start justify-between"><div className="grid size-11 place-items-center rounded-xl bg-cyan-50 text-cyan-800"><Icon className="size-5" /></div><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">Idea {String(index + 1).padStart(2, "0")}</span></div><h2 className="text-xl font-semibold tracking-tight">{name}</h2><p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{description}</p><div className="mt-5"><Choice label={`Rate ${name}`} value={ratings[name]} options={["Useful", "Maybe", "Not useful"]} onChange={(value) => setRatings((current) => ({ ...current, [name]: value as Rating }))} /></div></article>)}</div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-200 bg-[#dff7f5] p-4"><div><p className="font-semibold text-cyan-950">Thanks — your choices are saved in this demo.</p><p className="text-sm text-cyan-900/70">These synthetic responses reset when the page reloads.</p></div><button type="button" onClick={() => setRatings(initial)} className="text-button">Reset choices</button></div></section>
  );
}

function UserTest({ goToBuilder }: { goToBuilder: () => void }) {
  const [completed, setCompleted] = useState<YesNo>("Yes");
  const [time, setTime] = useState("02:14");
  const [errors, setErrors] = useState(1);
  const [ease, setEase] = useState(4);
  const [programming, setProgramming] = useState<YesNo>("No");
  const [wouldUse, setWouldUse] = useState<YesNo>("Yes");
  const [submitted, setSubmitted] = useState(false);
  const demoSummary = useMemo(() => ({ completion: "7/8", median: "2m 08s", ease: "4.3/5" }), []);
  return (
    <section className="page-shell"><PageIntro eyebrow="Research evaluation" title="Test the idea, not the person." text="Use synthetic participant details to explore how this prototype could support a short boat-owner usability study." side={<button type="button" onClick={goToBuilder} className="secondary-button"><Sparkles className="size-4" /> Open task</button>} /><div className="mb-5 rounded-[22px] bg-primary p-5 text-primary-foreground sm:flex sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-cyan-200">Participant task</p><h2 className="mt-2 text-xl font-semibold">“Create an automation that secures the boat when leaving.”</h2></div><div className="mt-4 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold sm:mt-0">Demo participant 08</div></div><div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]"><form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="panel p-0"><div className="divide-y divide-border"><TestRow number="01" title="Was the task completed?"><Choice label="Task completed" value={completed} options={["Yes", "No"]} onChange={(value) => { setCompleted(value as YesNo); setSubmitted(false); }} /></TestRow><TestRow number="02" title="Completion time"><label className="input-wrap"><Timer className="size-4 text-muted-foreground" /><input value={time} onChange={(e) => { setTime(e.target.value); setSubmitted(false); }} aria-label="Completion time" placeholder="MM:SS" /></label></TestRow><TestRow number="03" title="Number of errors"><div className="stepper"><button type="button" aria-label="Decrease errors" onClick={() => { setErrors((value) => Math.max(0, value - 1)); setSubmitted(false); }}>−</button><output aria-label="Number of errors">{errors}</output><button type="button" aria-label="Increase errors" onClick={() => { setErrors((value) => value + 1); setSubmitted(false); }}>+</button></div></TestRow><TestRow number="04" title="How easy was it?"><div className="rating-row" role="group" aria-label="Ease rating from 1 to 5">{[1,2,3,4,5].map((value) => <button type="button" key={value} aria-label={`${value} out of 5`} aria-pressed={ease === value} onClick={() => { setEase(value); setSubmitted(false); }} className={ease === value ? "rating-active" : ""}>{value}</button>)}</div></TestRow><TestRow number="05" title="Did this feel like programming?"><Choice label="Did this feel like programming" value={programming} options={["Yes", "No"]} onChange={(value) => { setProgramming(value as YesNo); setSubmitted(false); }} /></TestRow><TestRow number="06" title="Would you use this feature?"><Choice label="Would you use this feature" value={wouldUse} options={["Yes", "No"]} onChange={(value) => { setWouldUse(value as YesNo); setSubmitted(false); }} /></TestRow></div><div className="flex items-center justify-between gap-4 border-t border-border p-5"><p className="text-sm text-muted-foreground">Demo data only — nothing is sent or stored.</p><button type="submit" className="primary-button shrink-0">Record demo result</button></div></form><aside className="space-y-4"><div className="rounded-[24px] bg-[#dff7f5] p-5 text-[#083640]"><p className="text-xs font-semibold uppercase tracking-[.14em] text-cyan-800">Synthetic study snapshot</p><h3 className="mt-2 text-xl font-semibold">8 demo participants</h3><div className="mt-5 grid grid-cols-3 gap-2 xl:grid-cols-1"><SummaryMetric label="Completed" value={demoSummary.completion} /><SummaryMetric label="Median time" value={demoSummary.median} /><SummaryMetric label="Average ease" value={demoSummary.ease} /></div><div className="mt-5 border-t border-cyan-900/10 pt-4 text-sm leading-6 text-cyan-950/70">6 of 8 said it did not feel like programming. 7 of 8 said they would use it.</div></div>{submitted && <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950"><CheckCircle2 className="mb-3 size-6 text-emerald-600" /><h3 className="font-semibold">Demo result recorded</h3><p className="mt-1 text-sm text-emerald-800">Participant 08 completed the task in {time} with {errors} {errors === 1 ? "error" : "errors"}.</p></div>}</aside></div></section>
  );
}

function TestRow({ number, title, children }: { number: string; title: string; children: React.ReactNode }) { return <div className="grid gap-3 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"><div className="flex items-center gap-3"><span className="text-xs font-bold text-cyan-700">{number}</span><h3 className="font-semibold">{title}</h3></div>{children}</div>; }
function SummaryMetric({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-white/65 p-3"><div className="text-xs text-cyan-950/60">{label}</div><div className="mt-1 text-lg font-semibold">{value}</div></div>; }
