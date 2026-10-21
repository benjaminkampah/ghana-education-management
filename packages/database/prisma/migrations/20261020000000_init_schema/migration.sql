-- ==============================================================================
-- Project Antigravity (TIA Phase 1.0 - Ghana JHS MVP)
-- Initial Schema Migration: 20261020000000_init_schema
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('LEARNER', 'GUARDIAN', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE education_stage AS ENUM ('JHS_1', 'JHS_2', 'JHS_3', 'COMPLETED_JHS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE consent_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVOKED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE institution_type AS ENUM ('SHS', 'TVET', 'STEM_ACADEMY', 'TERTIARY_PARTNER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE institution_gender AS ENUM ('MIXED', 'BOYS', 'GIRLS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE institution_residence AS ENUM ('DAY', 'BOARDING', 'DAY_AND_BOARDING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE opportunity_type AS ENUM ('SCHOLARSHIP', 'SHS_PLACEMENT', 'TVET_TRACK', 'STEM_GRANT', 'MENTORSHIP');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE opportunity_status AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'LEARNER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Learner Profiles Table (1:1 with users, enforces JHS state constraints)
CREATE TABLE IF NOT EXISTS learner_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    education_stage education_stage NOT NULL,
    academic_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    encrypted_pii TEXT NOT NULL,
    current_school VARCHAR(255),
    region VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_jhs_education_stage CHECK (education_stage IN ('JHS_1', 'JHS_2', 'JHS_3', 'COMPLETED_JHS'))
);

-- Guardianships Table (Maps guardians to JHS learners)
CREATE TABLE IF NOT EXISTS guardianships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    guardian_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL,
    consent_status consent_status NOT NULL DEFAULT 'PENDING',
    consent_timestamp TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_guardianship_learner_guardian UNIQUE (learner_id, guardian_id)
);

-- Institutions Table (Ghanaian SHS, TVET, STEM institutions)
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    cssps_code VARCHAR(50) NOT NULL UNIQUE,
    institution_type institution_type NOT NULL DEFAULT 'SHS',
    category VARCHAR(10),
    gender_type institution_gender NOT NULL DEFAULT 'MIXED',
    residence_type institution_residence NOT NULL DEFAULT 'DAY_AND_BOARDING',
    region VARCHAR(100) NOT NULL,
    district VARCHAR(150),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    website VARCHAR(255),
    contact_email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Opportunities Table (Scholarships, placements with rules_jsonb for deterministic matching)
CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    type opportunity_type NOT NULL,
    rules_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    application_deadline TIMESTAMPTZ,
    expiry_date TIMESTAMPTZ NOT NULL,
    status opportunity_status NOT NULL DEFAULT 'ACTIVE',
    slots_available INTEGER,
    source_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Vector Documents Table (Chunked official documents for RAG pipeline)
CREATE TABLE IF NOT EXISTS vector_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255),
    content TEXT NOT NULL,
    embedding vector(1536) NOT NULL,
    source_url VARCHAR(500) NOT NULL,
    document_type VARCHAR(100),
    chunk_index INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. PERFORMANCE & INTEGRITY INDEXES

-- Users Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Learner Profiles Indexes
CREATE INDEX IF NOT EXISTS idx_learner_profiles_user_id ON learner_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_learner_profiles_education_stage ON learner_profiles(education_stage);
CREATE INDEX IF NOT EXISTS idx_learner_profiles_region ON learner_profiles(region);

-- Guardianships Indexes
CREATE INDEX IF NOT EXISTS idx_guardianships_learner_id ON guardianships(learner_id);
CREATE INDEX IF NOT EXISTS idx_guardianships_guardian_id ON guardianships(guardian_id);
CREATE INDEX IF NOT EXISTS idx_guardianships_consent_status ON guardianships(consent_status);

-- Institutions Indexes
CREATE INDEX IF NOT EXISTS idx_institutions_cssps_code ON institutions(cssps_code);
CREATE INDEX IF NOT EXISTS idx_institutions_region ON institutions(region);
CREATE INDEX IF NOT EXISTS idx_institutions_is_verified ON institutions(is_verified);
CREATE INDEX IF NOT EXISTS idx_institutions_type ON institutions(institution_type);

-- Opportunities Indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_expiry_date ON opportunities(expiry_date);
CREATE INDEX IF NOT EXISTS idx_opportunities_institution_id ON opportunities(institution_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_rules_jsonb ON opportunities USING gin(rules_jsonb);

-- Vector Documents Indexes
CREATE INDEX IF NOT EXISTS idx_vector_docs_source_url ON vector_documents(source_url);
CREATE INDEX IF NOT EXISTS idx_vector_docs_doc_type ON vector_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_vector_docs_metadata ON vector_documents USING gin(metadata);
-- HNSW Vector Index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS idx_vector_docs_embedding_hnsw 
ON vector_documents USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- 5. AUTO-UPDATE TIMESTAMPS
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
    CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_learner_profiles_updated_at BEFORE UPDATE ON learner_profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_guardianships_updated_at BEFORE UPDATE ON guardianships FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_institutions_updated_at BEFORE UPDATE ON institutions FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER trg_vector_documents_updated_at BEFORE UPDATE ON vector_documents FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;
