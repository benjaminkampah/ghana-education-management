# Project Antigravity (TIA Phase 1.0 - Ghana JHS MVP)

**The Talent & Innovation Academy (TIA)** is an education and opportunity discovery platform tailored for Ghanaian Junior High School (JHS) learners. It guides learners transitioning through JHS (JHS 1, 2, 3) to Senior High School (SHS), TVET (Technical and Vocational Education and Training), and STEM programs.

---

## Architecture & Monorepo Structure

```
project-antigravity/
├── .env.example                                      # Environment variables template
├── docker-compose.yml                                # PostgreSQL 16 + pgvector container
├── package.json                                      # Monorepo root workspace configuration
├── packages/
│   └── database/                                     # Module 1: Shared Database Package
│       ├── package.json
│       ├── prisma/
│       │   ├── schema.prisma                         # Prisma Schema (pgvector + core entities)
│       │   └── migrations/
│       │       └── 20261020000000_init_schema/
│       │           └── migration.sql                 # Complete PostgreSQL SQL migration
│       └── src/
│           ├── index.ts                              # Exported PrismaClient & Ghana constants
│           └── test/verify-schema.ts                 # Schema verification test
└── apps/
    ├── eligibility-ai/                               # Modules 3 & 4: FastAPI Engine & RAG
    │   ├── requirements.txt
    │   ├── src/
    │   │   ├── main.py                               # FastAPI Application Entrypoint
    │   │   ├── core/                                 # Config & Database Session Management
    │   │   ├── models/schema.py                      # SQLAlchemy Models (pgvector parity)
    │   │   ├── engine/                               # Module 3: Deterministic Rules Engine
    │   │   │   ├── operators.py                      # Strict boolean operators (eq, lte, in, etc.)
    │   │   │   └── evaluator.py                      # Exact 4-state rule evaluation
    │   │   ├── rag/                                  # Module 4: AI RAG & Knowledge Base
    │   │   │   ├── chunker.py                        # Contextual text chunking with overlap
    │   │   │   ├── embeddings.py                     # 1536-dim OpenAI embeddings
    │   │   │   └── service.py                        # pgvector search + CSSPS disclaimer prompt
    │   │   ├── schemas/                              # Pydantic Request/Response models
    │   │   └── api/v1/                               # REST Endpoints (/engine, /admin, /ai)
    │   └── tests/
    │       ├── test_schema.py                        # Module 1 schema parity tests
    │       ├── test_engine.py                        # Module 3 rules engine tests (10/10)
    │       └── test_rag.py                           # Module 4 RAG pipeline tests (10/10)
    └── web/                                          # Module 5: Next.js Client Tier
        ├── package.json
        ├── next.config.ts
        └── src/
            ├── app/
            │   ├── layout.tsx                        # Inter font, dark theme, metadata
            │   ├── globals.css                       # Obsidian & emerald glassmorphism theme
            │   └── page.tsx                          # Interactive dashboard & tabs
            ├── components/
            │   ├── Navbar.tsx                        # Top navigation with live status
            │   ├── AuthModal.tsx                     # EducationLevel onboarding & login
            │   ├── AcademicRecordsCard.tsx           # BECE grades (1-9) & aggregate inputs
            │   ├── InstitutionsDirectory.tsx         # Search verified Ghanaian SHS/TVET schools
            │   ├── OpportunityMatcher.tsx            # Module 3 exact 4-state visualizer
            │   └── AiChatWidget.tsx                  # Module 4 RAG Assistant + CSSPS disclaimer
            └── lib/
                ├── types.ts                          # Shared domain types
                ├── mockData.ts                       # Verified Ghanaian schools & scholarships
                └── api.ts                            # Resilient API client for all environments
```

---

## Implemented Modules

### Module 1: Database & Schema
- PostgreSQL 16 + pgvector schema defined in both Prisma and SQLAlchemy.
- HNSW index on `vector_documents.embedding` (`vector_cosine_ops`).
- GIN index on `opportunities.rules_jsonb` for deterministic JSONB querying.

### Module 2: Authentication & Onboarding
- Captures `EducationLevel` (`JHS`, `SHS`, `TERTIARY`, `POSTGRADUATE`, `OTHER`) directly during signup.
- Generates stateless JWT tokens with role-based claims.

### Module 3: Deterministic Eligibility Engine (FastAPI)
- Isolated boolean rules engine located in `apps/eligibility-ai/src/engine/`.
- Evaluates `Opportunity.eligibilityRules` against `LearnerProfile.academicRecords`.
- Returns one of four exact system states:
  - `STATE_ELIGIBLE`: All mandatory criteria pass.
  - `STATE_POTENTIAL`: Mandatory criteria pass, but some optional preferences are unmet.
  - `STATE_INELIGIBLE`: One or more mandatory criteria explicitly fail.
  - `STATE_INSUFFICIENT_DATA`: Mandatory fields are missing, returned in `missing_fields`.

### Module 4: AI RAG Service & Knowledge Base (FastAPI & pgvector)
- `POST /api/v1/admin/ingest`: Chunks text, computes 1536-dimensional embeddings, and stores document records with official `source_url`.
- `POST /api/v1/ai/chat`: Semantic similarity search against pgvector chunks.
- Constrained prompt system strictly forbidding hallucinations and admissions guarantees:
  > *"You are an academic guide. Answer using ONLY the provided context. You cannot guarantee CSSPS placements. Always cite the `source_url`."*

### Module 5: Frontend Interface (Next.js 14+ App Router & Tailwind CSS)
- Responsive, mobile-first design with a dark obsidian and emerald aesthetic.
- **Onboarding Flow:** Signup form capturing the `EducationLevel` dropdown.
- **Academic Records Card:** BECE raw score and core subject inputs (grades 1–9) with live aggregate computation.
- **Institutions Directory:** Live search and filtering across verified Ghanaian SHS and TVET institutions by category (A/B/C/TVET/STEM), region, and gender.
- **Opportunity Matcher:** Live visualizer of the Module 3 Engine with glowing state badges and missing fields alerts.
- **AI Chat Widget:** Floating sidebar assistant connecting to the Module 4 RAG endpoint with source links and the mandatory CSSPS placement disclaimer.

---

## Verifying the Monorepo

### 1. Run Node.js Database Parity Verification
```bash
npm run db:test
```

### 2. Run All Python FastAPI PyTest Suites (Modules 1, 3, & 4)
```bash
python -m pytest apps/eligibility-ai/tests -v
```
*(All 36/36 tests passing)*

### 3. Build the Next.js Frontend (Module 5)
```bash
npm --workspace=@antigravity/web run build
```

### 4. Run the Next.js Web App Locally
```bash
npm --workspace=@antigravity/web run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
