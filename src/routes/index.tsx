import { createFileRoute, Link } from "@tanstack/react-router";
import heroShield from "@/assets/hero-shield.jpg";
import {
  ShieldCheck,
  Fingerprint,
  Lock,
  Activity,
  AlertTriangle,
  Brain,
  Eye,
  Heart,
  Sparkles,
  Network,
  FileKey,
  UserCheck,
  ArrowRight,
  Zap,
  ScanFace,
  TrendingUp,
  Target,
  Gift,
  Clock,
  Lightbulb,
  ShieldAlert,
  Users,
  Scale,
  FileText,
  Gavel,
} from "lucide-react";
import { AIGuide } from "@/components/ai-guide";
import { useAuth } from "@/contexts/auth-context";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen text-foreground">
      <Nav isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
      <Hero />
      <Pillars />
      <LiveDashboard />
      <CompetitiveEdge />
      <BehaviorEngine />
      <FraudDetection />
      <SecurityStack />
      <EmergencyBand />
      <Ethics />
      <Footer />
      <AIGuide />
    </div>
  );
}

function Nav({ isAuthenticated, user, onLogout }: { isAuthenticated: boolean; user: any; onLogout: () => void }) {
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-shield shadow-glow">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Aegis Health</span>
        </div>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#pillars" className="hover:text-foreground">
            Platform
          </a>
          <a href="#dashboard" className="hover:text-foreground">
            Dashboard
          </a>
          <a href="#behavior" className="hover:text-foreground">
            Behavior Engine
          </a>
          <a href="#fraud" className="hover:text-foreground">
            Fraud Detection
          </a>
          <a href="#security" className="hover:text-foreground">
            Security
          </a>
          <a href="#ethics" className="hover:text-foreground">
            Ethics
          </a>
        </nav>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Hi, {user?.name || "User"}
              </span>
              <button
                onClick={onLogout}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-shield px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-90"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            Theme 3 — AI for Safer Communities
          </div>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] md:text-6xl">
            Your health, <span className="text-gradient">evolving with you</span> every single day.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Aegis is a proactive wellness companion that learns your behaviour, detects shifts in
            motivation and lifestyle, and delivers personalised goals, nudges, and rewards that
            evolve with you. Not just tracking — transforming your life with trust, fairness, and
            intelligence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-shield px-6 py-3 font-medium text-primary-foreground shadow-glow">
              Activate my shield <ArrowRight className="h-4 w-4" />
            </button>
            <button className="rounded-full border border-border bg-card/60 px-6 py-3 font-medium text-foreground hover:bg-card">
              See how it works
            </button>
          </div>
          <div className="mt-10 flex gap-8 text-sm">
            {[
              ["Adaptive", "Personalization"],
              ["Predictive", "Insights"],
              ["Psychology", "-backed"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-2xl font-semibold text-gradient">{k}</div>
                <div className="text-muted-foreground">{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-shield opacity-30 blur-3xl" />
          <img
            src={heroShield}
            alt="AI security shield protecting health data"
            width={1536}
            height={1024}
            className="rounded-[2rem] border border-border shadow-card"
          />
          <div className="absolute -bottom-6 -left-6 max-w-[260px] glass rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Live anomaly scan
            </div>
            <div className="mt-1 text-sm font-semibold">All vitals nominal</div>
            <div className="mt-1 text-xs text-muted-foreground">12 sensors · 3 wearables</div>
          </div>
        </div>
      </div>
    </section>
  );
}

const pillars = [
  {
    icon: Brain,
    title: "Adaptive behavior engine",
    desc: "AI continuously learns your patterns, adjusting goals, messages, and support based on motivation levels, life changes, and real-world context.",
  },
  {
    icon: TrendingUp,
    title: "Predictive wellness",
    desc: "Identifies early warning signs — declining activity, increasing stress, irregular sleep — and suggests preventive actions before problems develop.",
  },
  {
    icon: Target,
    title: "Psychology-backed habits",
    desc: "Uses behavior science to build healthy routines through implementation intentions, habit stacking, and the right nudge at the right time.",
  },
  {
    icon: Gift,
    title: "Reward system",
    desc: "Vitality-style incentives that evolve with your consistency. Earn points for healthy behaviors, unlock rewards, and get encouragement tuned to your current state.",
  },
  {
    icon: Activity,
    title: "Multi-dimensional analysis",
    desc: "Combines sleep, stress, physical activity, nutrition, and spending behavior to create a complete picture of wellbeing across life.",
  },
  {
    icon: Lightbulb,
    title: "Motivation intelligence",
    desc: "Detects when you are losing steam, when you need recovery, and when you are ready for a bigger challenge. Guidance adapts, never repeats.",
  },
];

function Pillars() {
  return (
    <section id="pillars" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 flex items-end justify-between gap-6">
        <div>
          <div className="text-sm font-medium uppercase tracking-widest text-primary">
            The platform
          </div>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            Six pillars. <span className="text-gradient">One transformation.</span>
          </h2>
        </div>
        <p className="hidden max-w-sm text-muted-foreground md:block">
          Not just tracking your health. Transforming it through intelligent, personalized, and
          context-aware guidance.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {pillars.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition hover:border-primary/50"
          >
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
}

function LiveDashboard() {
  return (
    <section id="dashboard" className="mx-auto max-w-7xl px-6 py-20">
      <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-card md:p-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-sm uppercase tracking-widest text-primary">Companion view</div>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              A digital twin that watches over you.
            </h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Streaming
          </span>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          <VitalsCard />
          <ThreatCard />
          <ConsentCard />
        </div>
      </div>
    </section>
  );
}

function CompetitiveEdge() {
  const cards = [
    {
      title: "Reward integrity by design",
      desc: "Fraud-resistant reward scoring keeps incentives honest and preserves trust across millions of members.",
    },
    {
      title: "Adaptive support engine",
      desc: "Behavioral intelligence shifts goals and messaging when life changes, not just when data changes.",
    },
    {
      title: "Consent-led data governance",
      desc: "Fine-grained consent tracking and audit logs make every data decision transparent to users and regulators.",
    },
    {
      title: "Human review for high risk",
      desc: "High-stakes cases are escalated to people, keeping AI oversight accountable, fair, and competition-ready.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 text-center">
        <div className="text-sm uppercase tracking-widest text-primary">Competitive edge</div>
        <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-bold md:text-5xl">
          Built to stand out among healthcare AI challengers.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Aegis blends predictive wellness, behavior economics, and enterprise trust so your product
          is not only more intelligent but more defensible.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-border bg-card p-8 shadow-card transition hover:border-primary/50 hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold">{card.title}</h3>
            <p className="mt-4 text-sm text-muted-foreground">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function VitalsCard() {
  const bars = [38, 52, 61, 49, 68, 74, 63, 71, 80, 66, 58, 72, 84, 70];
  const heightClasses = [
    "h-[38%]",
    "h-[52%]",
    "h-[61%]",
    "h-[49%]",
    "h-[68%]",
    "h-[74%]",
    "h-[63%]",
    "h-[71%]",
    "h-[80%]",
    "h-[66%]",
    "h-[58%]",
    "h-[72%]",
    "h-[84%]",
    "h-[70%]",
  ];
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Heart className="h-4 w-4 text-primary" /> Heart variability
        </div>
        <span className="text-xs text-primary">Optimal</span>
      </div>
      <div className="mt-4 text-4xl font-bold">
        72 <span className="text-base font-normal text-muted-foreground">bpm</span>
      </div>
      <div className="mt-6 flex h-24 items-end gap-1">
        {bars.map((h, i) => (
          <div key={i} className={`flex-1 rounded-t bg-shield opacity-80 ${heightClasses[i]}`} />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        {[
          ["SpO₂", "98%"],
          ["Stress", "Low"],
          ["Sleep", "7h 42m"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-secondary/60 p-2">
            <div className="text-muted-foreground">{k}</div>
            <div className="font-semibold">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThreatCard() {
  const events = [
    { ok: true, t: "10:42", msg: "Login verified · Face ID + WebAuthn" },
    { ok: true, t: "10:38", msg: "Behavioral pattern matched (98.4%)" },
    { ok: false, t: "09:12", msg: "Impossible travel blocked — Lagos → Berlin" },
    { ok: true, t: "08:55", msg: "Data export request denied without consent" },
  ];
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" /> Threat shield
        </div>
        <span className="text-xs text-primary">Active</span>
      </div>
      <div className="mt-4 text-4xl font-bold">
        3 <span className="text-base font-normal text-muted-foreground">threats blocked / 24h</span>
      </div>
      <ul className="mt-6 space-y-3">
        {events.map((e, i) => (
          <li key={i} className="flex items-start gap-3 rounded-lg bg-secondary/40 p-3 text-sm">
            <span
              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${e.ok ? "bg-primary" : "bg-destructive"}`}
            />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">{e.t}</div>
              <div>{e.msg}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConsentCard() {
  const grants = [
    { who: "Dr. Adeyemi · Cardiology", scope: "Heart data · 30 days", on: true },
    { who: "Mom (Emergency)", scope: "Vitals + location · always", on: true },
    { who: "MetroHealth Research", scope: "Anonymized sleep · opt-in", on: false },
    { who: "Lagos General ER", scope: "Break-glass access", on: true },
  ];
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileKey className="h-4 w-4 text-primary" /> Consent ledger
        </div>
        <span className="text-xs text-primary">You're in control</span>
      </div>
      <div className="mt-4 text-4xl font-bold">
        4 <span className="text-base font-normal text-muted-foreground">active grants</span>
      </div>
      <ul className="mt-6 space-y-3">
        {grants.map((g, i) => (
          <li
            key={i}
            className="flex items-center justify-between rounded-lg bg-secondary/40 p-3 text-sm"
          >
            <div>
              <div className="font-medium">{g.who}</div>
              <div className="text-xs text-muted-foreground">{g.scope}</div>
            </div>
            <span
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${g.on ? "bg-shield" : "bg-secondary"
                }`}
            >
              <span
                className={`absolute h-4 w-4 rounded-full bg-background transition ${g.on ? "right-1" : "left-1"
                  }`}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BehaviorEngine() {
  const features = [
    {
      icon: Brain,
      title: "Continuous adaptation",
      desc: "The AI learns your daily habits, motivation levels, and real-world context. It shifts goals and tone based on life changes, not just yesterday's data.",
    },
    {
      icon: Clock,
      title: "Right-time nudges",
      desc: "Context-aware guidance that knows when you are ready for a challenge and when you need support. It nudges you with empathy, not noise.",
    },
    {
      icon: TrendingUp,
      title: "Predictive prevention",
      desc: "A predictive engine spots early warning signs like falling activity, rising stress, or poor sleep and suggests preventive actions ahead of time.",
    },
    {
      icon: Gift,
      title: "Reward ecosystem",
      desc: "Vitality-style incentives that reward consistency and healthy momentum. Points adapt to your progress, keeping motivation smart and sustainable.",
    },
    {
      icon: Target,
      title: "Habit formation science",
      desc: "Built on implementation intentions and habit stacking. Aegis turns lifestyle signals into simple, repetitive actions that become habits.",
    },
    {
      icon: Lightbulb,
      title: "Motivation sensing",
      desc: "Detects when your energy changes and adapts the experience — gentler encouragement when stressed, stronger goals when you are engaged.",
    },
  ];
  return (
    <section id="behavior" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 text-center">
        <div className="text-sm uppercase tracking-widest text-primary">Behavior change engine</div>
        <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-bold md:text-5xl">
          Not just tracking. <span className="text-gradient">Transforming.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Aegis uses advanced AI and behavioral science to understand you deeply, adapt
          continuously, and guide you toward lasting healthy habits.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl border border-border bg-card p-6 shadow-card transition hover:border-primary/50 hover:shadow-lg"
          >
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-shield/20 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-16 rounded-3xl border border-border bg-card/70 p-8 shadow-card md:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-3xl font-bold md:text-4xl">
              Multi-dimensional wellness intelligence
            </h3>
            <p className="mt-4 text-muted-foreground">
              Aegis doesn't just track steps. It combines sleep quality, stress levels, physical
              activity, nutrition patterns, and even spending behavior to generate a complete,
              real-world understanding of your wellbeing. These connected insights reveal patterns
              you'd never see alone.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Sleep + stress correlation analysis",
                "Activity vs. spending behavior patterns",
                "Nutrition impact on cognitive performance",
                "Social connections and mental health links",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-background/50 p-6">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Wellness correlation matrix</span>
              <span className="text-primary">Live</span>
            </div>
            <div className="space-y-4">
              {[
                { label: "Sleep quality", value: 87, trend: "+5%", width: "w-[87%]" },
                { label: "Stress levels", value: 42, trend: "-12%", width: "w-[42%]" },
                { label: "Activity consistency", value: 78, trend: "+8%", width: "w-[78%]" },
                { label: "Nutrition score", value: 65, trend: "+3%", width: "w-[65%]" },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{metric.label}</span>
                    <span className="text-xs text-primary">{metric.trend}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className={`h-2 rounded-full bg-shield transition-all ${metric.width}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FraudDetection() {
  const features = [
    {
      icon: ShieldAlert,
      title: "Health data fraud detection",
      desc: "Continuously monitors for unrealistic spikes, repeated 'perfect' entries, wearable vs self-reported mismatches, and reward-program gaming patterns.",
    },
    {
      icon: Users,
      title: "Account security intelligence",
      desc: "Anomaly detection flags access from unknown devices, impossible travel, repeated failed logins, and sudden profile or permission changes.",
    },
    {
      icon: FileText,
      title: "Data misuse prevention",
      desc: "Role-based access control and fine-grained consent ensure only authorized systems can read sensitive health records. Audit logs capture every action.",
    },
    {
      icon: Scale,
      title: "Transparent decision-making",
      desc: "Whenever a risk flag is raised, users and administrators see simple explanations, confidence scores, and the exact reasoning behind the finding.",
    },
    {
      icon: Gavel,
      title: "Human review escalation",
      desc: "High-risk cases are routed to human review to maintain ethical oversight, prevent bias, and ensure fair treatment.",
    },
    {
      icon: Network,
      title: "Enterprise-grade governance",
      desc: "Designed for large-scale healthcare and insurance ecosystems, with audit trails, consent receipts, compliance reporting, and ethical oversight baked in.",
    },
  ];
  return (
    <section id="fraud" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 text-center">
        <div className="text-sm uppercase tracking-widest text-primary">
          Fraud detection & security intelligence
        </div>
        <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-bold md:text-5xl">
          Trustworthy. <span className="text-gradient">Fair. Safe.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Enterprise-level fraud detection and data governance ensuring rewards systems remain fair,
          accurate, and suitable for large-scale healthcare and insurance deployment.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl border border-border bg-card p-6 shadow-card transition hover:border-primary/50 hover:shadow-lg"
          >
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-shield/20 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-16 rounded-3xl border border-border bg-card/70 p-8 shadow-card md:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-3xl font-bold md:text-4xl">Built for enterprise healthcare</h3>
            <p className="mt-4 text-muted-foreground">
              Designed for large-scale digital health ecosystems like Discovery Limited. Aegis
              integrates predictive health intelligence with enterprise-level security, fraud
              prevention, and ethical data governance — making it innovative and suitable for
              real-world deployment.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "HIPAA, GDPR, ISO 27001, SOC 2 Type II compliant",
                "Immutable audit trails for all data access",
                "Real-time fraud scoring with confidence intervals",
                "Automated escalation for high-risk cases",
                "Fair reward systems protected from manipulation",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-background/50 p-6">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Fraud risk monitoring</span>
              <span className="text-primary">Live</span>
            </div>
            <div className="space-y-4">
              {[
                { label: "Data consistency score", value: 94, trend: "Normal", width: "w-[94%]" },
                { label: "Account security rating", value: 98, trend: "Secure", width: "w-[98%]" },
                {
                  label: "Reward system integrity",
                  value: 96,
                  trend: "Protected",
                  width: "w-[96%]",
                },
                { label: "Compliance status", value: 100, trend: "Compliant", width: "w-[100%]" },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{metric.label}</span>
                    <span className="text-xs text-primary">{metric.trend}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className={`h-2 rounded-full bg-shield transition-all ${metric.width}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const layers = [
  {
    icon: Lock,
    t: "End-to-end & at-rest encryption",
    d: "AES-256 for stored records, TLS 1.3 in transit, and per-user encryption keys. Zero-knowledge architecture encrypts sensitive fields client-side.",
  },
  {
    icon: Network,
    t: "Role-based access & consent controls",
    d: "Only authorized systems and roles can read sensitive health fields. Consent scopes and approvals are enforced before any access is granted.",
  },
  {
    icon: ScanFace,
    t: "Adaptive multi-factor authentication",
    d: "Biometrics, OTP, and FIDO2/WebAuthn. AI raises friction only when behavioral or contextual risk exceeds safe thresholds.",
  },
  {
    icon: Zap,
    t: "AI-driven security intelligence",
    d: "Behavioral biometrics and anomaly engines flag impossible travel, unknown devices, repeated compromise attempts, and suspicious data access patterns.",
  },
];

function SecurityStack() {
  return (
    <section id="security" className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28">
          <div className="text-sm uppercase tracking-widest text-primary">Security stack</div>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            Bank-level security. <br />
            <span className="text-gradient">Patient-level empathy.</span>
          </h2>
          <p className="mt-6 text-muted-foreground">
            Four layers cooperate so the system stays useful when it matters most — and useless to
            anyone who shouldn't see your data.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {["HIPAA", "GDPR", "ISO 27001", "SOC 2 II"].map((c) => (
              <span
                key={c}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <ol className="space-y-4">
          {layers.map(({ icon: Icon, t, d }, i) => (
            <li
              key={t}
              className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-shield/20 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-muted-foreground">Layer 0{i + 1}</div>
                <h3 className="mt-1 text-lg font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function EmergencyBand() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="relative overflow-hidden rounded-3xl border border-destructive/30 bg-card p-8 shadow-card md:p-12">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-destructive/20 blur-3xl" />
        <div className="relative grid items-center gap-10 md:grid-cols-[1.2fr,1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs text-destructive">
              <AlertTriangle className="h-3 w-3" /> Life-safety mode
            </div>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              When seconds matter, Aegis already moved.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Continuous vital monitoring predicts cardiac events, seizures, and hypoglycemia before
              they peak. Fall detection with automatic SOS to emergency contacts shares live
              location, allergies, blood type, and current meds. Mental-health early warning detects
              depression or suicidal ideation patterns and routes to crisis lines.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background/50 p-5 font-mono text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>aegis · emergency.log</span>
              <span className="text-destructive">LIVE</span>
            </div>
            <div className="mt-3 space-y-1.5">
              <Line c="text-muted-foreground">› monitoring 14 channels…</Line>
              <Line c="text-foreground">› HRV deviation +3.2σ detected</Line>
              <Line c="text-foreground">› cross-checking respiration, posture</Line>
              <Line c="text-destructive">› pattern: pre-syncope (87% conf.)</Line>
              <Line c="text-foreground">› SOS armed · waiting 12s for cancel</Line>
              <Line c="text-primary">› contacts notified · ER linked · medkit summary sent</Line>
              <Line c="text-primary">✓ Paramedic break-glass session active</Line>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Line({ children, c }: { children: React.ReactNode; c: string }) {
  return <div className={c}>{children}</div>;
}

function Ethics() {
  const items = [
    {
      t: "Explainable AI (XAI)",
      d: "Every recommendation comes with 'why we suggested this' in plain language, including which data points influenced it. Full transparency on decision-making.",
    },
    {
      t: "Continuous bias audits",
      d: "Models continuously tested across age, gender, ethnicity, and socioeconomic groups. Results published in public transparency report.",
    },
    {
      t: "Human-in-the-loop",
      d: "High-stakes recommendations (diagnoses, medication changes) always require licensed clinician review before reaching the user.",
    },
    {
      t: "Consent-by-design",
      d: "Opt-in for every new data use. No dark patterns. Consent receipts emailed to the user. True cryptographic erasure for right to be forgotten.",
    },
  ];
  return (
    <section id="ethics" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 text-center">
        <div className="text-sm uppercase tracking-widest text-primary">Responsible AI</div>
        <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-bold md:text-5xl">
          Powerful enough to predict.{" "}
          <span className="text-gradient">Humble enough to explain.</span>
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.t} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="h-1 w-10 rounded-full bg-shield" />
            <h3 className="mt-4 text-lg font-semibold">{it.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 overflow-hidden rounded-3xl border border-border bg-card p-10 text-center shadow-card">
        <h3 className="mx-auto max-w-2xl text-3xl font-bold md:text-4xl">
          A trust infrastructure for personal health.
        </h3>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Not another wellness app. A system intelligent enough to save lives, private enough that
          people actually use it, and ethical enough to set the standard.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-full bg-shield px-6 py-3 font-medium text-primary-foreground shadow-glow">
            Request a pilot <ArrowRight className="h-4 w-4" />
          </button>
          <button className="rounded-full border border-border bg-card px-6 py-3 font-medium hover:bg-secondary">
            Read the whitepaper
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />© {new Date().getFullYear()} Aegis Health
          · AI for Safer Communities
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground">
            Consent ledger
          </a>
          <a href="#" className="hover:text-foreground">
            Transparency report
          </a>
        </div>
      </div>
    </footer>
  );
}
