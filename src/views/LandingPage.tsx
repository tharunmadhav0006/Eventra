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
  Calendar
} from "lucide-react";

interface LandingPageProps {
  onStartAuth: (mode: "login" | "register") => void;
}

export default function LandingPage({ onStartAuth }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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
