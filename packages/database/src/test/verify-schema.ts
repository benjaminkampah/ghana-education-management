import * as fs from "fs";
import * as path from "path";

function runVerification(): void {
  console.log("=================================================");
  console.log("PROJECT ANTIGRAVITY - MODULE 1 SCHEMA VALIDATION");
  console.log("=================================================");

  const rootDir = path.resolve(__dirname, "../../../..");
  const migrationPath = path.join(
    rootDir,
    "packages/database/prisma/migrations/20261020000000_init_schema/migration.sql"
  );
  const prismaSchemaPath = path.join(rootDir, "packages/database/prisma/schema.prisma");
  const pythonSchemaPath = path.join(rootDir, "apps/eligibility-ai/src/models/schema.py");

  // 1. Verify SQL Migration
  console.log("\n[1/3] Verifying PostgreSQL Migration Script...");
  if (!fs.existsSync(migrationPath)) {
    throw new Error(`Migration SQL file not found at: ${migrationPath}`);
  }
  const sqlContent = fs.readFileSync(migrationPath, "utf-8");

  const expectedTables = [
    "CREATE TABLE IF NOT EXISTS users",
    "CREATE TABLE IF NOT EXISTS learner_profiles",
    "CREATE TABLE IF NOT EXISTS guardianships",
    "CREATE TABLE IF NOT EXISTS institutions",
    "CREATE TABLE IF NOT EXISTS opportunities",
    "CREATE TABLE IF NOT EXISTS vector_documents"
  ];

  for (const table of expectedTables) {
    if (!sqlContent.includes(table)) {
      throw new Error(`Missing expected table statement in SQL: ${table}`);
    }
    console.log(`  ✓ Found table definition: ${table.replace("CREATE TABLE IF NOT EXISTS ", "")}`);
  }

  // Verify extensions
  const expectedExtensions = ['"vector"', '"uuid-ossp"', '"pgcrypto"'];
  for (const ext of expectedExtensions) {
    if (!sqlContent.includes(ext)) {
      throw new Error(`Missing extension in SQL migration: ${ext}`);
    }
    console.log(`  ✓ Found extension: ${ext}`);
  }

  // Verify JHS Stage Constraint
  if (!sqlContent.includes("chk_jhs_education_stage")) {
    throw new Error("Missing JHS education stage check constraint in SQL migration");
  }
  console.log("  ✓ Found JHS state constraint: chk_jhs_education_stage");

  // Verify pgvector HNSW Index
  if (!sqlContent.includes("idx_vector_docs_embedding_hnsw") || !sqlContent.includes("vector_cosine_ops")) {
    throw new Error("Missing HNSW cosine distance vector index in SQL migration");
  }
  console.log("  ✓ Found HNSW vector index: idx_vector_docs_embedding_hnsw (vector_cosine_ops)");

  // Verify GIN index on rules_jsonb
  if (!sqlContent.includes("idx_opportunities_rules_jsonb") || !sqlContent.includes("USING gin(rules_jsonb)")) {
    throw new Error("Missing GIN index on opportunities.rules_jsonb in SQL migration");
  }
  console.log("  ✓ Found GIN index: idx_opportunities_rules_jsonb for JSONB deterministic rules");

  // 2. Verify Prisma Schema
  console.log("\n[2/3] Verifying Prisma Schema...");
  if (!fs.existsSync(prismaSchemaPath)) {
    throw new Error(`Prisma schema file not found at: ${prismaSchemaPath}`);
  }
  const prismaContent = fs.readFileSync(prismaSchemaPath, "utf-8");

  const prismaModels = [
    "model User",
    "model LearnerProfile",
    "model Guardianship",
    "model Institution",
    "model Opportunity",
    "model VectorDocument"
  ];

  for (const model of prismaModels) {
    if (!prismaContent.includes(model)) {
      throw new Error(`Missing model in Prisma schema: ${model}`);
    }
    console.log(`  ✓ Found Prisma model: ${model}`);
  }

  if (!prismaContent.includes("extensions = [pgcrypto, vector]")) {
    throw new Error("Prisma schema missing vector extension datasource declaration");
  }
  console.log("  ✓ Found PostgreSQL pgvector extension declaration in schema.prisma");

  // 3. Verify Python SQLAlchemy Schema
  console.log("\n[3/3] Verifying Python SQLAlchemy Schema Parity...");
  if (!fs.existsSync(pythonSchemaPath)) {
    throw new Error(`Python schema file not found at: ${pythonSchemaPath}`);
  }
  const pythonContent = fs.readFileSync(pythonSchemaPath, "utf-8");

  const pythonModels = [
    "class User(Base):",
    "class LearnerProfile(Base):",
    "class Guardianship(Base):",
    "class Institution(Base):",
    "class Opportunity(Base):",
    "class VectorDocument(Base):"
  ];

  for (const pyModel of pythonModels) {
    if (!pythonContent.includes(pyModel)) {
      throw new Error(`Missing SQLAlchemy class in Python schema: ${pyModel}`);
    }
    console.log(`  ✓ Found Python SQLAlchemy model: ${pyModel}`);
  }

  if (!pythonContent.includes("chk_jhs_education_stage")) {
    throw new Error("Python SQLAlchemy model missing chk_jhs_education_stage CheckConstraint");
  }
  console.log("  ✓ Found Python JHS state CheckConstraint: chk_jhs_education_stage");

  if (!pythonContent.includes("Vector(1536)")) {
    throw new Error("Python SQLAlchemy model missing Vector(1536) embedding column");
  }
  console.log("  ✓ Found Python pgvector Vector(1536) embedding column");

  console.log("\n=================================================");
  console.log("ALL MODULE 1 DATABASE SCHEMA CHECKS PASSED (100%)");
  console.log("=================================================\n");
}

try {
  runVerification();
} catch (error) {
  console.error("\n❌ Schema verification failed:", error);
  process.exit(1);
}
