'use client';

import React, { useState } from 'react';
import { User } from '../lib/types';
import {
  GraduationCap,
  Sparkles,
  LogOut,
  BookOpen,
  Compass,
  Award,
  ChevronDown,
  Menu,
  X,
  Layers,
  Home as HomeIcon,
  LayoutDashboard,
} from 'lucide-react';

export type NavTab = 'landing' | 'overview' | 'records' | 'institutions' | 'opportunities';

interface NavbarProps {
  user: User | null;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  beceAggregate?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onToggleChat,
  isChatOpen,
  beceAggregate = 11,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isLanding = activeTab === 'landing';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#050812]/92 backdrop-blur-2xl">
      {/* Ghanaian National Color Accent Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Emblem */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => setActiveTab('landing')}
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-400 p-[2px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-emerald-400 group-hover:rotate-6 transition-transform" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-[#050812]" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors font-display">
                  Antigravity
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Ghana JHS
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
                The Talent & Innovation Academy
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md">
            {/* Landing Link */}
            <button
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'landing'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <HomeIcon className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            {/* Dashboard Link */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Academy Dashboard</span>
            </button>

            {/* Cockpit */}
            <button
              onClick={() => setActiveTab('records')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'records'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>BECE Cockpit</span>
            </button>

            {/* Schools */}
            <button
              onClick={() => setActiveTab('institutions')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'institutions'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Schools</span>
            </button>

            {/* Opportunities */}
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'opportunities'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Grants</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* AI Guide Trigger */}
            <button
              onClick={onToggleChat}
              className={`relative group flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isChatOpen
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/20'
                  : 'bg-gradient-to-r from-amber-500/10 to-emerald-500/10 text-amber-300 border-amber-500/30 hover:border-amber-400/50 hover:bg-amber-500/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">AI Placement Guide</span>
            </button>

            {/* User Session State or Auth Triggers */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] transition-all"
                >
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 text-xs font-black shadow-sm">
                    {user.email.charAt(0).toUpperCase()}
                  </div>

                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-white leading-tight truncate max-w-[110px]">
                      {user.email.split('@')[0]}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-wide">
                        {user.educationLevel}
                      </span>
                      <span className="text-[9px] text-amber-400 font-mono font-bold">
                        Agg {beceAggregate}
                      </span>
                    </div>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#090e1a] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-xs font-bold text-white truncate">{user.email}</p>
                      <p className="text-[10px] text-emerald-400 font-medium">
                        {user.educationLevel} Learner Profile
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('overview');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Open Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('records');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Edit BECE Records</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('opportunities');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Matched Grants</span>
                    </button>

                    <div className="my-1 border-t border-white/5" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:brightness-110 active:scale-95 shadow-md shadow-emerald-500/20 transition-all"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/[0.08] space-y-1.5 animate-in slide-in-from-top duration-200">
            {[
              { id: 'landing', label: 'Home (Landing Page)', icon: HomeIcon },
              { id: 'overview', label: 'Academy Dashboard', icon: LayoutDashboard },
              { id: 'records', label: 'BECE Cockpit', icon: BookOpen },
              { id: 'institutions', label: 'Verified Schools', icon: Compass },
              { id: 'opportunities', label: 'Opportunity Radar', icon: Award },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as NavTab);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
