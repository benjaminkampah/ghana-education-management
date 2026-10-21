"""
Pydantic Schemas for Module 3 Deterministic Eligibility Engine.
"""

from typing import Any, List, Optional, Literal
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field

# Exact 4 states
EvaluationStateType = Literal[
    "STATE_ELIGIBLE",
    "STATE_POTENTIAL",
    "STATE_INELIGIBLE",
    "STATE_INSUFFICIENT_DATA",
]


class EvaluationRequest(BaseModel):
    """Payload for POST /api/v1/engine/evaluate"""
    learner_id: UUID = Field(..., description="UUID of the learner profile to evaluate")
    opportunity_id: UUID = Field(..., description="UUID of the opportunity to evaluate against")

    model_config = {
        "json_schema_extra": {
            "example": {
                "learner_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "opportunity_id": "f5e4d3c2-b1a0-9876-dcba-fe0987654321"
            }
        }
    }


class CriterionBreakdown(BaseModel):
    """Breakdown of an individual rule criterion evaluated."""
    field: str
    operator: str
    expected: Any
    actual: Optional[Any] = None
    is_mandatory: bool
    status: Literal["PASSED", "FAILED", "MISSING"]
    description: Optional[str] = None


class EvaluationResponse(BaseModel):
    """Response payload for POST /api/v1/engine/evaluate"""
    learner_id: str
    opportunity_id: str
    state: EvaluationStateType
    missing_fields: List[str] = Field(default_factory=list)
    criteria_breakdown: Optional[List[CriterionBreakdown]] = None
    evaluated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "json_schema_extra": {
            "example": {
                "learner_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "opportunity_id": "f5e4d3c2-b1a0-9876-dcba-fe0987654321",
                "state": "STATE_ELIGIBLE",
                "missing_fields": [],
                "criteria_breakdown": [
                    {
                        "field": "bece_aggregate",
                        "operator": "lte",
                        "expected": 15,
                        "actual": 12,
                        "is_mandatory": True,
                        "status": "PASSED",
                        "description": "BECE aggregate must be 15 or better"
                    }
                ],
                "evaluated_at": "2026-10-20T17:50:00Z"
            }
        }
    }
