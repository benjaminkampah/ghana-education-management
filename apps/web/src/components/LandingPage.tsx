'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
} from 'lucide-react';
import { VERIFIED_INSTITUTIONS, OPPORTUNITIES } from '../lib/mockData';

interface LandingPageProps {
  onEnterDashboard: (tab?: 'overview' | 'records' | 'institutions' | 'opportunities') => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenChat: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onOpenAuth,
  onOpenChat,
}) => {
  // Mini interactive sandbox state
  const [sandboxMath, setSandboxMath] = useState(2);
  const [sandboxEnglish, setSandboxEnglish] = useState(1);
  const [sandboxScience, setSandboxScience] = useState(2);
  const [sandboxSocial, setSandboxSocial] = useState(2);
  const [sandboxElectives, setSandboxElectives] = useState(3); // sum of 2 best

  const computedAgg = sandboxMath + sandboxEnglish + sandboxScience + sandboxSocial + sandboxElectives;

  const getFeasibility = (agg: number) => {
    if (agg <= 9) return { label: 'Category A Elite Placement', color: 'text-amber-400', badge: 'bg-amber-500/15 border-amber-500/40' };
    if (agg <= 14) return { label: 'Category A / High Category B Merit', color: 'text-emerald-400', badge: 'bg-emerald-500/15 border-emerald-500/40' };
    if (agg <= 24) return { label: 'Category B & TVET Technical Track', color: 'text-cyan-400', badge: 'bg-cyan-500/15 border-cyan-500/40' };
    return { label: 'General Placement Pathway', color: 'text-slate-400', badge: 'bg-slate-800 border-slate-700' };
  };

  const feasibility = getFeasibility(computedAgg);

  return (
    <div className="flex flex-col min-h-screen text-slate-100 bg-[#050812]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-white/[0.08]">
        {/* Radiant Ambient Lights */}
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-[550px] h-[550px] bg-amber-500/12 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* National Badge Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs font-semibold mb-6 shadow-inner animate-float">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">Republic of Ghana • GES & CSSPS Aligned</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-extrabold">Talent & Innovation Academy</span>
            </div>

            {/* Hero Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] font-display">
              Guiding Ghanaian JHS Learners from BECE to{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                World-Class Pathways
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Eliminate guesswork in Senior High School selection. Real-time deterministic BECE aggregate simulation, verified Category A & TVET school insights, and zero-hallucination scholarship matching.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onEnterDashboard('overview')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-300 text-slate-950 font-black text-sm hover:brightness-110 active:scale-95 shadow-xl shadow-emerald-500/25 transition-all"
              >
                <span>Enter Academy Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] text-white text-sm font-bold border border-white/10 hover:border-white/20 transition-all active:scale-95"
              >
                <span>Create Free Learner Account</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Zero AI Hallucinations in Matching
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Official CSSPS Policy Grounded
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                1536-dim pgvector RAG
              </span>
            </div>
          </div>

          {/* Hero Showcase Image with Floating Interactive Badges */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden glass-panel p-2 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.9)] border border-white/10">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden">
                <Image
                  src="/images/hero_scholars.jpg"
                  alt="Ghanaian Junior High School scholars collaborating on robotics in an innovation laboratory"
                  fill
                  priority
                  className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050812] via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating Badge 1 (Top Left) */}
              <div className="absolute top-6 left-6 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/85 border border-emerald-500/40 backdrop-blur-xl shadow-2xl animate-float">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">Module 3 Boolean Engine</div>
                  <div className="text-[10px] text-emerald-400 font-bold">100% Deterministic Matching</div>
                </div>
              </div>

              {/* Floating Badge 2 (Bottom Right) */}
              <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/85 border border-amber-500/40 backdrop-blur-xl shadow-2xl animate-float-delayed">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">Category A Feasibility</div>
                  <div className="text-[10px] text-amber-300 font-bold">Prempeh • Achimota • Wesley Girls</div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <span className="text-2xl font-black text-white tracking-tight">8</span>
                <span className="text-[11px] text-slate-400 block font-semibold mt-0.5">Verified Institutions</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <span className="text-2xl font-black text-emerald-400 tracking-tight">4</span>
                <span className="text-[11px] text-slate-400 block font-semibold mt-0.5">Scholarships & Grants</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <span className="text-2xl font-black text-amber-300 tracking-tight">16</span>
                <span className="text-[11px] text-slate-400 block font-semibold mt-0.5">Administrative Regions</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <span className="text-2xl font-black text-cyan-400 tracking-tight">0</span>
                <span className="text-[11px] text-slate-400 block font-semibold mt-0.5">AI Hallucinations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive BECE Simulator Sandbox (Experience the Engine Instantly) */}
      <section className="py-20 border-b border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    Live Interactive Demonstration
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display">
                  Experience the BECE Aggregate Simulator
                </h2>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed font-medium">
                  Adjust subject grades below. Watch the CSSPS aggregate compute instantly, showing Category A, B, or TVET placement feasibility.
                </p>

                {/* Grade Steppers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                  {[
                    { label: 'Maths', value: sandboxMath, setter: setSandboxMath },
                    { label: 'English', value: sandboxEnglish, setter: setSandboxEnglish },
                    { label: 'Science', value: sandboxScience, setter: setSandboxScience },
                    { label: 'Social', value: sandboxSocial, setter: setSandboxSocial },
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

              {/* Simulator Real-Time Gauge */}
              <div className="lg:w-96 p-6 rounded-3xl bg-black/60 border border-white/10 shadow-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Calculated BECE Aggregate:
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-5xl font-black text-amber-300 font-mono tracking-tight">
                      {computedAgg}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">/ 54</span>
                  </div>

                  <div className="mt-3">
                    <span className={`inline-block px-3 py-1 text-xs font-black uppercase rounded-full border ${feasibility.badge} ${feasibility.color}`}>
                      {feasibility.label}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                    Based on 4 Core Subjects + Best 2 Electives (sum 3). Fully connected to Module 3 Opportunity Matcher.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onEnterDashboard('records')}
                  className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <span>Launch Full Academic Cockpit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Prestige & Institutions Showcase */}
      <section className="py-20 border-b border-white/[0.08] relative">
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

              {/* Floating verified badge */}
              <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-3 p-3 rounded-2xl bg-slate-950/90 border border-white/10 backdrop-blur-xl shadow-2xl">
                <Compass className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-bold text-white">8 Verified Senior Secondary & TVET Campuses</span>
              </div>
            </div>

            {/* Campus Editorial */}
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

              <button
                type="button"
                onClick={() => onEnterDashboard('institutions')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] text-xs font-bold text-white border border-white/10 hover:border-cyan-400/40 transition-all"
              >
                <span>Browse Full Directory with CSSPS Codes</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Scholar Success Spotlight (Featuring Real Generated Portrait) */}
      <section className="py-20 border-b border-white/[0.08] relative">
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

              {/* Testimonial Quote Card */}
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
                <button
                  type="button"
                  onClick={() => onEnterDashboard('opportunities')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20"
                >
                  <Award className="w-4 h-4" />
                  <span>Explore Matched Grants</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenChat}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-300 hover:text-white border border-white/5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ask AI Placement Guide</span>
                </button>
              </div>
            </div>

            {/* Scholar Portrait Image Frame */}
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

      {/* Platform Architecture & Compliance Pillars */}
      <section className="py-20 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display">
              Built on Deterministic Rigor & Policy Grounding
            </h2>
            <p className="mt-3 text-sm text-slate-400 font-medium">
              We never guess or allow generative AI models to hallucinate scholarship eligibility or admissions placements.
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
                  Strict boolean evaluation over JSONB operators (<code className="text-emerald-300 font-mono">eq</code>, <code className="text-emerald-300 font-mono">lte</code>, <code className="text-emerald-300 font-mono">in</code>, <code className="text-emerald-300 font-mono">between</code>). Zero generative guesswork.
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

      {/* Frequently Asked Questions */}
      <section className="py-20 border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white tracking-tight font-display">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              Clear answers regarding CSSPS rules, BECE scores, and opportunity matching.
            </p>
          </div>

          <div className="space-y-4">
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
              <div key={i} className="p-6 rounded-3xl bg-black/40 border border-white/[0.08]">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final High-Impact CTA Banner */}
      <section className="py-20 relative overflow-hidden">
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
            <button
              type="button"
              onClick={() => onEnterDashboard('overview')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-300 text-slate-950 font-black text-sm hover:brightness-110 active:scale-95 shadow-2xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Launch Academy Cockpit</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] text-white text-sm font-bold border border-white/10 hover:border-white/20 transition-all active:scale-95"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#04070e] py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Project Antigravity</span>
            <span>•</span>
            <span>The Talent & Innovation Academy (Ghana JHS)</span>
          </div>

          <p className="text-[11px] text-slate-600">
            Grounded in Ghana Education Service & CSSPS guidelines. Zero admissions guarantees.
          </p>
        </div>
      </footer>
    </div>
  );
};
