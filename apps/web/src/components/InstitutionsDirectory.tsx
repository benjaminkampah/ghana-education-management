'use client';

import React, { useState, useMemo } from 'react';
import { VERIFIED_INSTITUTIONS } from '../lib/mockData';
import {
  Search,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Building2,
  Copy,
  Check,
  Star,
  Cpu,
  Wrench,
  BookMarked,
  Filter,
  Users,
  Compass,
} from 'lucide-react';

export const InstitutionsDirectory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredInstitutions = useMemo(() => {
    return VERIFIED_INSTITUTIONS.filter((inst) => {
      const matchSearch =
        search === '' ||
        inst.name.toLowerCase().includes(search.toLowerCase()) ||
        inst.csspsCode.includes(search) ||
        inst.region.toLowerCase().includes(search.toLowerCase()) ||
        inst.programmes.some((p) => p.toLowerCase().includes(search.toLowerCase()));

      const matchCategory =
        selectedCategory === 'ALL' || inst.category === selectedCategory;

      const matchRegion =
        selectedRegion === 'ALL' || inst.region.toLowerCase() === selectedRegion.toLowerCase();

      return matchSearch && matchCategory && matchRegion;
    });
  }, [search, selectedCategory, selectedRegion]);

  return (
    <div className="space-y-6">
      {/* Control Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-500 p-[2px] shadow-lg shadow-cyan-500/20 flex-shrink-0">
              <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Verified Institutions Directory
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  GES / CSSPS Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                Ghanaian Senior High Schools, TVET technical institutes, and STEM academies with official CSSPS placement codes.
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by school, CSSPS code, or course..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl bg-black/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-white/[0.07]">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Schools', icon: Building2 },
              { id: 'A', label: 'Category A Premier', icon: Star, color: 'text-amber-400' },
              { id: 'B', label: 'Category B', icon: BookMarked, color: 'text-emerald-400' },
              { id: 'STEM', label: 'STEM Academies', icon: Cpu, color: 'text-cyan-400' },
              { id: 'TVET', label: 'TVET Institutes', icon: Wrench, color: 'text-purple-400' },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const IconComp = cat.icon;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'bg-black/40 text-slate-400 border border-white/5 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${cat.color || 'text-slate-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Regional Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Regions</option>
              <option value="Ashanti">Ashanti</option>
              <option value="Greater Accra">Greater Accra</option>
              <option value="Central">Central</option>
              <option value="Northern">Northern</option>
              <option value="Volta">Volta</option>
              <option value="Eastern">Eastern</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInstitutions.map((inst) => {
          const isCategoryA = inst.category === 'A';
          const isStem = inst.category === 'STEM';
          const isTvet = inst.category === 'TVET';

          return (
            <div
              key={inst.id}
              className="group relative glass-panel rounded-3xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isCategoryA
                    ? 'bg-gradient-to-r from-amber-400 to-amber-200'
                    : isStem
                    ? 'bg-gradient-to-r from-cyan-400 to-teal-300'
                    : isTvet
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                    : 'bg-gradient-to-r from-emerald-400 to-teal-300'
                }`}
              />

              <div>
                {/* Header: Category Badge & Verified Status */}
                <div className="flex items-center justify-between mb-3.5 pt-1">
                  <span
                    className={`px-3 py-0.5 text-[10px] font-extrabold uppercase rounded-full border flex items-center gap-1 ${
                      isCategoryA
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                        : isStem
                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                        : isTvet
                        ? 'bg-purple-500/15 text-purple-300 border-purple-500/40'
                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {isCategoryA && <Star className="w-3 h-3 fill-amber-400" />}
                    {isStem && <Cpu className="w-3 h-3" />}
                    {isTvet && <Wrench className="w-3 h-3" />}
                    <span>Category {inst.category}</span>
                  </span>

                  {inst.isVerified && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                {/* Institution Name */}
                <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors leading-snug">
                  {inst.name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-300 font-bold">{inst.region} Region</span>
                  <span>•</span>
                  <span>{inst.district}</span>
                </div>

                {/* Official CSSPS Code Tool */}
                <div className="mt-3.5 flex items-center justify-between p-2.5 rounded-2xl bg-black/50 border border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      CSSPS Code:
                    </span>
                    <span className="font-mono text-xs font-black text-emerald-400 tracking-wider">
                      {inst.csspsCode}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(inst.csspsCode)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white text-[10px] font-bold transition-all"
                  >
                    {copiedCode === inst.csspsCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Residency & Gender Badges */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-black/40 border border-white/5 text-slate-300">
                    {inst.genderType}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-black/40 border border-white/5 text-slate-300">
                    {inst.residenceType.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Available Programmes */}
                <div className="mt-4 pt-3 border-t border-white/[0.07]">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2">
                    Offered Programmes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {inst.programmes.map((p, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/5"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Portal Link */}
              {inst.website && (
                <div className="mt-5 pt-3 border-t border-white/[0.07] flex justify-end">
                  <a
                    href={inst.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Visit School Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
