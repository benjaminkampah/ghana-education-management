"""
Comprehensive PyTest Suite for Module 3: Deterministic Eligibility Engine.
Tests:
1. Deterministic Operators (eq, lte, gte, in, contains, between, etc.)
2. Four Exact States (STATE_ELIGIBLE, STATE_POTENTIAL, STATE_INELIGIBLE, STATE_INSUFFICIENT_DATA)
3. Missing Fields Identification
4. Nested JSONB Attribute Traversal
5. FastAPI REST API Endpoint Integration (POST /api/v1/engine/evaluate)
"""

import sys
import os
import uuid
import pytest
from datetime import datetime

# Add src to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from engine.operators import (
    evaluate_operator,
    op_eq,
    op_lte,
    op_gte,
    op_in,
    op_contains,
    op_between,
    op_intersects,
)
from engine.evaluator import (
    evaluate_eligibility,
    extract_field_value,
    STATE_ELIGIBLE,
    STATE_POTENTIAL,
    STATE_INELIGIBLE,
    STATE_INSUFFICIENT_DATA,
)

# Mock / Stub class to test evaluation logic independently
class DummyProfile:
    def __init__(self, academic_data=None, education_stage="JHS_3", region="GREATER_ACCRA"):
        self.id = uuid.uuid4()
        self.academic_data = academic_data or {}
        self.academic_records = self.academic_data
        self.education_stage = education_stage
        self.region = region


class DummyOpportunity:
    def __init__(self, rules_jsonb=None):
        self.id = uuid.uuid4()
        self.rules_jsonb = rules_jsonb or {}
        self.eligibility_rules = self.rules_jsonb


# ==============================================================================
# 1. OPERATOR UNIT TESTS
# ==============================================================================

def test_operators_equality():
    assert evaluate_operator("eq", "JHS_3", "JHS_3") is True
    assert evaluate_operator("eq", "jhs_3", "JHS_3") is True  # Case-insensitive
    assert evaluate_operator("eq", 15, "15") is True  # Numeric coercion
    assert evaluate_operator("eq", "ACCRA", "KUMASI") is False
    assert evaluate_operator("ne", "ACCRA", "KUMASI") is True


def test_operators_numeric_comparisons():
    # BECE Aggregates: Lower is better (e.g., aggregate <= 15)
    assert evaluate_operator("lte", 12, 15) is True
    assert evaluate_operator("lte", 15, 15) is True
    assert evaluate_operator("lte", 18, 15) is False
    assert evaluate_operator("lt", 14, 15) is True
    assert evaluate_operator("gte", 15, 12) is True
    assert evaluate_operator("gt", 16, 15) is True


def test_operators_in_and_contains():
    regions = ["GREATER_ACCRA", "ASHANTI", "CENTRAL"]
    assert evaluate_operator("in", "ASHANTI", regions) is True
    assert evaluate_operator("in", "ashanti", regions) is True
    assert evaluate_operator("in", "VOLTA", regions) is False

    interests = ["STEM", "Robotics", "Agriculture"]
    assert evaluate_operator("contains", interests, "Robotics") is True
    assert evaluate_operator("contains", interests, "robotics") is True
    assert evaluate_operator("contains", interests, "Medicine") is False


def test_operators_between_and_intersects():
    assert evaluate_operator("between", 12, [10, 20]) is True
    assert evaluate_operator("between", 25, [10, 20]) is False
    assert evaluate_operator("intersects", ["STEM", "TVET"], ["TVET", "ARTS"]) is True
    assert evaluate_operator("intersects", ["STEM"], ["ARTS", "MUSIC"]) is False


# ==============================================================================
# 2. DETERMINISTIC ENGINE EVALUATOR TESTS (THE 4 STATES)
# ==============================================================================

