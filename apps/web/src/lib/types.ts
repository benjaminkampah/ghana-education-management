/**
 * Shared Type Definitions for Project Antigravity Web Tier.
 */

export type EducationLevel = 'JHS' | 'SHS' | 'TERTIARY' | 'POSTGRADUATE' | 'OTHER';

export type EducationStage = 'JHS_1' | 'JHS_2' | 'JHS_3' | 'COMPLETED_JHS';

export type UserRole = 'LEARNER' | 'GUARDIAN' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profileId?: string;
  educationLevel: EducationLevel;
}

export interface AcademicRecords {
  bece_aggregate?: number;
  raw_score?: number;
  core_subjects?: {
    mathematics?: number;
    english?: number;
    science?: number;
    social_studies?: number;
  };
  electives?: Record<string, number>;
  interests?: string[];
  preferred_residence?: 'DAY' | 'BOARDING' | 'DAY_AND_BOARDING';
  target_region?: string;
  current_school?: string;
  education_stage?: EducationStage;
}

export type EvaluationState = 
  | 'STATE_ELIGIBLE'
  | 'STATE_POTENTIAL'
  | 'STATE_INELIGIBLE'
  | 'STATE_INSUFFICIENT_DATA';

export interface CriterionBreakdown {
  field: string;
  operator: string;
  expected: unknown;
  actual?: unknown;
  is_mandatory: boolean;
  status: 'PASSED' | 'FAILED' | 'MISSING';
  description?: string;
}

export interface EvaluationResult {
  opportunity_id: string;
  state: EvaluationState;
  missing_fields: string[];
  criteria_breakdown?: CriterionBreakdown[];
  evaluated_at: string;
}

export interface Institution {
  id: string;
  name: string;
  csspsCode: string;
  category: 'A' | 'B' | 'C' | 'TVET' | 'STEM';
  genderType: 'MIXED' | 'BOYS' | 'GIRLS';
  residenceType: 'DAY' | 'BOARDING' | 'DAY_AND_BOARDING';
  region: string;
  district?: string;
  isVerified: boolean;
  programmes: string[];
  website?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  providerName: string;
  description: string;
  type: 'SCHOLARSHIP' | 'SHS_PLACEMENT' | 'TVET_TRACK' | 'STEM_GRANT';
  sourceUrl: string;
  expiryDate: string;
  status: 'ACTIVE' | 'DRAFT' | 'EXPIRED';
  eligibilityRules: {
    mandatory?: Array<{
      field: string;
      operator: string;
      value: unknown;
      description?: string;
    }>;
    optional?: Array<{
      field: string;
      operator: string;
      value: unknown;
      description?: string;
    }>;
  };
}

export interface CitedSource {
  source_url: string;
  title?: string;
  content_snippet: string;
  similarity_score?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: CitedSource[];
  disclaimer?: string;
}
