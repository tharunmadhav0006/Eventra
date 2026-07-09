import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  ShieldCheck, 
  Users2, 
  ChevronDown, 
  DollarSign, 
  Zap, 
  Activity, 
  Lock, 
  MessageSquare,
  Ticket,
  Calendar,
  Sliders,
  Gem,
  QrCode,
  MapPin
} from "lucide-react";

interface LandingPageProps {
  onStartAuth: (mode: "login" | "register") => void;
}

export default function LandingPage({ onStartAuth }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedDemoEvent, setSelectedDemoEvent] = useState(0);
  const [ticketTier, setTicketTier] = useState<"Standard" | "VIP Premium" | "Elite Access">("VIP Premium");
  const [ticketUpgraded, setTicketUpgraded] = useState(false);

  const demoEvents = [
    {
      name: "Global AI Solstice Summit",
      tagline: "Unifying Silicon & Creativity",
      date: "Oct 24, 2026",
      location: "Imperial Palace, Tokyo",
      badgeColor: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/30",
      gradient: "from-blue-500/20 via-transparent to-transparent",
      accentGlow: "shadow-blue-500/20",
      accentText: "text-blue-600 dark:text-blue-400",
      accentBg: "bg-blue-600 hover:bg-blue-500",
      badgeText: "AI ECOSYSTEM COHORT",
      stats: { entries: "1,240 / 1,500", revenue: "₹4.8M", speakers: "32 Masters" }
    },
    {
      name: "Grand Verdant Charity Gala",
      tagline: "A Night for Sanctuary Preservation",
      date: "Nov 12, 2026",
      location: "Royal Garden Conservatories",
      badgeColor: "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/30",
      gradient: "from-purple-500/20 via-transparent to-transparent",
      accentGlow: "shadow-purple-500/20",
      accentText: "text-purple-600 dark:text-purple-400",
      accentBg: "bg-purple-600 hover:bg-purple-500",
      badgeText: "VERDANT ELITE STEWARDS",
      stats: { entries: "450 / 500", revenue: "₹12.4M", speakers: "12 VIPs" }
    },
    {
      name: "Acme National Symphony Orchestra",
      tagline: "Soundscapes of Classic Brilliance",
      date: "Dec 31, 2026",
      location: "Symphony Concert Hall, Mumbai",
      badgeColor: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-300 border-blue-100 dark:border-blue-900/20",
      gradient: "from-blue-600/10 via-transparent to-transparent",
      accentGlow: "shadow-blue-600/10",
      accentText: "text-blue-500 dark:text-blue-300",
      accentBg: "bg-blue-700 hover:bg-blue-600",
      badgeText: "CREATIVE PATRONS SOCIETY",
      stats: { entries: "1,850 / 2,000", revenue: "₹8.5M", speakers: "8 Composers" }
    }
  ];

  const features = [
    {
      title: "Intelligent AI Copilot",
      desc: "Instant budget drafting, keynote speaker matching algorithms, and automated operational risk evaluations under milliseconds.",
      icon: Sparkles,
      color: "from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400"
    },
    {
      title: "Multi-Role Dashboards",
      desc: "Decoupled portals for Sponsors, Speakers, Vendors, Volunteers, and Attendees for precise, tailor-made user journeys.",
      icon: Users2,
      color: "from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400"
    },
    {
      title: "Full-Scale QR Passes",
      desc: "Simulate ticket distribution, coupon workflows, secure QR check-in scanning, and instantaneous badge generation.",
      icon: Ticket,
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Interactive Reporting Suite",
      desc: "Direct data exports in multiple formats, live revenue charts, conversion analytics, and geographical seat layouts.",
      icon: Activity,
      color: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400"
    }
  ];

  const pricingPlans = [
    {
      name: "Community",
      price: "₹0",
      desc: "Perfect for local organizers, NGOs, and student clubs.",
      features: [
        "Up to 2 active draft events",
        "Standard check-in scanner UI",
        "Basic ticket types",
        "Community discussion boards",
        "Standard local scheduling tools"
      ],
      cta: "Get Started Free",
      isPopular: false
    },
    {
      name: "Enterprise",
      price: "₹24,900",
      period: "/month",
      desc: "Designed for universities, growing companies, and global startups.",
      features: [
        "Unlimited active & live events",
        "AI Event Planning Assistant (Flash-3.5)",
        "Decoupled multi-role portals (all 10 roles)",
        "Advanced ticket tiers & QR badge printers",
        "Detailed financial reports & PDF exports",
        "Dedicated billing, settings & custom styling"
      ],
      cta: "Start 14-Day Free Trial",
      isPopular: true
    },
    {
      name: "Strategic Vault",
      price: "Custom",
      desc: "High-volume orchestration, multi-branch colleges, and government agencies.",
      features: [
        "Enterprise-grade private database integrations",
        "Unrestricted API Access & Custom Keys",
        "Dedicated account managers",
        "Whitelabel customized branding configurations",
        "24/7 Priority Emergency support desks"
      ],
      cta: "Contact Enterprise Sales",
      isPopular: false
    }
  ];

  const faqs = [
    {
      q: "What is EVENTRA and what makes it different from simple event organizers?",
      a: "EVENTRA is a fully integrated, multi-role event management ecosystem. Rather than just offering generic lists, it delivers independent dashboards for all core actors (Sponsors, Speakers, Vendors, Volunteers, and Admins) so they can collaborate synchronously in real-time."
    },
    {
      q: "Does the AI assistant require a separate Gemini API account?",
      a: "No! The floating AI assistant comes fully configured out of the box. Users with premium requirements can also customize credentials through the integrations panel under Settings."
    },
    {
      q: "Is EVENTRA responsive for on-site managers and check-in volunteers?",
      a: "Absolutely. EVENTRA features full mobile adaptivity. Check-in staff can use the integrated QR scanner directly on their mobile phones to verify tickets and print badges without external hardware."
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-screen">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-slate-200 dark:border-slate-900 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-sans font-bold text-lg text-slate-900 dark:text-white tracking-tight">EVENTRA</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            id="nav-login-btn"
            onClick={() => onStartAuth("login")}
            className="px-4 py-2 text-sm font-medium font-sans text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            Log In
          </button>
          <button 
            id="nav-register-btn"
            onClick={() => onStartAuth("register")}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-medium font-sans rounded-xl shadow-md transition-all"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-900/40 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-sans font-semibold text-blue-700 dark:text-blue-400 tracking-wide uppercase">AI-Powered Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-sans font-bold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Orchestrate Premium Events <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
              With Enterprise Intelligence
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg font-sans text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The single platform for startups, communities, and Fortune 500 enterprises. Schedule speakers, coordinate sponsors, manage tickets, scan entries, and leverage real-time metrics seamlessly.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-get-started-btn"
              onClick={() => onStartAuth("register")}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold font-sans text-sm rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center space-x-2 transition-all active:scale-98 group"
            >
              <span>Initialize Workspace</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              id="hero-contact-sales-btn"
              onClick={() => onStartAuth("login")}
              className="w-full sm:w-auto px-7 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 font-semibold font-sans text-sm text-slate-700 dark:text-slate-300 rounded-xl shadow-sm transition-all flex items-center justify-center"
            >
              Demo Sandbox
            </button>
          </div>

          {/* Trusted Companies Section */}
          <div className="mt-20 border-t border-slate-200 dark:border-slate-900 pt-10">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">Empowering Events At Outstanding Organizations</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60 grayscale dark:invert">
              <span className="font-sans font-bold tracking-tight text-lg">Stripe</span>
              <span className="font-sans font-bold tracking-tight text-lg">Google Cloud</span>
              <span className="font-sans font-bold tracking-tight text-lg">Figma</span>
              <span className="font-sans font-bold tracking-tight text-lg">Linear</span>
              <span className="font-sans font-bold tracking-tight text-lg">Vercel</span>
            </div>
          </div>

          {/* EXQUISITE INTERACTIVE EVENT BRANDING & TICKET DESIGN SANDBOX */}
          <div className="mt-24 max-w-5xl mx-auto text-left">
            <div className="text-center mb-10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 font-bold px-3 py-1 bg-purple-500/10 rounded-full">
                Interactive Design Sandbox
              </span>
              <h2 className="text-3xl font-sans font-bold text-slate-900 dark:text-white mt-3 tracking-tight">
                Design & Experience Your Luxe Event Brand
              </h2>
              <p className="text-sm font-sans text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
                Toggle between curated themes to see how our new elegant visual engine and custom holographic passes change dynamic values instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Sandbox Control Console */}
              <div className="lg:col-span-5 flex flex-col justify-between p-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-900 rounded-2xl shadow-sm">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Console Controls</span>
                  </div>

                  {/* Step 1: Select Event */}
                  <div className="space-y-3">
                    <label className="text-xs font-sans font-semibold text-slate-600 dark:text-slate-400 block">
                      1. Choose Event Theme
                    </label>
                    <div className="space-y-2">
                      {demoEvents.map((evt, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedDemoEvent(idx)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all text-xs font-sans font-medium
                            ${selectedDemoEvent === idx
                              ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-500/50 text-blue-800 dark:text-blue-300 ring-2 ring-blue-500/5"
                              : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400"}`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-purple-500" : "bg-emerald-500"}`} />
                            <span>{evt.name.split(" ").slice(0, 3).join(" ")}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 block">{evt.date.split(",")[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Set Ticket Tier */}
                  <div className="mt-6 space-y-3">
                    <label className="text-xs font-sans font-semibold text-slate-600 dark:text-slate-400 block">
                      2. Configure Privilege Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Standard", "VIP Premium", "Elite Access"] as const).map((tier) => (
                        <button
                          key={tier}
                          onClick={() => {
                            setTicketTier(tier);
                            if (tier !== "Standard") setTicketUpgraded(true);
                          }}
                          className={`py-2 px-1.5 rounded-lg border text-center text-[10px] font-sans font-semibold tracking-wider transition-all
                            ${ticketTier === tier
                              ? "bg-slate-900 dark:bg-blue-600 border-transparent text-white shadow-sm"
                              : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simulated Revenue Calculator */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold">Estimated Conversion</span>
                    <span className="text-xs font-mono font-bold text-emerald-500 uppercase">Live Active</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-950 rounded-xl text-center">
                      <span className="text-[9px] font-mono text-slate-400 block">Registrations</span>
                      <span className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{demoEvents[selectedDemoEvent].stats.entries.split(" ")[0]}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-950 rounded-xl text-center">
                      <span className="text-[9px] font-mono text-slate-400 block">Gross Yield</span>
                      <span className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                        {ticketTier === "Standard" ? "₹1.2M" : ticketTier === "VIP Premium" ? demoEvents[selectedDemoEvent].stats.revenue : "₹18.5M"}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-950 rounded-xl text-center">
                      <span className="text-[9px] font-mono text-slate-400 block">Core Scale</span>
                      <span className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{demoEvents[selectedDemoEvent].stats.speakers.split(" ")[0]} Speakers</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Holographic Ticket Display */}
              <div className="lg:col-span-7 flex items-center justify-center p-8 bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-900 rounded-2xl relative overflow-hidden min-h-[360px]">
                {/* Visual Backdrop Radiance Glow */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr ${demoEvents[selectedDemoEvent].gradient} rounded-full blur-2xl pointer-events-none transition-all duration-500`} />
                
                {/* Premium Ticket Card Shell */}
                <div 
                  className={`w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl p-6 relative transition-all duration-300
                    ${ticketTier === "VIP Premium" ? "ring-2 ring-purple-400 dark:ring-purple-500/30" : ticketTier === "Elite Access" ? "ring-2 ring-blue-500 dark:ring-blue-500/40" : ""}`}
                >
                  {/* Foil Shimmer Overlays */}
                  {ticketTier !== "Standard" && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/5 to-blue-500/5 rounded-2xl pointer-events-none mix-blend-color-dodge animate-pulse" />
                  )}

                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-md bg-slate-900 dark:bg-slate-800 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase">
                        EVENTRA PASS
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded border text-[8px] font-mono font-bold tracking-wider uppercase ${demoEvents[selectedDemoEvent].badgeColor}`}>
                      {ticketTier}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mb-6">
                    <h4 className="text-base font-sans font-bold text-slate-900 dark:text-white leading-tight">
                      {demoEvents[selectedDemoEvent].name}
                    </h4>
                    <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 mt-1 italic">
                      "{demoEvents[selectedDemoEvent].tagline}"
                    </p>
                  </div>

                  {/* Location & Time Grid */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-slate-800/80 mb-6 text-xs">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">Venue Portal</span>
                      <div className="flex items-center space-x-1 text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{demoEvents[selectedDemoEvent].location}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">Schedule Date</span>
                      <div className="flex items-center space-x-1 text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{demoEvents[selectedDemoEvent].date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Holographic QR Codes & ID footer */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">Holo Seat claims</span>
                      <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">
                        {ticketTier === "Standard" ? "SEC-B / G-4" : ticketTier === "VIP Premium" ? "ROW-A / V-12" : "BOX-01 / ELITE-1"}
                      </span>
                      <span className="text-[9px] block font-mono text-slate-400 mt-1 tracking-tight">PASS-ID: #882410-ENTRA</span>
                    </div>

                    {/* QR Code Icon with luxury glow */}
                    <div className="flex flex-col items-center">
                      <div className={`p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/80 relative group-hover:scale-105 transition-all shadow-sm
                        ${ticketTier !== "Standard" ? "border-purple-200 dark:border-purple-900/40 shadow-purple-500/5" : ""}`}
                      >
                        <QrCode className={`w-10 h-10 ${ticketTier !== "Standard" ? "text-purple-600 dark:text-purple-400" : "text-slate-600 dark:text-slate-400"}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/20 border-y border-slate-200 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">An Exhaustive Operational System</h2>
            <p className="text-sm font-sans text-slate-500 dark:text-slate-400 mt-2">No gaps. No custom connectors needed. It is fully built-in.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={i} 
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase text-blue-600 dark:text-blue-400 font-bold tracking-widest">Platform Pricing</span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 dark:text-white tracking-tight mt-2">Predictable Plans for Every Scale</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => {
              return (
                <div 
                  key={i}
                  className={`p-8 bg-white dark:bg-slate-900 border rounded-3xl relative flex flex-col justify-between shadow-sm
                    ${plan.isPopular 
                      ? "border-blue-500 dark:border-blue-600 ring-4 ring-blue-500/10 dark:ring-blue-600/5" 
                      : "border-slate-200 dark:border-slate-800/80"}`}
                >
                  {plan.isPopular && (
                    <span className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Most Selected
                    </span>
                  )}
                  <div>
                    <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">{plan.name}</h3>
                    <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{plan.desc}</p>
                    
                    <div className="mt-6 flex items-baseline">
                      <span className="text-3xl sm:text-4xl font-sans font-extrabold text-slate-900 dark:text-white tracking-tight">{plan.price}</span>
                      {plan.period && <span className="text-xs font-sans text-slate-400 ml-1">{plan.period}</span>}
                    </div>

                    <ul className="mt-8 space-y-3">
                      {plan.features.map((f, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-xs font-sans text-slate-600 dark:text-slate-300 leading-normal">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    id={`pricing-btn-${plan.name.toLowerCase()}`}
                    onClick={() => onStartAuth("register")}
                    className={`w-full mt-8 py-3 rounded-xl font-sans text-xs font-semibold tracking-wider transition-all
                      ${plan.isPopular 
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/10" 
                        : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"}`}
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/20 border-t border-slate-200 dark:border-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-sans font-bold text-slate-900 dark:text-white">General Questions</h2>
            <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-1">Everything you need to know about Eventra systems.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isSelected = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
                >
                  <button
                    id={`faq-toggle-${idx}`}
                    onClick={() => setActiveFaq(isSelected ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-sans font-medium text-slate-900 dark:text-white text-sm"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? "rotate-180" : ""}`} />
                  </button>
                  {isSelected && (
                    <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80">
                      <p className="text-xs font-sans text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 py-12 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-sans font-bold text-sm tracking-tight text-slate-950 dark:text-white">EVENTRA Enterprise</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">&copy; 2026 EVENTRA Inc. All Rights Reserved. Fully Certified WCAG 2.1.</span>
        </div>
      </footer>
    </div>
  );
}
