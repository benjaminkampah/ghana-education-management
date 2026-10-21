'use client';

import React, { useState } from 'react';
import { EducationLevel, User } from '../lib/types';
import { registerLearner, loginUser } from '../lib/api';
import {
  X,
  Lock,
  Mail,
  GraduationCap,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('JHS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', score: 0, color: 'bg-slate-700' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { label: 'Weak', score: 25, color: 'bg-rose-500' };
    if (score === 2) return { label: 'Fair', score: 50, color: 'bg-amber-500' };
    if (score === 3) return { label: 'Strong', score: 75, color: 'bg-teal-400' };
    return { label: 'Secure', score: 100, color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        const res = await registerLearner(email, password, educationLevel);
        if (res.success && res.user && res.token) {
          onSuccess(res.user as User, res.token);
          onClose();
        } else {
          setError(res.error || 'Registration failed');
        }
      } else {
        const res = await loginUser(email, password);
        if (res.success && res.user && res.token) {
          onSuccess(res.user as User, res.token);
          onClose();
        } else {
          setError(res.error || 'Invalid credentials');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (demoEmail: string, level: EducationLevel) => {
    setEmail(demoEmail);
    setPassword('AntigravityPass2026!');
    setEducationLevel(level);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Brand Story & Context (Desktop) */}
        <div className="hidden md:flex md:col-span-5 flex-col justify-between p-8 bg-gradient-to-b from-[#080d1a] to-black/90 border-r border-white/[0.08] relative">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 p-[2px] shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-white block">
                  Project Antigravity
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  Talent & Innovation Academy
                </span>
              </div>
            </div>

            <h3 className="text-xl font-black text-white tracking-tight leading-snug mb-3">
              Unlock Your Ghanaian Educational Pathway
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Deterministic opportunity matching, verified Category A & TVET school insights,
              and policy-grounded guidance for Junior High School learners.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Module 3 Deterministic Engine</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Real-time boolean evaluation of scholarships and admissions without AI hallucination.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>GES Policy Compliance</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Verified CSSPS placement codes, cut-off guidelines, and 30% equity quota guidance.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Demo Switcher */}
          <div className="pt-6 border-t border-white/[0.08]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
              ⚡ Instant Demo Profiles
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectDemo('kwame.mensah@antigravity.edu.gh', 'JHS')}
                className="text-left p-2.5 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-emerald-300">
                  Kwame M.
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">JHS 3 • Agg 11</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemo('abena.osei@antigravity.edu.gh', 'JHS')}
                className="text-left p-2.5 rounded-xl bg-white/[0.03] hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-300">
                  Abena O.
                </div>
                <div className="text-[10px] text-amber-400 font-semibold">JHS 3 • STEM Focus</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {mode === 'register' ? 'Join the Academy' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'register'
                ? 'Create your learner profile to unlock personalized opportunity matching.'
                : 'Sign in to access your BECE cockpit and scholarship radar.'}
            </p>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-black/60 border border-white/10 mt-4">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
                  mode === 'register'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Learner Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. kwame.mensah@antigravity.edu.gh"
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Account Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-10 py-2.5 text-xs font-semibold rounded-2xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {mode === 'register' && password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Strength:</span>
                    <span className="font-bold text-emerald-400">{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Education Level Selector (Register mode) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Educational Level (Captured at Signup)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'JHS', label: 'Junior High (JHS)', badge: 'Phase 1' },
                    { id: 'SHS', label: 'Senior High (SHS)' },
                    { id: 'TERTIARY', label: 'Tertiary' },
                  ].map((level) => {
                    const isSelected = educationLevel === level.id;
                    return (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setEducationLevel(level.id as EducationLevel)}
                        className={`p-2.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm'
                            : 'bg-black/40 border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="text-xs font-bold">{level.id}</div>
                        <div className="text-[10px] text-slate-400 truncate">{level.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-98 disabled:opacity-50 shadow-lg shadow-emerald-500/20 transition-all mt-2"
            >
              <span>{loading ? 'Processing...' : mode === 'register' ? 'Create Learner Profile' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