def test_evaluate_state_eligible():
    """All mandatory criteria pass and all optional criteria pass."""
    rules = {
        "mandatory": [
            {"field": "bece_aggregate", "operator": "lte", "value": 15, "description": "BECE raw aggregate <= 15"},
            {"field": "core_subjects.mathematics", "operator": "lte", "value": 3, "description": "Math grade 3 or better"},
            {"field": "region", "operator": "in", "value": ["GREATER_ACCRA", "ASHANTI"]}
        ],
        "optional": [
            {"field": "interests", "operator": "contains", "value": "STEM"}
        ]
    }

    learner = DummyProfile(
        academic_data={
            "bece_aggregate": 10,
            "core_subjects": {"mathematics": 2, "english": 2, "science": 1},
            "interests": ["STEM", "Robotics"]
        },
        region="GREATER_ACCRA"
    )

    opp = DummyOpportunity(rules_jsonb=rules)
    report = evaluate_eligibility(learner, opp)

    assert report.state == STATE_ELIGIBLE
    assert len(report.missing_fields) == 0
    assert all(c.status == "PASSED" for c in report.mandatory_criteria)
    assert all(c.status == "PASSED" for c in report.optional_criteria)


def test_evaluate_state_ineligible():
    """A mandatory criterion fails (e.g. BECE aggregate 18 > 15)."""
    rules = {
        "mandatory": [
            {"field": "bece_aggregate", "operator": "lte", "value": 15, "description": "BECE aggregate <= 15"},
            {"field": "core_subjects.mathematics", "operator": "lte", "value": 2}
        ]
    }

    learner = DummyProfile(
        academic_data={
            "bece_aggregate": 18,  # Ineligible: 18 > 15
            "core_subjects": {"mathematics": 1}
        }
    )

    opp = DummyOpportunity(rules_jsonb=rules)
    report = evaluate_eligibility(learner, opp)

    assert report.state == STATE_INELIGIBLE
    failed = [c for c in report.mandatory_criteria if c.status == "FAILED"]
    assert len(failed) == 1
    assert failed[0].field == "bece_aggregate"


def test_evaluate_state_insufficient_data():
    """Mandatory field is missing from learner's academic records."""
    rules = {
        "mandatory": [
            {"field": "bece_aggregate", "operator": "lte", "value": 15},
            {"field": "core_subjects.science", "operator": "lte", "value": 3},
            {"field": "national_id", "operator": "eq", "value": "GH-123456"}
        ]
    }

    learner = DummyProfile(
        academic_data={
            # bece_aggregate is missing!
            # core_subjects.science is missing!
            "core_subjects": {"mathematics": 2}
        }
    )

    opp = DummyOpportunity(rules_jsonb=rules)
    report = evaluate_eligibility(learner, opp)

    assert report.state == STATE_INSUFFICIENT_DATA
    assert "bece_aggregate" in report.missing_fields
    assert "core_subjects.science" in report.missing_fields
    assert "national_id" in report.missing_fields


def test_evaluate_state_potential():
    """All mandatory criteria pass, but optional criteria are unmet."""
    rules = {
        "mandatory": [
            {"field": "bece_aggregate", "operator": "lte", "value": 15}
        ],
        "optional": [
            {"field": "preferred_residence", "operator": "eq", "value": "BOARDING"},
            {"field": "interests", "operator": "contains", "value": "AEROSPACE"}
        ]
    }

    learner = DummyProfile(
        academic_data={
            "bece_aggregate": 9,  # Mandatory passes
            "interests": ["General Science"]  # Optional "AEROSPACE" unmet
        }
    )

    opp = DummyOpportunity(rules_jsonb=rules)
    report = evaluate_eligibility(learner, opp)

    assert report.state == STATE_POTENTIAL
    assert len(report.missing_fields) == 0  # No mandatory fields missing
    assert any(c.status != "PASSED" for c in report.optional_criteria)


