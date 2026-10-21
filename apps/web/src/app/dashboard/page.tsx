'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, AcademicRecords } from '../../lib/types';
import { INITIAL_LEARNER_ACADEMIC, VERIFIED_INSTITUTIONS, OPPORTUNITIES } from '../../lib/mockData';
import { Navbar, NavTab } from '../../components/Navbar';
import { AuthModal } from '../../components/AuthModal';
import { AcademicRecordsCard } from '../../components/AcademicRecordsCard';
import { InstitutionsDirectory } from '../../components/InstitutionsDirectory';
import { OpportunityMatcher } from '../../components/OpportunityMatcher';
import { AiChatWidget } from '../../components/AiChatWidget';
import {
  Sparkles,
  Award,
  Compass,
  BookOpen,
  ArrowRight,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Calculator,
  Home as HomeIcon,
  ChevronRight,
  LayoutDashboard,
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [academicRecords, setAcademicRecords] = useState<AcademicRecords>(INITIAL_LEARNER_ACADEMIC);
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'institutions' | 'opportunities'>('overview');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [chatOpen, setChatOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Load persisted user session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('antigravity_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        const defaultUser: User = {
          id: 'demo-learner-001',
          email: 'kwame.mensah@antigravity.edu.gh',
          role: 'LEARNER',
          profileId: 'prof-001',
          educationLevel: 'JHS',
        };
        setUser(defaultUser);
        localStorage.setItem('antigravity_user', JSON.stringify(defaultUser));
      }
    } catch {
      // Ignore read errors
    }
  }, []);

  const handleAuthSuccess = (authenticatedUser: User, token: string) => {
    setUser(authenticatedUser);
    try {
      localStorage.setItem('antigravity_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('antigravity_token', token);
    } catch {}
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('antigravity_user');
      localStorage.removeItem('antigravity_token');
    } catch {}
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const currentAggregate = academicRecords.bece_aggregate || 11;

  return (
    <div className="min-h-screen flex flex-col bg-[#050812] text-slate-100 relative selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Universal Top Navbar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'landing') {
            window.location.href = '/';
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onToggleChat={() => setChatOpen(!chatOpen)}
        isChatOpen={chatOpen}
        beceAggregate={currentAggregate}
      />

      {/* Sub-Header & Breadcrumb Bar */}
      <div className="border-b border-white/[0.08] bg-black/40 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Link
              href="/"
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <HomeIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Landing Page</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-white font-bold">Talent & Innovation Academy</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-emerald-400 font-extrabold uppercase tracking-wide">
              {activeTab === 'overview'
                ? 'Command Center'
                : activeTab === 'records'
                ? 'BECE Cockpit'
                : activeTab === 'institutions'
                ? 'Schools Directory'
                : 'Opportunity Radar'}
            </span>
          </div>

          {/* Quick Segment Switcher */}
          <div className="flex items-center gap-1 self-start sm:self-auto bg-black/60 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('records')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === 'records'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BECE Cockpit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('institutions')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === 'institutions'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Schools
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('opportunities')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === 'opportunities'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Grants
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* VIEW 1: COMMAND CENTER BENTO OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Candidate Feasibility Cockpit (8 Columns) */}
              <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-md">
                        {user ? user.email.charAt(0).toUpperCase() : 'K'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-white">
                            {user ? user.email.split('@')[0] : 'Kwame Mensah'}
                          </h3>
                          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            JHS 3 Candidate
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          KNUST Basic School • Ashanti Region • Boarding Target
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('records')}
                      className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Tune Grades</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Feasibility Bar */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-300">
                        CSSPS Category A Feasibility Meter:
                      </span>
                      <span className="text-xs font-black text-amber-300 font-mono">
                        Aggregate {currentAggregate} (Competitive)
                      </span>
                    </div>

                    <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                      <div className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 w-[78%] rounded-full shadow-sm" />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-medium">
                      <span>Agg 6 (Maximum Distinction)</span>
                      <span className="text-emerald-400 font-bold">Target: Prempeh College / OWASS</span>
                      <span>Agg 24</span>
                    </div>
                  </div>

                  {/* Core Subjects Quick Dials */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { key: 'mathematics', label: 'Maths', grade: academicRecords.core_subjects?.mathematics || 2 },
                      { key: 'english', label: 'English', grade: academicRecords.core_subjects?.english || 1 },
                      { key: 'science', label: 'Science', grade: academicRecords.core_subjects?.science || 2 },
                      { key: 'social_studies', label: 'Social', grade: academicRecords.core_subjects?.social_studies || 2 },
                    ].map((subj) => (
                      <div
                        key={subj.key}
                        className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center"
                      >
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          {subj.label}
                        </span>
                        <span className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">
                          Grade {subj.grade}
                        </span>
                        <span className="text-[9px] text-slate-500 font-semibold">
                          {subj.grade <= 2 ? 'Distinction' : 'Credit'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-white/[0.07] flex items-center justify-between text-xs text-slate-400">
                  <span>Raw Score: <strong className="text-white font-mono">{academicRecords.raw_score || 412} / 600</strong></span>
                  <span className="text-emerald-400 font-semibold">Top 8% Candidate Nationally</span>
                </div>
              </div>

              {/* Opportunity Radar Snapshot (4 Columns) */}
              <div
                onClick={() => setActiveTab('opportunities')}
                className="group cursor-pointer lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="text-lg font-black text-white tracking-tight mb-1.5">
                    Opportunity Radar
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Module 3 deterministic matching across verified Ghanaian scholarships.
                  </p>

                  <div className="mt-5 space-y-2.5">
                    <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/25 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-slate-200">Mastercard Foundation</span>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        100% Eligible
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/25 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-slate-200">MTN Bright Bursary</span>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        Potential
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-white/[0.07] flex items-center justify-between text-xs">
                  <span className="text-slate-400">Programs Tracked:</span>
                  <span className="font-bold text-amber-300 font-mono">4 Grants Active</span>
                </div>
              </div>
            </div>

            {/* Bento Layer 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sankofa AI Copilot Tile (4 Columns) */}
              <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-[1.5px]">
                      <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                      </div>
                    </div>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.05] text-slate-400">
                      pgvector 1536
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white tracking-tight mb-1.5">
                    AI Placement Copilot
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Trained strictly on official GES & CSSPS secondary placement policies.
                  </p>

                  <div className="space-y-2">
                    {[
                      'How is BECE raw score computed?',
                      'Can I choose 2 Category A schools?',
                      'What is the 30% public school quota?',
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setChatOpen(true)}
                        className="w-full text-left p-2.5 rounded-xl bg-white/[0.03] hover:bg-emerald-500/15 border border-white/5 hover:border-emerald-500/30 text-xs font-semibold text-slate-300 hover:text-emerald-300 transition-all flex items-center justify-between group"
                      >
                        <span className="truncate">{q}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setChatOpen(true)}
                  className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Full Copilot</span>
                </button>
              </div>

              {/* Featured Institutions Preview (8 Columns) */}
              <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2.5">
                      <Compass className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-lg font-black text-white tracking-tight">
                        Verified CSSPS Institutions Preview
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('institutions')}
                      className="text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1 self-start sm:self-auto"
                    >
                      <span>View All 8 Schools</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* School Preview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {VERIFIED_INSTITUTIONS.slice(0, 3).map((inst) => (
                      <div
                        key={inst.id}
                        className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex flex-col justify-between hover:border-cyan-500/30 transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              Category {inst.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">{inst.region}</span>
                          </div>

                          <h4 className="text-xs font-black text-white line-clamp-1 mb-1">
                            {inst.name}
                          </h4>

                          <p className="text-[10px] text-slate-400 line-clamp-1">
                            {inst.programmes.join(', ')}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                          <span className="font-mono text-[10px] text-emerald-400 font-bold">
                            {inst.csspsCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(inst.csspsCode)}
                            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                            title="Copy CSSPS Code"
                          >
                            {copiedCode === inst.csspsCode ? (
                              <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-white/[0.07] flex items-center justify-between text-xs text-slate-400">
                  <span>Coverage: Category A, B, STEM Academies & TVET Institutes</span>
                  <span className="text-cyan-400 font-semibold">GES Official 2026/2027</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: BECE COCKPIT */}
        {activeTab === 'records' && (
          <AcademicRecordsCard
            records={academicRecords}
            onSave={(updated) => setAcademicRecords(updated)}
          />
        )}

        {/* VIEW 3: INSTITUTIONS DIRECTORY */}
        {activeTab === 'institutions' && <InstitutionsDirectory />}

        {/* VIEW 4: OPPORTUNITY MATCHER */}
        {activeTab === 'opportunities' && (
          <OpportunityMatcher
            academicRecords={academicRecords}
            onOpenRecords={() => setActiveTab('records')}
          />
        )}
      </main>

      {/* Slide-over AI Copilot */}
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
