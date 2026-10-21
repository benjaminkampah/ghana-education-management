"""
PyTest Suite for Module 1: Database Schema & SQLAlchemy Models Parity
"""

import sys
import os
import pytest

# Add src to python path
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


def test_table_names():
    """Verify all 6 core entity table names strictly match the TDD."""
    assert User.__tablename__ == "users"
    assert LearnerProfile.__tablename__ == "learner_profiles"
    assert Guardianship.__tablename__ == "guardianships"
    assert Institution.__tablename__ == "institutions"
    assert Opportunity.__tablename__ == "opportunities"
    assert VectorDocument.__tablename__ == "vector_documents"


def test_jhs_education_stages():
    """Verify Ghanaian JHS education stage enums."""
    stages = [stage.value for stage in EducationStage]
    assert "JHS_1" in stages
    assert "JHS_2" in stages
    assert "JHS_3" in stages
    assert "COMPLETED_JHS" in stages


def test_user_roles():
    """Verify user roles per RBAC specification."""
    roles = [role.value for role in UserRole]
    assert "LEARNER" in roles
    assert "GUARDIAN" in roles
    assert "ADMIN" in roles


def test_learner_profile_constraints():
    """Verify JHS state constraint and 1:1 user relation."""
    table = LearnerProfile.__table__
    constraint_names = [c.name for c in table.constraints]
    assert "chk_jhs_education_stage" in constraint_names

    # Check foreign keys
    fks = list(table.foreign_keys)
    fk_targets = [f"{fk.column.table.name}.{fk.column.name}" for fk in fks]
    assert "users.id" in fk_targets


def test_guardianship_constraints():
    """Verify guardianships unique constraint for learner and guardian mapping."""
    table = Guardianship.__table__
    constraint_names = [c.name for c in table.constraints]
    assert "uq_guardianship_learner_guardian" in constraint_names

    fks = list(table.foreign_keys)
    fk_targets = [f"{fk.column.table.name}.{fk.column.name}" for fk in fks]
    assert "learner_profiles.id" in fk_targets
    assert "users.id" in fk_targets


def test_institution_fields():
    """Verify institutions schema has unique cssps_code and regional tracking."""
    table = Institution.__table__
    assert "cssps_code" in table.c
    assert table.c.cssps_code.unique or any(
        col.name == "cssps_code" for idx in table.indexes if idx.unique
    )
    assert "region" in table.c
    assert "is_verified" in table.c


def test_opportunities_rules_jsonb():
    """Verify opportunities schema contains rules_jsonb for deterministic matching."""
    table = Opportunity.__table__
    assert "rules_jsonb" in table.c
    assert "expiry_date" in table.c
    assert "type" in table.c
    assert "status" in table.c


def test_vector_documents_embedding():
    """Verify vector_documents embedding column has 1536 dimension."""
    table = VectorDocument.__table__
    assert "embedding" in table.c
    assert "source_url" in table.c
    assert "content" in table.c
    embedding_col = table.c.embedding
    assert embedding_col.type.dim == 1536


if __name__ == "__main__":
    pytest.main(["-v", __file__])
