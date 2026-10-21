'use client';

import React, { useState, useEffect } from 'react';
import { AcademicRecords, EducationStage } from '../lib/types';
import {
  BookOpen,
  Save,
  School,
  Calculator,
  Award,
  Sparkles,
  TrendingUp,
  MapPin,
  CheckCircle2,
  RotateCcw,
  Sliders,
  Shield,
  Layers,
} from 'lucide-react';

interface AcademicRecordsCardProps {
  records: AcademicRecords;
  onSave: (updated: AcademicRecords) => void;
}

export const AcademicRecordsCard: React.FC<AcademicRecordsCardProps> = ({
  records,
  onSave,
}) => {
  const [data, setData] = useState<AcademicRecords>(records);
  const [savedToast, setSavedToast] = useState(false);

  // Recalculate whenever subjects change
  const computeAggregate = (current: AcademicRecords) => {
    const cores = current.core_subjects || {};
    const coreSum =
      (cores.mathematics || 9) +
      (cores.english || 9) +
      (cores.science || 9) +
      (cores.social_studies || 9);

    const electives = Object.values(current.electives || {}).sort((a, b) => a - b);
    const bestTwo = electives.slice(0, 2).reduce((acc, v) => acc + v, 0);

    return coreSum + bestTwo;
  };

  const aggregate = computeAggregate(data);

  const handleCoreChange = (
    subject: keyof NonNullable<AcademicRecords['core_subjects']>,
    grade: number
  ) => {
    const nextCores = {
      ...(data.core_subjects || {}),
      [subject]: grade,
    };
    const nextData = {
      ...data,
      core_subjects: nextCores,
    };
    nextData.bece_aggregate = computeAggregate(nextData);
    setData(nextData);
  };

  const handleElectiveChange = (electiveKey: string, grade: number) => {
    const nextElectives = {
      ...(data.electives || {}),
      [electiveKey]: grade,
    };
    const nextData = {
      ...data,
      electives: nextElectives,
    };
    nextData.bece_aggregate = computeAggregate(nextData);
    setData(nextData);
  };

  const handleSave = () => {
    const updated = {
      ...data,
      bece_aggregate: aggregate,
    };
    onSave(updated);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleApplyPreset = (preset: 'merit' | 'kwame' | 'stem' | 'tvet') => {
    let presetData: AcademicRecords;
    if (preset === 'merit') {
      presetData = {
        ...data,
        bece_aggregate: 7,
        raw_score: 470,
        core_subjects: { mathematics: 1, english: 1, science: 1, social_studies: 2 },
        electives: { ict: 1, rme: 1, bdt_pre_tech: 2, french: 2 },
      };
    } else if (preset === 'stem') {
      presetData = {
        ...data,
        bece_aggregate: 9,
        raw_score: 440,
        core_subjects: { mathematics: 1, english: 2, science: 1, social_studies: 2 },
        electives: { ict: 1, bdt_pre_tech: 2, rme: 2, ghanaian_language: 2 },
      };
    } else if (preset === 'tvet') {
      presetData = {
        ...data,
        bece_aggregate: 16,
        raw_score: 360,
        core_subjects: { mathematics: 3, english: 3, science: 2, social_studies: 4 },
        electives: { bdt_pre_tech: 1, ict: 2, rme: 3, ghanaian_language: 3 },
      };
    } else {
      // Kwame Mensah default
      presetData = {
        ...data,
        bece_aggregate: 11,
        raw_score: 412,
        core_subjects: { mathematics: 2, english: 1, science: 2, social_studies: 2 },
        electives: { ict: 1, rme: 2, bdt_pre_tech: 2, ghanaian_language: 2 },
      };
    }
    setData(presetData);
    onSave(presetData);
  };

  // Performance tier mapping
  const getTierInfo = (agg: number) => {
    if (agg <= 9) {
      return {
        label: 'Category A Elite Tier',
        sub: 'Highly competitive for Prempeh, Achimota, Wesley Girls & STEM Academies',
        color: 'text-amber-300',
        badgeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
        gaugeProgress: 95,
        gaugeColor: '#f59e0b',
      };
    }
    if (agg <= 14) {
      return {
        label: 'Category A / High Category B Merit Tier',
        sub: 'Competitive for Category A and premier Category B boarding institutions',
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
        gaugeProgress: 80,
        gaugeColor: '#10b981',
      };
    }
    if (agg <= 24) {
      return {
        label: 'Category B & TVET Placement Tier',
        sub: 'Eligible for TVET technical institutes, Category B day/boarding, and Cat C',
        color: 'text-cyan-400',
        badgeBg: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400',
        gaugeProgress: 60,
        gaugeColor: '#06b6d4',
      };
    }
    return {
      label: 'General Placement / TVET Pathway',
      sub: 'Eligible for community Senior High Schools and vocational institutes',
      color: 'text-slate-300',
      badgeBg: 'bg-slate-800 border-slate-700 text-slate-300',
      gaugeProgress: 40,
      gaugeColor: '#64748b',
    };
  };

  const tier = getTierInfo(aggregate);

  // Grade color helper
  const getGradeStyle = (grade: number) => {
    if (grade === 1) return 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/30';
    if (grade === 2) return 'bg-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-400/30';
    if (grade <= 4) return 'bg-teal-500/30 text-teal-300 border border-teal-500/40 font-bold';
    if (grade <= 6) return 'bg-slate-800 text-slate-300 font-semibold';
    return 'bg-rose-900/40 text-rose-300 font-semibold';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Precision Cockpit Gauge */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.07]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 p-[2px] shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
                <Calculator className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  BECE Academic Cockpit
                </h2>
                <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border ${tier.badgeBg}`}>
                  {tier.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                {tier.sub}. Changes directly trigger Module 3 deterministic evaluation across all opportunities.
              </p>
            </div>
          </div>

          {/* Quick Preset Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider hidden xl:inline">
              Quick Scenarios:
            </span>
            <button
              type="button"
              onClick={() => handleApplyPreset('kwame')}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-300 border border-white/5 transition-all"
            >
              Kwame (Agg 11)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('merit')}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-amber-300 border border-amber-500/25 transition-all"
            >
              Star Merit (Agg 7)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('stem')}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-bold text-emerald-300 border border-emerald-500/25 transition-all"
            >
              STEM Scholar (Agg 9)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('tvet')}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-bold text-cyan-300 border border-cyan-500/25 transition-all"
            >
              TVET Tech (Agg 16)
            </button>
          </div>
        </div>

        {/* Live Metrics Cockpit Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          {/* Aggregate Metric */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.07] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                BECE Aggregate
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black text-amber-300 tracking-tight">
                  {aggregate}
                </span>
                <span className="text-xs text-slate-500 font-semibold">/ 54</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">Lower is better</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>

          {/* Raw Score */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.07] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Raw Score
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black text-emerald-400 tracking-tight">
                  {data.raw_score ?? 412}
                </span>
                <span className="text-xs text-slate-500 font-semibold">/ 600</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Top percentile rank</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Target Region */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.07] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Target Region
              </span>
              <p className="text-base font-extrabold text-white mt-1 truncate max-w-[120px]">
                {data.target_region || 'Ashanti'}
              </p>
              <span className="text-[10px] text-slate-400 font-medium">CSSPS Catchment</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <MapPin className="w-5 h-5" />
            </div>
          </div>

          {/* Save Action */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.07] flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Profile Persistence
            </span>
            <button
              type="button"
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 shadow-md shadow-emerald-500/20 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savedToast ? 'Saved & Evaluated!' : 'Save & Sync'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Core 4 Subjects & Elective Optimizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core Subjects Matrix (7 Columns) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Mandatory Core Subjects (All 4 Count in Aggregate)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Grades 1 (Best) to 9</span>
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'mathematics',
                title: 'Core Mathematics',
                desc: 'Threshold subject for Category A Science, Engineering & STEM Academies.',
                weight: 'Grade 1 or 2 required for premier science',
              },
              {
                key: 'english',
                title: 'English Language',
                desc: 'Official language of instruction; critical for General Arts & Category A entrance.',
                weight: 'Grade 1 or 2 required for Category A',
              },
              {
                key: 'science',
                title: 'Integrated Science',
                desc: 'Essential foundation for STEM, Biomedical, Pre-Engineering & Agriculture tracks.',
                weight: 'Core science eligibility factor',
              },
              {
                key: 'social_studies',
                title: 'Social Studies',
                desc: 'Fundamental citizenship & humanities core for General Arts, Business & Law pathways.',
                weight: 'Key humanities requirement',
              },
            ].map(({ key, title, desc, weight }) => {
              const currentGrade = (data.core_subjects as any)?.[key] ?? 2;
              const isDistinction = currentGrade <= 2;

              return (
                <div
                  key={key}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    isDistinction
                      ? 'bg-emerald-950/20 border-emerald-500/30 shadow-sm'
                      : 'bg-black/30 border-white/[0.06]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white">{title}</span>
                        {isDistinction && (
                          <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Distinction
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                    </div>

                    {/* Grade Selector Bar 1 to 6 */}
                    <div className="flex items-center gap-1.5 self-start sm:self-auto bg-black/60 p-1 rounded-xl border border-white/10">
                      {[1, 2, 3, 4, 5, 6].map((g) => {
                        const isSelected = currentGrade === g;
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleCoreChange(key as any, g)}
                            className={`w-7 h-7 rounded-lg text-xs font-extrabold transition-all ${
                              isSelected
                                ? getGradeStyle(g)
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Electives Optimizer (5 Columns) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Elective Subjects (Best 2 Count)
              </h3>
            </div>
            <span className="text-[11px] text-amber-400 font-bold">Auto-Optimized</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            The CSSPS engine automatically selects the <strong>two lowest grade scores</strong> among all electives to minimize your aggregate.
          </p>

          <div className="space-y-3">
            {[
              { key: 'ict', name: 'Information & Comm. Tech (ICT)' },
              { key: 'rme', name: 'Religious & Moral Education (RME)' },
              { key: 'bdt_pre_tech', name: 'Pre-Technical Skills / BDT' },
              { key: 'ghanaian_language', name: 'Ghanaian Language (Twi/Fante/Ga)' },
            ].map(({ key, name }) => {
              const currentGrade = (data.electives as any)?.[key] ?? 2;
              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-black/30 border border-white/[0.06]"
                >
                  <span className="text-xs font-bold text-slate-200">{name}</span>
                  <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
                    {[1, 2, 3, 4, 5].map((g) => {
                      const isSelected = currentGrade === g;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => handleElectiveChange(key, g)}
                          className={`w-6 h-6 rounded-lg text-xs font-extrabold transition-all ${
                            isSelected
                              ? getGradeStyle(g)
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Regional Context Settings */}
          <div className="pt-4 border-t border-white/[0.07] space-y-3">
            <span className="text-[11px] font-bold text-slate-300 block">
              Catchment & Placement Preferences:
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                  Region of Choice
                </label>
                <select
                  value={data.target_region || 'ASHANTI'}
                  onChange={(e) => setData({ ...data, target_region: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="ASHANTI">Ashanti Region</option>
                  <option value="GREATER ACCRA">Greater Accra</option>
                  <option value="CENTRAL">Central Region</option>
                  <option value="EASTERN">Eastern Region</option>
                  <option value="NORTHERN">Northern Region</option>
                  <option value="VOLTA">Volta Region</option>
                  <option value="WESTERN">Western Region</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                  Residence Type
                </label>
                <select
                  value={data.preferred_residence || 'BOARDING'}
                  onChange={(e) =>
                    setData({
                      ...data,
                      preferred_residence: e.target.value as 'DAY' | 'BOARDING' | 'DAY_AND_BOARDING',
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="BOARDING">Boarding Student</option>
                  <option value="DAY">Day Student</option>
                  <option value="DAY_AND_BOARDING">Either Boarding or Day</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
