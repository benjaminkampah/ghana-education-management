'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  BookOpen,
  Compass,
  CheckCircle2,
  Calculator,
  ChevronRight,
  Star,
  Zap,
  Users,
  MapPin,
  ExternalLink,
  HelpCircle,
  Cpu,
  Layers,
  GraduationCap,
  Building2,
  Lock,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Check,
  Copy,
} from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import { AiChatWidget } from '../components/AiChatWidget';
import { User } from '../lib/types';
import { VERIFIED_INSTITUTIONS, OPPORTUNITIES } from '../lib/mockData';

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [chatOpen, setChatOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Live Interactive Simulator State
  const [mathGrade, setMathGrade] = useState(2);
  const [englishGrade, setEnglishGrade] = useState(1);
  const [scienceGrade, setScienceGrade] = useState(2);
  const [socialGrade, setSocialGrade] = useState(2);
  const [electivesSum, setElectivesSum] = useState(3); // 2 best electives

  const simulatedAggregate = mathGrade + englishGrade + scienceGrade + socialGrade + electivesSum;

  const getFeasibility = (agg: number) => {
    if (agg <= 9) return { label: 'Category A Elite Placement Tier', color: 'text-amber-400', badge: 'bg-amber-500/15 border-amber-500/40 text-amber-300' };
    if (agg <= 14) return { label: 'Category A / High Category B Merit', color: 'text-emerald-400', badge: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' };
    if (agg <= 24) return { label: 'Category B & TVET Placement Tier', color: 'text-cyan-400', badge: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' };
    return { label: 'General Placement Pathway', color: 'text-slate-400', badge: 'bg-slate-800 border-slate-700 text-slate-400' };
  };

  const feasibility = getFeasibility(simulatedAggregate);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAuthSuccess = (user: User, token: string) => {
    try {
      localStorage.setItem('antigravity_user', JSON.stringify(user));
      localStorage.setItem('antigravity_token', token);
    } catch {}
    window.location.href = '/dashboard';
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050812] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Sticky Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#050812]/92 backdrop-blur-2xl">
        <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 opacity-90" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-400 p-[2px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-emerald-400 group-hover:rotate-6 transition-transform" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-[#050812]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors font-display">
                    Antigravity
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Ghana JHS
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  Talent & Innovation Academy
                </span>
              </div>
            </Link>

            {/* Nav Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
              <a href="#simulator" className="hover:text-white transition-colors">BECE Simulator</a>
              <a href="#institutions" className="hover:text-white transition-colors">Schools Directory</a>
              <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
              <a href="#scholar" className="hover:text-white transition-colors">Scholar Spotlight</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </nav>

            {/* Action Group */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setChatOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-amber-300 border border-amber-500/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Guide</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </button>

              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-300 text-slate-950 hover:brightness-110 active:scale-95 shadow-md shadow-emerald-500/20 transition-all"
              >
                <span>Launch App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 border-b border-white/[0.08]">
        {/* Radiant Ambient Mesh Lights */}
        <div className="absolute -top-40 left-1/4 w-[650px] h-[650px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-amber-500/12 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* National Badge Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs font-semibold mb-6 shadow-inner animate-float">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">Republic of Ghana • GES & CSSPS Aligned</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-extrabold">Talent & Innovation Academy (Phase 1)</span>
            </div>

            {/* Hero Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] font-display">
              The Operating System for Ghanaian{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Educational Pathways
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Eliminate guesswork in Senior High School placement. Real-time deterministic BECE aggregate simulation, verified Category A & TVET school insights, and zero-hallucination scholarship matching for Ghanaian JHS learners.
            </p>

            {/* Call to Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-300 text-slate-950 font-black text-sm hover:brightness-110 active:scale-95 shadow-2xl shadow-emerald-500/30 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Launch Academy Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthModalOpen(true);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] text-white text-sm font-bold border border-white/10 hover:border-white/20 transition-all active:scale-95"
              >
                <span>Create Free Learner Profile</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Compliance Guarantee Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Zero AI Hallucinations in Matching
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                GES & CSSPS Policy Grounded
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                1536-dim pgvector RAG System
              </span>
            </div>
          </div>

          {/* Hero Visual Mockup: Cinematic Image in an Apple-grade Chassis */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden glass-panel p-2 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.9)] border border-white/10">
              {/* Chassis Browser Top Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/[0.08] rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <div className="px-4 py-1 rounded-xl bg-white/[0.05] border border-white/5 text-[11px] font-mono text-slate-400 flex items-center gap-2">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>https://antigravity.edu.gh/dashboard/bece-cockpit</span>
                </div>
                <div className="w-12" />
              </div>

              {/* Chassis Image Body */}
              <div className="relative aspect-[16/9] w-full rounded-b-2xl overflow-hidden">
                <Image
                  src="/images/hero_scholars.jpg"
                  alt="Ghanaian Junior High School scholars collaborating on robotics in an innovation laboratory"
                  fill
                  priority
                  className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050812] via-transparent to-transparent opacity-50" />
              </div>

              {/* Floating Live Badge 1 (Top Left) */}
              <div className="absolute top-16 left-6 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/85 border border-emerald-500/40 backdrop-blur-xl shadow-2xl animate-float">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">Module 3 Boolean Engine</div>
                  <div className="text-[10px] text-emerald-400 font-bold">100% Deterministic Matching</div>
                </div>
              </div>

              {/* Floating Live Badge 2 (Bottom Right) */}
              <div className="absolute bottom-8 right-6 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/85 border border-amber-500/40 backdrop-blur-xl shadow-2xl animate-float-delayed">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">Category A Feasibility</div>
                  <div className="text-[10px] text-amber-300 font-bold">Prempeh • Achimota • Wesley Girls</div>
                </div>
              </div>
            </div>

            {/* Institutional Trust Logos Strip */}
            <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-4">
                Policy-Grounded Intelligence In Collaboration With National Educational Standards
              </span>
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all">
                <span className="text-xs font-black text-slate-300 tracking-wider">GHANA EDUCATION SERVICE (GES)</span>
                <span className="text-xs font-black text-slate-300 tracking-wider">CSSPS SECRETARIAT</span>
                <span className="text-xs font-black text-slate-300 tracking-wider">MASTERCARD FOUNDATION</span>
                <span className="text-xs font-black text-slate-300 tracking-wider">WAEC GHANA</span>
                <span className="text-xs font-black text-slate-300 tracking-wider">KNUST INNOVATION</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM VS SOLUTION SECTION */}
      <section className="py-20 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 block mb-2">
              Why We Built Project Antigravity
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display">
              Replacing Opaque Placement Guesswork with Mathematical Rigor
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed font-medium">
              Over 550,000 Ghanaian learners take the BECE annually, yet secondary placement guidance remains fractured, manual, and susceptible to inaccurate advice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div className="p-7 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">The Placement Dilemma</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Confusing raw scores versus aggregate scores, unknown Category A cutoff standards, and misunderstood public-school 30% quotas lead to poor school choices and missed admissions.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-white/5 text-[11px] font-bold text-rose-400">
                Traditional Approach: High Risk
              </div>
            </div>

            {/* Column 2 */}
            <div className="p-7 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Zero AI Guesswork</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generic AI chatbots hallucinate scholarship criteria and make fictional placement promises. Antigravity isolates Module 3 in strict deterministic boolean JSONB code.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-white/5 text-[11px] font-bold text-amber-300">
                Antigravity Standard: 100% Deterministic
              </div>
            </div>

            {/* Column 3 */}
            <div className="p-7 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Direct Opportunity Unlocking</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automatically pairs your academic parameters with secondary bursaries, STEM grants, and TVET vocational programs with official CSSPS institution codes.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-white/5 text-[11px] font-bold text-emerald-400">
                Antigravity Standard: Full Pathway Transparency
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE BECE SIMULATOR SANDBOX */}
      <section id="simulator" className="py-20 border-b border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    Interactive Live Sandbox
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display">
                  Test the BECE Aggregate Simulator
                </h2>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed font-medium">
                  Adjust core subject grades below. Watch the CSSPS aggregate compute live, determining your Category A, B, or TVET technical feasibility.
                </p>

                {/* Subject Grade Steppers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                  {[
                    { label: 'Core Maths', value: mathGrade, setter: setMathGrade },
                    { label: 'English', value: englishGrade, setter: setEnglishGrade },
                    { label: 'Int. Science', value: scienceGrade, setter: setScienceGrade },
                    { label: 'Social Studies', value: socialGrade, setter: setSocialGrade },
                  ].map((s, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-black/50 border border-white/10 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{s.label}</span>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => s.setter(Math.max(1, s.value - 1))}
                          className="w-6 h-6 rounded-lg bg-white/10 text-white font-bold hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-base font-black text-emerald-400 font-mono">Grade {s.value}</span>
                        <button
                          type="button"
                          onClick={() => s.setter(Math.min(9, s.value + 1))}
                          className="w-6 h-6 rounded-lg bg-white/10 text-white font-bold hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gauge Result Card */}
              <div className="lg:w-96 p-6 rounded-3xl bg-black/60 border border-white/10 shadow-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Simulated BECE Aggregate:
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-5xl font-black text-amber-300 font-mono tracking-tight">
                      {simulatedAggregate}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">/ 54</span>
                  </div>

                  <div className="mt-3">
                    <span className={`inline-block px-3 py-1 text-xs font-black uppercase rounded-full border ${feasibility.badge} ${feasibility.color}`}>
                      {feasibility.label}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                    Sum of 4 Core Subjects + Best 2 Electives (sum {electivesSum}). Fully synchronized with Module 3 Opportunity Matcher.
                  </p>
                </div>

                <Link
                  href="/dashboard"
                  className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <span>Open Full Cockpit in Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAMPUS SHOWCASE & INSTITUTIONS DIRECTORY */}
      <section id="institutions" className="py-20 border-b border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Campus Image Frame */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden glass-panel p-2 shadow-2xl border border-white/10">
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden">
                  <Image
                    src="/images/campus_prestige.jpg"
                    alt="Prestigious Ghanaian Senior High School campus with historic stone architecture and royal palm trees"
                    fill
                    className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050812] via-transparent to-transparent opacity-40" />
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-3 p-3 rounded-2xl bg-slate-950/90 border border-white/10 backdrop-blur-xl shadow-2xl">
                <Compass className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-bold text-white">8 Verified Senior Secondary & TVET Campuses</span>
              </div>
            </div>

            {/* Editorial */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                <Compass className="w-3.5 h-3.5" />
                <span>Verified CSSPS Directory</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display">
                Discover Premier Category A, STEM & TVET Institutions
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                From heritage Category A boarding institutions like Prempeh College, Achimota School, and Wesley Girls, to modern STEM academies and TVET technical institutes—browse official CSSPS codes, cut-off standards, and programme offerings.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                    <Star className="w-4 h-4 fill-amber-300" />
                    <span>Category A SHS</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Aggregates 6–10 • Highly selective premier boarding.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-1">
                    <Cpu className="w-4 h-4" />
                    <span>STEM Academies</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Robotics, Artificial Intelligence & Biomedical tracks.</p>
                </div>
              </div>

              {/* Institutions Quick Preview List */}
              <div className="space-y-2 pt-2">
                {VERIFIED_INSTITUTIONS.slice(0, 3).map((inst) => (
                  <div
                    key={inst.id}
                    className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{inst.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Category {inst.category} • {inst.region} Region • {inst.programmes.slice(0, 2).join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-emerald-400">
                        {inst.csspsCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(inst.csspsCode)}
                        className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                        title="Copy CSSPS Code"
                      >
                        {copiedCode === inst.csspsCode ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] text-xs font-bold text-white border border-white/10 hover:border-cyan-400/40 transition-all"
              >
                <span>Browse Full 8 Institutions Directory</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SCHOLAR SUCCESS SPOTLIGHT */}
      <section id="scholar" className="py-20 border-b border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Scholar Editorial */}
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>Merit Scholar Spotlight</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display">
                Empowering the Next Generation of Ghanaian Leaders
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Every Ghanaian learner deserves transparent access to the opportunities they have worked hard to earn. Project Antigravity removes the confusion around raw score computations, category quotas, and scholarship criteria.
              </p>

              {/* Quote Card */}
              <div className="p-6 rounded-3xl glass-panel-gold border border-amber-500/30 relative">
                <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                  &ldquo;Using the deterministic simulator, Kwame adjusted his preparation for BECE Science and hit Aggregate 10. We immediately qualified for the Mastercard Foundation Scholars grant without wondering where we stood.&rdquo;
                </p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Dr. Kwesi Mensah</span>
                    <span className="text-[11px] text-amber-300 font-medium">Parent & Educator, Kumasi</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Ashanti Region</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20"
                >
                  <Award className="w-4 h-4" />
                  <span>Explore Matched Grants in Dashboard</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setChatOpen(true)}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-300 hover:text-white border border-white/5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ask AI Placement Guide</span>
                </button>
              </div>
            </div>

            {/* Scholar Portrait Image */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden glass-panel p-2 shadow-2xl border border-white/10">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden">
                  <Image
                    src="/images/scholar_portrait.jpg"
                    alt="Inspiring portrait of young Ghanaian female scholar with certificate of merit"
                    fill
                    className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM ARCHITECTURE SECTION */}
      <section id="architecture" className="py-20 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 block mb-2">
              Engineered for Institutional Trust
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display">
              Strict Deterministic Boolean Logic & pgvector RAG
            </h2>
            <p className="mt-3 text-sm text-slate-400 font-medium">
              We never guess or allow generative models to hallucinate scholarship eligibility or admissions placements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Module 3: Deterministic Engine</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strict boolean evaluation over JSONB operators (<code className="text-emerald-300 font-mono">eq</code>, <code className="text-emerald-300 font-mono">lte</code>, <code className="text-emerald-300 font-mono">in</code>, <code className="text-emerald-300 font-mono">between</code>). Four deterministic states: <code className="text-emerald-300 font-mono">STATE_ELIGIBLE</code>, <code className="text-amber-300 font-mono">STATE_POTENTIAL</code>, <code className="text-rose-300 font-mono">STATE_INELIGIBLE</code>.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-white/5 text-[11px] font-bold text-emerald-400">
                FastAPI & Python 3.11 Powered
              </div>
            </div>

            <div className="p-7 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Module 4: Sankofa AI Guide</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  1536-dimensional pgvector RAG system strictly grounded in official GES policy briefs. Never guarantees placements; always cites verified source URLs.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-white/5 text-[11px] font-bold text-amber-300">
                PostgreSQL pgvector Grounded
              </div>
            </div>

            <div className="p-7 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Module 1 & 2: Atomic Profiles</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Full schema parity between Prisma (Node.js) and SQLAlchemy (Python). EducationLevel captured atomically at signup to route learners accurately.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-white/5 text-[11px] font-bold text-cyan-400">
                Prisma & PostgreSQL 16 Parity
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-20 border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 block mb-2">
              Got Questions?
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight font-display">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              Clear, policy-aligned answers regarding CSSPS rules, BECE scores, and opportunity matching.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How is the BECE Aggregate score computed on the platform?',
                a: 'The aggregate is computed using the official WAEC/CSSPS formula: the sum of grades in the four core subjects (Mathematics, English Language, Integrated Science, and Social Studies) plus the two best performing elective subjects. Lower aggregate scores represent higher academic merit (Aggregate 6 is the highest possible distinction).',
              },
              {
                q: 'Can a candidate choose two Category A Senior High Schools?',
                a: 'Under official Ghana Education Service (GES) CSSPS placement rules, candidates are permitted to choose at most ONE Category A school among their 6 overall school selections. Our platform reflects this rule deterministically.',
              },
              {
                q: 'What is the 30% public school equity quota?',
                a: 'GES mandates that 30% of admissions into all premier Category A Senior High Schools are reserved exclusively for qualified learners graduating from public Junior High Schools, promoting educational equity across Ghana.',
              },
              {
                q: 'Does this platform guarantee school admission or placement?',
                a: 'No. Antigravity provides deterministic policy matching, aggregate simulation, and academic guidance. Final school placements are conducted exclusively by the Ministry of Education via the official CSSPS computerized system.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left text-sm font-bold text-white"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openFaq === i && (
                  <p className="text-xs text-slate-300 leading-relaxed mt-3 pl-6 animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION FINALE */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-black/60 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-400 to-amber-300 p-[2px] mx-auto shadow-2xl shadow-emerald-500/30 mb-6">
            <div className="w-full h-full bg-[#080d1a] rounded-[22px] flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
            Take the Guesswork Out of Your BECE Placements
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium">
            Join hundreds of Ghanaian JHS candidates exploring verified secondary institutions and scholarship opportunities today.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-300 text-slate-950 font-black text-sm hover:brightness-110 active:scale-95 shadow-2xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Launch Academy Cockpit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setAuthModalOpen(true);
              }}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] text-white text-sm font-bold border border-white/10 hover:border-white/20 transition-all active:scale-95"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#04070e] py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-amber-300 flex items-center justify-center text-slate-950 font-black text-xs">
                A
              </div>
              <div>
                <span className="font-bold text-slate-200 block">Project Antigravity</span>
                <span className="text-[11px] text-slate-500">The Talent & Innovation Academy • Ghana JHS</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <Link href="/dashboard" className="hover:text-white transition-colors">Academy Dashboard</Link>
              <a href="#simulator" className="hover:text-white transition-colors">BECE Simulator</a>
              <a href="#institutions" className="hover:text-white transition-colors">Verified Institutions</a>
              <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
              <a href="#faq" className="hover:text-white transition-colors">Compliance & FAQ</a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
            <p>© 2026 Project Antigravity. Grounded strictly in Ghana Education Service (GES) and CSSPS policies.</p>
            <p>Official compliance notice: Zero admissions guarantees. For institutional guidance and student advancement.</p>
          </div>
        </div>
      </footer>

      {/* AI Copilot Drawer */}
      <AiChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Floating AI Trigger */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-300 text-slate-950 font-black text-xs shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <Sparkles className="w-4 h-4 text-slate-950 animate-spin [animation-duration:5s]" />
        <span>Ask AI Copilot</span>
        <span className="px-1.5 py-0.5 rounded bg-black/20 text-[9px] font-mono">⌘K</span>
      </button>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
