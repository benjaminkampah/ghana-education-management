"""
Native unittest runner for Module 1 Schema Validation
Can run in any environment with zero external test runners.
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from models.schema import (
    Base,
    User,
    LearnerProfile,
    Guardianship,
    Institution,
    Opportunity,
    VectorDocument,
    UserRole,
    EducationStage,
    ConsentStatus,
    InstitutionType,
    InstitutionGender,
    InstitutionResidence,
    OpportunityType,
    OpportunityStatus,
)


class TestModule1Schema(unittest.TestCase):
    def test_table_names(self):
        """Verify all 6 core entity table names strictly match the TDD."""
        self.assertEqual(User.__tablename__, "users")
        self.assertEqual(LearnerProfile.__tablename__, "learner_profiles")
        self.assertEqual(Guardianship.__tablename__, "guardianships")
        self.assertEqual(Institution.__tablename__, "institutions")
        self.assertEqual(Opportunity.__tablename__, "opportunities")
        self.assertEqual(VectorDocument.__tablename__, "vector_documents")

    def test_jhs_education_stages(self):
        """Verify Ghanaian JHS education stage enums."""
        stages = [stage.value for stage in EducationStage]
        self.assertIn("JHS_1", stages)
        self.assertIn("JHS_2", stages)
        self.assertIn("JHS_3", stages)
        self.assertIn("COMPLETED_JHS", stages)

    def test_user_roles(self):
        """Verify user roles per RBAC specification."""
        roles = [role.value for role in UserRole]
        self.assertIn("LEARNER", roles)
        self.assertIn("GUARDIAN", roles)
        self.assertIn("ADMIN", roles)

    def test_learner_profile_constraints(self):
        """Verify JHS state constraint and 1:1 user relation."""
        table = LearnerProfile.__table__
        constraint_names = [c.name for c in table.constraints]
        self.assertIn("chk_jhs_education_stage", constraint_names)

        fks = list(table.foreign_keys)
        fk_targets = [f"{fk.column.table.name}.{fk.column.name}" for fk in fks]
        self.assertIn("users.id", fk_targets)

    def test_guardianship_constraints(self):
        """Verify guardianships unique constraint for learner and guardian mapping."""
        table = Guardianship.__table__
        constraint_names = [c.name for c in table.constraints]
        self.assertIn("uq_guardianship_learner_guardian", constraint_names)

        fks = list(table.foreign_keys)
        fk_targets = [f"{fk.column.table.name}.{fk.column.name}" for fk in fks]
        self.assertIn("learner_profiles.id", fk_targets)
        self.assertIn("users.id", fk_targets)

    def test_institution_fields(self):
        """Verify institutions schema has unique cssps_code and regional tracking."""
        table = Institution.__table__
        self.assertIn("cssps_code", table.c)
        self.assertTrue(
            table.c.cssps_code.unique or any(
                col.name == "cssps_code" for idx in table.indexes if idx.unique
            )
        )
        self.assertIn("region", table.c)
        self.assertIn("is_verified", table.c)

    def test_opportunities_rules_jsonb(self):
        """Verify opportunities schema contains rules_jsonb for deterministic matching."""
        table = Opportunity.__table__
        self.assertIn("rules_jsonb", table.c)
        self.assertIn("expiry_date", table.c)
        self.assertIn("type", table.c)
        self.assertIn("status", table.c)

    def test_vector_documents_embedding(self):
        """Verify vector_documents embedding column has 1536 dimension."""
        table = VectorDocument.__table__
        self.assertIn("embedding", table.c)
        self.assertIn("source_url", table.c)
        self.assertIn("content", table.c)
        self.assertEqual(table.c.embedding.type.dim, 1536)


if __name__ == "__main__":
    unittest.main()
