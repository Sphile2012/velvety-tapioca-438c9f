import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Sparkles, MessageSquare, Maximize2, Minimize2, X, Send, ShieldCheck, ArrowRight, Brain, TrendingUp, Target, Gift, Activity, Lightbulb, Clock, ShieldAlert, Users, FileText, Scale, Gavel, Network, Lock, ScanFace, Zap, AlertTriangle, Heart, FileKey } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { a as serverSendChatMessage } from "./api-D_6YpApM.js";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { u as useAuth } from "./router-ZDBUuEh6.js";
import "@tanstack/react-query";
const heroShield = "/assets/hero-shield-DpAIz2Bi.jpg";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function AIGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageText,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSuggestions([]);
    setIsLoading(true);
    try {
      const response = await serverSendChatMessage(messageText, messages);
      setMessages((prev) => [...prev, response.message]);
      setSuggestions(response.suggestions || []);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };
  if (!isOpen) {
    return /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsOpen(true),
        className: "fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-shield px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:scale-105 hover:opacity-90",
        "aria-label": "Open AI Guide",
        children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5" }),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "AI Guide" }),
          /* @__PURE__ */ jsx(MessageSquare, { className: "w-5 h-5" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-2xl border border-border bg-card/95 backdrop-blur-sm shadow-card transition-all",
        isMinimized ? "h-14" : "h-[500px]"
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "grid h-8 w-8 place-items-center rounded-lg bg-shield", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary-foreground" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Aegis AI Guide" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Your wellness assistant" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setIsMinimized(!isMinimized),
                className: "rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                "aria-label": isMinimized ? "Maximize" : "Minimize",
                children: isMinimized ? /* @__PURE__ */ jsx(Maximize2, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Minimize2, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setIsOpen(false),
                className: "rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        !isMinimized && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex h-[340px] flex-col overflow-y-auto p-4 space-y-4", children: [
            messages.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col items-center justify-center text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "grid h-16 w-16 place-items-center rounded-full bg-shield/20 mb-4", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-8 w-8 text-primary" }) }),
              /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-foreground", children: "Welcome to Aegis AI Guide" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-[250px]", children: "I'm here to help you with your health and wellness journey. Ask me anything!" })
            ] }) : messages.map((message) => /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "flex w-max max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                  message.role === "user" ? "ml-auto bg-shield text-primary-foreground" : "mr-auto bg-secondary text-foreground"
                ),
                children: /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap", children: message.content })
              },
              message.id
            )),
            isLoading && /* @__PURE__ */ jsx("div", { className: "mr-auto flex w-max max-w-[85%] rounded-2xl bg-secondary px-4 py-3 text-sm text-foreground", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-primary" }),
              /* @__PURE__ */ jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-primary delay-100" }),
              /* @__PURE__ */ jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-primary delay-200" })
            ] }) }),
            /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
          ] }),
          suggestions.length > 0 && !isLoading && /* @__PURE__ */ jsx("div", { className: "px-4 pb-2", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: suggestions.map((suggestion) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleSuggestionClick(suggestion),
              className: "rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-accent hover:border-primary/50",
              children: suggestion
            },
            suggestion
          )) }) }),
          /* @__PURE__ */ jsx("div", { className: "border-t border-border p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: input,
                onChange: (e) => setInput(e.target.value),
                onKeyPress: handleKeyPress,
                placeholder: "Ask me anything...",
                className: "flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                disabled: isLoading
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleSendMessage(input),
                disabled: !input.trim() || isLoading,
                className: "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-shield text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed",
                "aria-label": "Send message",
                children: /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" })
              }
            )
          ] }) })
        ] })
      ]
    }
  );
}
function Index() {
  const {
    isAuthenticated,
    user,
    logout
  } = useAuth();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen text-foreground", children: [
    /* @__PURE__ */ jsx(Nav, { isAuthenticated, user, onLogout: logout }),
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsx(Pillars, {}),
    /* @__PURE__ */ jsx(LiveDashboard, {}),
    /* @__PURE__ */ jsx(CompetitiveEdge, {}),
    /* @__PURE__ */ jsx(BehaviorEngine, {}),
    /* @__PURE__ */ jsx(FraudDetection, {}),
    /* @__PURE__ */ jsx(SecurityStack, {}),
    /* @__PURE__ */ jsx(EmergencyBand, {}),
    /* @__PURE__ */ jsx(Ethics, {}),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(AIGuide, {})
  ] });
}
function Nav({
  isAuthenticated,
  user,
  onLogout
}) {
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 glass", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-9 w-9 place-items-center rounded-xl bg-shield shadow-glow", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold tracking-tight", children: "Aegis Health" })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "hidden gap-8 text-sm text-muted-foreground md:flex", children: [
      /* @__PURE__ */ jsx("a", { href: "#pillars", className: "hover:text-foreground", children: "Platform" }),
      /* @__PURE__ */ jsx("a", { href: "#dashboard", className: "hover:text-foreground", children: "Dashboard" }),
      /* @__PURE__ */ jsx("a", { href: "#behavior", className: "hover:text-foreground", children: "Behavior Engine" }),
      /* @__PURE__ */ jsx("a", { href: "#fraud", className: "hover:text-foreground", children: "Fraud Detection" }),
      /* @__PURE__ */ jsx("a", { href: "#security", className: "hover:text-foreground", children: "Security" }),
      /* @__PURE__ */ jsx("a", { href: "#ethics", className: "hover:text-foreground", children: "Ethics" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: isAuthenticated ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("span", { className: "hidden text-sm text-muted-foreground sm:inline", children: [
        "Hi, ",
        user?.name || "User"
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onLogout, className: "rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent", children: "Sign out" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Link, { to: "/login", className: "hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent sm:inline-flex", children: "Sign in" }),
      /* @__PURE__ */ jsx(Link, { to: "/signup", className: "rounded-full bg-shield px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-90", children: "Get started" })
    ] }) })
  ] }) });
}
function Hero() {
  return /* @__PURE__ */ jsx("section", { className: "relative overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3 text-primary" }),
        "Theme 3 — AI for Safer Communities"
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "mt-6 text-5xl font-bold leading-[1.05] md:text-6xl", children: [
        "Your health, ",
        /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "evolving with you" }),
        " every single day."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-6 max-w-lg text-lg text-muted-foreground", children: "Aegis is a proactive wellness companion that learns your behaviour, detects shifts in motivation and lifestyle, and delivers personalised goals, nudges, and rewards that evolve with you. Not just tracking — transforming your life with trust, fairness, and intelligence." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxs("button", { className: "inline-flex items-center gap-2 rounded-full bg-shield px-6 py-3 font-medium text-primary-foreground shadow-glow", children: [
          "Activate my shield ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "rounded-full border border-border bg-card/60 px-6 py-3 font-medium text-foreground hover:bg-card", children: "See how it works" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-10 flex gap-8 text-sm", children: [["Adaptive", "Personalization"], ["Predictive", "Insights"], ["Psychology", "-backed"]].map(([k, v]) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-semibold text-gradient", children: k }),
        /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: v })
      ] }, k)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 rounded-[2rem] bg-shield opacity-30 blur-3xl" }),
      /* @__PURE__ */ jsx("img", { src: heroShield, alt: "AI security shield protecting health data", width: 1536, height: 1024, className: "rounded-[2rem] border border-border shadow-card" }),
      /* @__PURE__ */ jsxs("div", { className: "absolute -bottom-6 -left-6 max-w-[260px] glass rounded-2xl p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { className: "h-2 w-2 animate-pulse rounded-full bg-primary" }),
          "Live anomaly scan"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm font-semibold", children: "All vitals nominal" }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: "12 sensors · 3 wearables" })
      ] })
    ] })
  ] }) });
}
const pillars = [{
  icon: Brain,
  title: "Adaptive behavior engine",
  desc: "AI continuously learns your patterns, adjusting goals, messages, and support based on motivation levels, life changes, and real-world context."
}, {
  icon: TrendingUp,
  title: "Predictive wellness",
  desc: "Identifies early warning signs — declining activity, increasing stress, irregular sleep — and suggests preventive actions before problems develop."
}, {
  icon: Target,
  title: "Psychology-backed habits",
  desc: "Uses behavior science to build healthy routines through implementation intentions, habit stacking, and the right nudge at the right time."
}, {
  icon: Gift,
  title: "Reward system",
  desc: "Vitality-style incentives that evolve with your consistency. Earn points for healthy behaviors, unlock rewards, and get encouragement tuned to your current state."
}, {
  icon: Activity,
  title: "Multi-dimensional analysis",
  desc: "Combines sleep, stress, physical activity, nutrition, and spending behavior to create a complete picture of wellbeing across life."
}, {
  icon: Lightbulb,
  title: "Motivation intelligence",
  desc: "Detects when you are losing steam, when you need recovery, and when you are ready for a bigger challenge. Guidance adapts, never repeats."
}];
function Pillars() {
  return /* @__PURE__ */ jsxs("section", { id: "pillars", className: "mx-auto max-w-7xl px-6 py-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-12 flex items-end justify-between gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-medium uppercase tracking-widest text-primary", children: "The platform" }),
        /* @__PURE__ */ jsxs("h2", { className: "mt-3 text-4xl font-bold md:text-5xl", children: [
          "Six pillars. ",
          /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "One transformation." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "hidden max-w-sm text-muted-foreground md:block", children: "Not just tracking your health. Transforming it through intelligent, personalized, and context-aware guidance." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-5 md:grid-cols-2 lg:grid-cols-3", children: pillars.map(({
      icon: Icon,
      title,
      desc
    }) => /* @__PURE__ */ jsxs("div", { className: "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition hover:border-primary/50", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: title }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: desc }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition group-hover:opacity-100" })
    ] }, title)) })
  ] });
}
function LiveDashboard() {
  return /* @__PURE__ */ jsx("section", { id: "dashboard", className: "mx-auto max-w-7xl px-6 py-20", children: /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card/70 p-6 shadow-card md:p-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 flex flex-wrap items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm uppercase tracking-widest text-primary", children: "Companion view" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-2 text-3xl font-bold md:text-4xl", children: "A digital twin that watches over you." })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary", children: [
        /* @__PURE__ */ jsx("span", { className: "h-2 w-2 animate-pulse rounded-full bg-primary" }),
        " Streaming"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsx(VitalsCard, {}),
      /* @__PURE__ */ jsx(ThreatCard, {}),
      /* @__PURE__ */ jsx(ConsentCard, {})
    ] })
  ] }) });
}
function CompetitiveEdge() {
  const cards = [{
    title: "Reward integrity by design",
    desc: "Fraud-resistant reward scoring keeps incentives honest and preserves trust across millions of members."
  }, {
    title: "Adaptive support engine",
    desc: "Behavioral intelligence shifts goals and messaging when life changes, not just when data changes."
  }, {
    title: "Consent-led data governance",
    desc: "Fine-grained consent tracking and audit logs make every data decision transparent to users and regulators."
  }, {
    title: "Human review for high risk",
    desc: "High-stakes cases are escalated to people, keeping AI oversight accountable, fair, and competition-ready."
  }];
  return /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-7xl px-6 py-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm uppercase tracking-widest text-primary", children: "Competitive edge" }),
      /* @__PURE__ */ jsx("h2", { className: "mx-auto mt-3 max-w-3xl text-4xl font-bold md:text-5xl", children: "Built to stand out among healthcare AI challengers." }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-2xl text-muted-foreground", children: "Aegis blends predictive wellness, behavior economics, and enterprise trust so your product is not only more intelligent but more defensible." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2", children: cards.map((card) => /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-8 shadow-card transition hover:border-primary/50 hover:shadow-lg", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold", children: card.title }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: card.desc })
    ] }, card.title)) })
  ] });
}
function VitalsCard() {
  const bars = [38, 52, 61, 49, 68, 74, 63, 71, 80, 66, 58, 72, 84, 70];
  const heightClasses = ["h-[38%]", "h-[52%]", "h-[61%]", "h-[49%]", "h-[68%]", "h-[74%]", "h-[63%]", "h-[71%]", "h-[80%]", "h-[66%]", "h-[58%]", "h-[72%]", "h-[84%]", "h-[70%]"];
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-background/40 p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 text-primary" }),
        " Heart variability"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-primary", children: "Optimal" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 text-4xl font-bold", children: [
      "72 ",
      /* @__PURE__ */ jsx("span", { className: "text-base font-normal text-muted-foreground", children: "bpm" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 flex h-24 items-end gap-1", children: bars.map((h, i) => /* @__PURE__ */ jsx("div", { className: `flex-1 rounded-t bg-shield opacity-80 ${heightClasses[i]}` }, i)) }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 grid grid-cols-3 gap-2 text-center text-xs", children: [["SpO₂", "98%"], ["Stress", "Low"], ["Sleep", "7h 42m"]].map(([k, v]) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-secondary/60 p-2", children: [
      /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: k }),
      /* @__PURE__ */ jsx("div", { className: "font-semibold", children: v })
    ] }, k)) })
  ] });
}
function ThreatCard() {
  const events = [{
    ok: true,
    t: "10:42",
    msg: "Login verified · Face ID + WebAuthn"
  }, {
    ok: true,
    t: "10:38",
    msg: "Behavioral pattern matched (98.4%)"
  }, {
    ok: false,
    t: "09:12",
    msg: "Impossible travel blocked — Lagos → Berlin"
  }, {
    ok: true,
    t: "08:55",
    msg: "Data export request denied without consent"
  }];
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-background/40 p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-primary" }),
        " Threat shield"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-primary", children: "Active" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 text-4xl font-bold", children: [
      "3 ",
      /* @__PURE__ */ jsx("span", { className: "text-base font-normal text-muted-foreground", children: "threats blocked / 24h" })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "mt-6 space-y-3", children: events.map((e, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 rounded-lg bg-secondary/40 p-3 text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: `mt-1 h-2 w-2 shrink-0 rounded-full ${e.ok ? "bg-primary" : "bg-destructive"}` }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: e.t }),
        /* @__PURE__ */ jsx("div", { children: e.msg })
      ] })
    ] }, i)) })
  ] });
}
function ConsentCard() {
  const grants = [{
    who: "Dr. Adeyemi · Cardiology",
    scope: "Heart data · 30 days",
    on: true
  }, {
    who: "Mom (Emergency)",
    scope: "Vitals + location · always",
    on: true
  }, {
    who: "MetroHealth Research",
    scope: "Anonymized sleep · opt-in",
    on: false
  }, {
    who: "Lagos General ER",
    scope: "Break-glass access",
    on: true
  }];
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-background/40 p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(FileKey, { className: "h-4 w-4 text-primary" }),
        " Consent ledger"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-primary", children: "You're in control" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 text-4xl font-bold", children: [
      "4 ",
      /* @__PURE__ */ jsx("span", { className: "text-base font-normal text-muted-foreground", children: "active grants" })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "mt-6 space-y-3", children: grants.map((g, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between rounded-lg bg-secondary/40 p-3 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: g.who }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: g.scope })
      ] }),
      /* @__PURE__ */ jsx("span", { className: `relative inline-flex h-6 w-11 items-center rounded-full transition ${g.on ? "bg-shield" : "bg-secondary"}`, children: /* @__PURE__ */ jsx("span", { className: `absolute h-4 w-4 rounded-full bg-background transition ${g.on ? "right-1" : "left-1"}` }) })
    ] }, i)) })
  ] });
}
function BehaviorEngine() {
  const features = [{
    icon: Brain,
    title: "Continuous adaptation",
    desc: "The AI learns your daily habits, motivation levels, and real-world context. It shifts goals and tone based on life changes, not just yesterday's data."
  }, {
    icon: Clock,
    title: "Right-time nudges",
    desc: "Context-aware guidance that knows when you are ready for a challenge and when you need support. It nudges you with empathy, not noise."
  }, {
    icon: TrendingUp,
    title: "Predictive prevention",
    desc: "A predictive engine spots early warning signs like falling activity, rising stress, or poor sleep and suggests preventive actions ahead of time."
  }, {
    icon: Gift,
    title: "Reward ecosystem",
    desc: "Vitality-style incentives that reward consistency and healthy momentum. Points adapt to your progress, keeping motivation smart and sustainable."
  }, {
    icon: Target,
    title: "Habit formation science",
    desc: "Built on implementation intentions and habit stacking. Aegis turns lifestyle signals into simple, repetitive actions that become habits."
  }, {
    icon: Lightbulb,
    title: "Motivation sensing",
    desc: "Detects when your energy changes and adapts the experience — gentler encouragement when stressed, stronger goals when you are engaged."
  }];
  return /* @__PURE__ */ jsxs("section", { id: "behavior", className: "mx-auto max-w-7xl px-6 py-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm uppercase tracking-widest text-primary", children: "Behavior change engine" }),
      /* @__PURE__ */ jsxs("h2", { className: "mx-auto mt-3 max-w-3xl text-4xl font-bold md:text-5xl", children: [
        "Not just tracking. ",
        /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "Transforming." })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-2xl text-muted-foreground", children: "Aegis uses advanced AI and behavioral science to understand you deeply, adapt continuously, and guide you toward lasting healthy habits." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: features.map(({
      icon: Icon,
      title,
      desc
    }) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-card transition hover:border-primary/50 hover:shadow-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 grid h-12 w-12 place-items-center rounded-xl bg-shield/20 text-primary", children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: title }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: desc })
    ] }, title)) }),
    /* @__PURE__ */ jsx("div", { className: "mt-16 rounded-3xl border border-border bg-card/70 p-8 shadow-card md:p-12", children: /* @__PURE__ */ jsxs("div", { className: "grid items-center gap-10 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold md:text-4xl", children: "Multi-dimensional wellness intelligence" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground", children: "Aegis doesn't just track steps. It combines sleep quality, stress levels, physical activity, nutrition patterns, and even spending behavior to generate a complete, real-world understanding of your wellbeing. These connected insights reveal patterns you'd never see alone." }),
        /* @__PURE__ */ jsx("ul", { className: "mt-6 space-y-3", children: ["Sleep + stress correlation analysis", "Activity vs. spending behavior patterns", "Nutrition impact on cognitive performance", "Social connections and mental health links"].map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
          item
        ] }, item)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-background/50 p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Wellness correlation matrix" }),
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Live" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: [{
          label: "Sleep quality",
          value: 87,
          trend: "+5%",
          width: "w-[87%]"
        }, {
          label: "Stress levels",
          value: 42,
          trend: "-12%",
          width: "w-[42%]"
        }, {
          label: "Activity consistency",
          value: 78,
          trend: "+8%",
          width: "w-[78%]"
        }, {
          label: "Nutrition score",
          value: 65,
          trend: "+3%",
          width: "w-[65%]"
        }].map((metric) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-1 flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { children: metric.label }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-primary", children: metric.trend })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-2 rounded-full bg-secondary", children: /* @__PURE__ */ jsx("div", { className: `h-2 rounded-full bg-shield transition-all ${metric.width}` }) })
        ] }, metric.label)) })
      ] })
    ] }) })
  ] });
}
function FraudDetection() {
  const features = [{
    icon: ShieldAlert,
    title: "Health data fraud detection",
    desc: "Continuously monitors for unrealistic spikes, repeated 'perfect' entries, wearable vs self-reported mismatches, and reward-program gaming patterns."
  }, {
    icon: Users,
    title: "Account security intelligence",
    desc: "Anomaly detection flags access from unknown devices, impossible travel, repeated failed logins, and sudden profile or permission changes."
  }, {
    icon: FileText,
    title: "Data misuse prevention",
    desc: "Role-based access control and fine-grained consent ensure only authorized systems can read sensitive health records. Audit logs capture every action."
  }, {
    icon: Scale,
    title: "Transparent decision-making",
    desc: "Whenever a risk flag is raised, users and administrators see simple explanations, confidence scores, and the exact reasoning behind the finding."
  }, {
    icon: Gavel,
    title: "Human review escalation",
    desc: "High-risk cases are routed to human review to maintain ethical oversight, prevent bias, and ensure fair treatment."
  }, {
    icon: Network,
    title: "Enterprise-grade governance",
    desc: "Designed for large-scale healthcare and insurance ecosystems, with audit trails, consent receipts, compliance reporting, and ethical oversight baked in."
  }];
  return /* @__PURE__ */ jsxs("section", { id: "fraud", className: "mx-auto max-w-7xl px-6 py-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm uppercase tracking-widest text-primary", children: "Fraud detection & security intelligence" }),
      /* @__PURE__ */ jsxs("h2", { className: "mx-auto mt-3 max-w-3xl text-4xl font-bold md:text-5xl", children: [
        "Trustworthy. ",
        /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "Fair. Safe." })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-2xl text-muted-foreground", children: "Enterprise-level fraud detection and data governance ensuring rewards systems remain fair, accurate, and suitable for large-scale healthcare and insurance deployment." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: features.map(({
      icon: Icon,
      title,
      desc
    }) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-card transition hover:border-primary/50 hover:shadow-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 grid h-12 w-12 place-items-center rounded-xl bg-shield/20 text-primary", children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: title }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: desc })
    ] }, title)) }),
    /* @__PURE__ */ jsx("div", { className: "mt-16 rounded-3xl border border-border bg-card/70 p-8 shadow-card md:p-12", children: /* @__PURE__ */ jsxs("div", { className: "grid items-center gap-10 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold md:text-4xl", children: "Built for enterprise healthcare" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground", children: "Designed for large-scale digital health ecosystems like Discovery Limited. Aegis integrates predictive health intelligence with enterprise-level security, fraud prevention, and ethical data governance — making it innovative and suitable for real-world deployment." }),
        /* @__PURE__ */ jsx("ul", { className: "mt-6 space-y-3", children: ["HIPAA, GDPR, ISO 27001, SOC 2 Type II compliant", "Immutable audit trails for all data access", "Real-time fraud scoring with confidence intervals", "Automated escalation for high-risk cases", "Fair reward systems protected from manipulation"].map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
          item
        ] }, item)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-background/50 p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Fraud risk monitoring" }),
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Live" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: [{
          label: "Data consistency score",
          value: 94,
          trend: "Normal",
          width: "w-[94%]"
        }, {
          label: "Account security rating",
          value: 98,
          trend: "Secure",
          width: "w-[98%]"
        }, {
          label: "Reward system integrity",
          value: 96,
          trend: "Protected",
          width: "w-[96%]"
        }, {
          label: "Compliance status",
          value: 100,
          trend: "Compliant",
          width: "w-[100%]"
        }].map((metric) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-1 flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { children: metric.label }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-primary", children: metric.trend })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-2 rounded-full bg-secondary", children: /* @__PURE__ */ jsx("div", { className: `h-2 rounded-full bg-shield transition-all ${metric.width}` }) })
        ] }, metric.label)) })
      ] })
    ] }) })
  ] });
}
const layers = [{
  icon: Lock,
  t: "End-to-end & at-rest encryption",
  d: "AES-256 for stored records, TLS 1.3 in transit, and per-user encryption keys. Zero-knowledge architecture encrypts sensitive fields client-side."
}, {
  icon: Network,
  t: "Role-based access & consent controls",
  d: "Only authorized systems and roles can read sensitive health fields. Consent scopes and approvals are enforced before any access is granted."
}, {
  icon: ScanFace,
  t: "Adaptive multi-factor authentication",
  d: "Biometrics, OTP, and FIDO2/WebAuthn. AI raises friction only when behavioral or contextual risk exceeds safe thresholds."
}, {
  icon: Zap,
  t: "AI-driven security intelligence",
  d: "Behavioral biometrics and anomaly engines flag impossible travel, unknown devices, repeated compromise attempts, and suspicious data access patterns."
}];
function SecurityStack() {
  return /* @__PURE__ */ jsx("section", { id: "security", className: "mx-auto max-w-7xl px-6 py-20", children: /* @__PURE__ */ jsxs("div", { className: "grid items-start gap-12 lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:sticky lg:top-28", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm uppercase tracking-widest text-primary", children: "Security stack" }),
      /* @__PURE__ */ jsxs("h2", { className: "mt-3 text-4xl font-bold md:text-5xl", children: [
        "Bank-level security. ",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "Patient-level empathy." })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-6 text-muted-foreground", children: "Four layers cooperate so the system stays useful when it matters most — and useless to anyone who shouldn't see your data." }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 flex flex-wrap gap-2", children: ["HIPAA", "GDPR", "ISO 27001", "SOC 2 II"].map((c) => /* @__PURE__ */ jsx("span", { className: "rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground", children: c }, c)) })
    ] }),
    /* @__PURE__ */ jsx("ol", { className: "space-y-4", children: layers.map(({
      icon: Icon,
      t,
      d
    }, i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-card", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-shield/20 text-primary", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "text-xs font-mono text-muted-foreground", children: [
          "Layer 0",
          i + 1
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "mt-1 text-lg font-semibold", children: t }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: d })
      ] })
    ] }, t)) })
  ] }) });
}
function EmergencyBand() {
  return /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 py-20", children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-3xl border border-destructive/30 bg-card p-8 shadow-card md:p-12", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute -right-20 -top-20 h-72 w-72 rounded-full bg-destructive/20 blur-3xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative grid items-center gap-10 md:grid-cols-[1.2fr,1fr]", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs text-destructive", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-3 w-3" }),
          " Life-safety mode"
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "mt-4 text-3xl font-bold md:text-4xl", children: "When seconds matter, Aegis already moved." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground", children: "Continuous vital monitoring predicts cardiac events, seizures, and hypoglycemia before they peak. Fall detection with automatic SOS to emergency contacts shares live location, allergies, blood type, and current meds. Mental-health early warning detects depression or suicidal ideation patterns and routes to crisis lines." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-background/50 p-5 font-mono text-xs", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { children: "aegis · emergency.log" }),
          /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "LIVE" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-1.5", children: [
          /* @__PURE__ */ jsx(Line, { c: "text-muted-foreground", children: "› monitoring 14 channels…" }),
          /* @__PURE__ */ jsx(Line, { c: "text-foreground", children: "› HRV deviation +3.2σ detected" }),
          /* @__PURE__ */ jsx(Line, { c: "text-foreground", children: "› cross-checking respiration, posture" }),
          /* @__PURE__ */ jsx(Line, { c: "text-destructive", children: "› pattern: pre-syncope (87% conf.)" }),
          /* @__PURE__ */ jsx(Line, { c: "text-foreground", children: "› SOS armed · waiting 12s for cancel" }),
          /* @__PURE__ */ jsx(Line, { c: "text-primary", children: "› contacts notified · ER linked · medkit summary sent" }),
          /* @__PURE__ */ jsx(Line, { c: "text-primary", children: "✓ Paramedic break-glass session active" })
        ] })
      ] })
    ] })
  ] }) });
}
function Line({
  children,
  c
}) {
  return /* @__PURE__ */ jsx("div", { className: c, children });
}
function Ethics() {
  const items = [{
    t: "Explainable AI (XAI)",
    d: "Every recommendation comes with 'why we suggested this' in plain language, including which data points influenced it. Full transparency on decision-making."
  }, {
    t: "Continuous bias audits",
    d: "Models continuously tested across age, gender, ethnicity, and socioeconomic groups. Results published in public transparency report."
  }, {
    t: "Human-in-the-loop",
    d: "High-stakes recommendations (diagnoses, medication changes) always require licensed clinician review before reaching the user."
  }, {
    t: "Consent-by-design",
    d: "Opt-in for every new data use. No dark patterns. Consent receipts emailed to the user. True cryptographic erasure for right to be forgotten."
  }];
  return /* @__PURE__ */ jsxs("section", { id: "ethics", className: "mx-auto max-w-7xl px-6 py-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm uppercase tracking-widest text-primary", children: "Responsible AI" }),
      /* @__PURE__ */ jsxs("h2", { className: "mx-auto mt-3 max-w-2xl text-4xl font-bold md:text-5xl", children: [
        "Powerful enough to predict.",
        " ",
        /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "Humble enough to explain." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-5 md:grid-cols-2 lg:grid-cols-4", children: items.map((it) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-card", children: [
      /* @__PURE__ */ jsx("div", { className: "h-1 w-10 rounded-full bg-shield" }),
      /* @__PURE__ */ jsx("h3", { className: "mt-4 text-lg font-semibold", children: it.t }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: it.d })
    ] }, it.t)) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-16 overflow-hidden rounded-3xl border border-border bg-card p-10 text-center shadow-card", children: [
      /* @__PURE__ */ jsx("h3", { className: "mx-auto max-w-2xl text-3xl font-bold md:text-4xl", children: "A trust infrastructure for personal health." }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-xl text-muted-foreground", children: "Not another wellness app. A system intelligent enough to save lives, private enough that people actually use it, and ethical enough to set the standard." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap justify-center gap-3", children: [
        /* @__PURE__ */ jsxs("button", { className: "inline-flex items-center gap-2 rounded-full bg-shield px-6 py-3 font-medium text-primary-foreground shadow-glow", children: [
          "Request a pilot ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "rounded-full border border-border bg-card px-6 py-3 font-medium hover:bg-secondary", children: "Read the whitepaper" })
      ] })
    ] })
  ] });
}
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "border-t border-border", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground md:flex-row", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-primary" }),
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Aegis Health · AI for Safer Communities"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
      /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-foreground", children: "Privacy" }),
      /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-foreground", children: "Consent ledger" }),
      /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-foreground", children: "Transparency report" })
    ] })
  ] }) });
}
export {
  Index as component
};