def test_nested_attribute_extraction():
    data = {
        "candidate": {
            "scores": {
                "math": 1,
                "english": 2
            }
        }
    }
    profile = DummyProfile(academic_data=data, region="ASHANTI")

    found, val = extract_field_value(data, profile, "candidate.scores.math")
    assert found is True
    assert val == 1

    found, val = extract_field_value(data, profile, "region")
    assert found is True
    assert val == "ASHANTI"

    found, val = extract_field_value(data, profile, "nonexistent.field")
    assert found is False
    assert val is None


# ==============================================================================
# 3. FASTAPI INTEGRATION & API ENDPOINT TESTS
# ==============================================================================

def test_api_endpoint_evaluate():
    """Verify POST /api/v1/engine/evaluate with TestClient & SQLite Mock DB."""
    try:
        from fastapi.testclient import TestClient
        from sqlalchemy import create_engine
        from sqlalchemy.orm import sessionmaker
        from sqlalchemy.pool import StaticPool
        from core.database import get_db
        from main import app
        from models.schema import Base, User, LearnerProfile, Opportunity, UserRole, EducationStage, OpportunityType, OpportunityStatus
    except ImportError as e:
        pytest.skip(f"TestClient / SQLAlchemy import skipped: {e}")

    # Create isolated in-memory SQLite database
    test_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    Base.metadata.create_all(bind=test_engine)

    db = TestingSessionLocal()

    # Seed test User & LearnerProfile
    learner_id = uuid.uuid4()
    test_user = User(
        id=uuid.uuid4(),
        email="test_learner@example.com",
        password_hash="hashed_pw_123",
        role=UserRole.LEARNER
    )
    db.add(test_user)
    db.flush()

    test_learner = LearnerProfile(
        id=learner_id,
        user_id=test_user.id,
        education_stage=EducationStage.JHS_3,
        academic_data={
            "bece_aggregate": 11,
            "core_subjects": {"mathematics": 2, "english": 1}
        },
        encrypted_pii="test_encrypted_pii",
        region="ASHANTI"
    )
    db.add(test_learner)

    # Seed test Opportunity
    opp_id = uuid.uuid4()
    test_opp = Opportunity(
        id=opp_id,
        title="Ashanti Regional STEM Bursary",
        description="Opportunity for talented JHS learners.",
        type=OpportunityType.SCHOLARSHIP,
        rules_jsonb={
            "mandatory": [
                {"field": "bece_aggregate", "operator": "lte", "value": 15},
                {"field": "region", "operator": "eq", "value": "ASHANTI"}
            ]
        },
        expiry_date=datetime(2027, 1, 1),
        status=OpportunityStatus.ACTIVE
    )
    db.add(test_opp)
    db.commit()

    # Override get_db dependency
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)

    # 1. Test Successful Evaluation -> STATE_ELIGIBLE
    response = client.post(
        "/api/v1/engine/evaluate",
        json={
            "learner_id": str(learner_id),
            "opportunity_id": str(opp_id)
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["state"] == "STATE_ELIGIBLE"
    assert data["learner_id"] == str(learner_id)
    assert data["opportunity_id"] == str(opp_id)
    assert len(data["missing_fields"]) == 0
    assert len(data["criteria_breakdown"]) == 2

    # 2. Test 404 for unknown learner
    random_learner_id = str(uuid.uuid4())
    res_404 = client.post(
        "/api/v1/engine/evaluate",
        json={
            "learner_id": random_learner_id,
            "opportunity_id": str(opp_id)
        }
    )
    assert res_404.status_code == 404
    assert f"LearnerProfile with id '{random_learner_id}' not found." in res_404.json()["detail"]

    # 3. Test 404 for unknown opportunity
    random_opp_id = str(uuid.uuid4())
    res_opp_404 = client.post(
        "/api/v1/engine/evaluate",
        json={
            "learner_id": str(learner_id),
            "opportunity_id": random_opp_id
        }
    )
    assert res_opp_404.status_code == 404
    assert f"Opportunity with id '{random_opp_id}' not found." in res_opp_404.json()["detail"]

    db.close()
    app.dependency_overrides.clear()
