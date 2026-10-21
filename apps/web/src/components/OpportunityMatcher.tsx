'use client';

import React, { useState, useEffect } from 'react';
import { AcademicRecords, EvaluationResult, EvaluationState } from '../lib/types';
import { OPPORTUNITIES } from '../lib/mockData';
import { evaluateOpportunity } from '../lib/api';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Zap,
  Filter,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface OpportunityMatcherProps {
  academicRecords: AcademicRecords;
  onOpenRecords: () => void;
}

export const OpportunityMatcher: React.FC<OpportunityMatcherProps> = ({
  academicRecords,
  onOpenRecords,
}) => {
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationResult>>({});
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<string>('ALL');

  const runAllEvaluations = async () => {
    setLoading(true);
    const results: Record<string, EvaluationResult> = {};
    for (const opp of OPPORTUNITIES) {
      const res = await evaluateOpportunity('current-learner', opp, academicRecords);
      results[opp.id] = res;
    }
    setEvaluations(results);
    setLoading(false);
  };

  useEffect(() => {
    runAllEvaluations();
  }, [academicRecords]);

  const getStatePill = (state?: EvaluationState) => {
    switch (state) {
      case 'STATE_ELIGIBLE':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>STATE_ELIGIBLE (Qualified)</span>
          </div>
        );
      case 'STATE_POTENTIAL':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>STATE_POTENTIAL (Preferences Pending)</span>
          </div>
        );
      case 'STATE_INELIGIBLE':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/15 text-rose-400 border border-rose-500/40 shadow-sm shadow-rose-500/20">
            <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>STATE_INELIGIBLE (Criteria Unmet)</span>
          </div>
        );
      case 'STATE_INSUFFICIENT_DATA':
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-800 text-slate-300 border border-slate-700">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>STATE_INSUFFICIENT_DATA</span>
          </div>
        );
    }
  };

  // Status counts
  const eligibleCount = OPPORTUNITIES.filter((o) => evaluations[o.id]?.state === 'STATE_ELIGIBLE').length;
  const potentialCount = OPPORTUNITIES.filter((o) => evaluations[o.id]?.state === 'STATE_POTENTIAL').length;
  const ineligibleCount = OPPORTUNITIES.filter((o) => evaluations[o.id]?.state === 'STATE_INELIGIBLE').length;

  const filteredOpportunities = OPPORTUNITIES.filter((opp) => {
    if (filterState === 'ALL') return true;
    const res = evaluations[opp.id];
    return res?.state === filterState;
  });

  return (
    <div className="space-y-6">
      {/* Engine Control Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/3 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-500 p-[2px] shadow-lg shadow-amber-500/20 flex-shrink-0">
              <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Deterministic Opportunity Radar
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  FastAPI Module 3
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                Evaluates strict JSONB boolean criteria against your BECE scores and regional preferences. Zero AI hallucination.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={runAllEvaluations}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-xs font-bold text-white border border-white/10 hover:border-white/20 transition-all disabled:opacity-50 active:scale-95 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Evaluating...' : 'Re-evaluate Engine'}</span>
          </button>
        </div>

        {/* Filter Pills with Live Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-white/[0.07]">
          <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filter Status:
          </span>

          {[
            { id: 'ALL', label: 'All Programs', count: OPPORTUNITIES.length },
            { id: 'STATE_ELIGIBLE', label: 'Qualified', count: eligibleCount, color: 'text-emerald-400' },
            { id: 'STATE_POTENTIAL', label: 'Potential', count: potentialCount, color: 'text-amber-400' },
            { id: 'STATE_INELIGIBLE', label: 'Ineligible', count: ineligibleCount, color: 'text-rose-400' },
          ].map((tab) => {
            const isSelected = filterState === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterState(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-black/40 text-slate-400 border border-white/5 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md bg-black/50 ${tab.color || 'text-slate-400'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-4">
        {filteredOpportunities.map((opp) => {
          const evalRes = evaluations[opp.id];
          const isExpanded = expandedId === opp.id;
          const isEligible = evalRes?.state === 'STATE_ELIGIBLE';
          const isPotential = evalRes?.state === 'STATE_POTENTIAL';

          return (
            <div
              key={opp.id}
              className={`rounded-3xl p-6 sm:p-7 border transition-all duration-300 relative overflow-hidden ${
                isEligible
                  ? 'glass-panel-glow'
                  : isPotential
                  ? 'glass-panel-gold'
                  : 'glass-panel opacity-95'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-black/50 border border-white/10 text-slate-300 uppercase tracking-wider">
                      {opp.type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Administered by <strong className="text-slate-200">{opp.providerName}</strong>
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white tracking-tight mb-1.5">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                {/* State Badge & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between lg:justify-center gap-3 flex-shrink-0">
                  {getStatePill(evalRes?.state)}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <span>{isExpanded ? 'Hide Criteria' : 'Inspect Criteria'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <a
                      href={opp.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 border border-white/10 transition-colors"
                      title="View Official Portal"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Missing Criteria Warning */}
              {evalRes?.state === 'STATE_INSUFFICIENT_DATA' && evalRes.missing_fields.length > 0 && (
                <div className="mt-4 p-3.5 rounded-2xl bg-black/60 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-amber-300">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Missing required criteria: <strong className="font-mono text-amber-200">{evalRes.missing_fields.join(', ')}</strong>
                    </span>
                  </div>
                  <button
                    onClick={onOpenRecords}
                    className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
                  >
                    Update Profile
                  </button>
                </div>
              )}

              {/* Expanded Criteria Checklist */}
              {isExpanded && evalRes?.criteria_breakdown && (
                <div className="mt-6 pt-5 border-t border-white/[0.08] space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                      Boolean Rules Evaluation (Evaluated on FastAPI Engine)
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      Candidate: Agg {academicRecords.bece_aggregate || 11}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {evalRes.criteria_breakdown.map((c, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                          c.status === 'PASSED'
                            ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-300'
                            : c.status === 'FAILED'
                            ? 'bg-rose-950/25 border-rose-500/30 text-rose-300'
                            : 'bg-black/40 border-white/10 text-slate-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className="text-white font-mono">{c.field}</span>
                            <span className="text-[10px] uppercase px-1 py-0.2 rounded bg-black/40 font-mono text-slate-400">
                              {c.operator}
                            </span>
                            <span className="text-amber-300 font-mono">{JSON.stringify(c.expected)}</span>
                          </div>
                          {c.description && (
                            <p className="text-[10px] text-slate-400 mt-0.5">{c.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 font-bold text-[11px]">
                          {c.status === 'PASSED' ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Met
                            </span>
                          ) : c.status === 'FAILED' ? (
                            <span className="text-rose-400 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Unmet
                            </span>
                          ) : (
                            <span className="text-slate-400 flex items-center gap-1">
                              <HelpCircle className="w-3.5 h-3.5" /> Missing
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
