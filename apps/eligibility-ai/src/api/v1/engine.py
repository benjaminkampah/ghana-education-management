"""
FastAPI Router for Module 3: Deterministic Eligibility Engine.
Provides isolated boolean rule evaluation endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from core.database import get_db
from models.schema import LearnerProfile, Opportunity
from schemas.engine import EvaluationRequest, EvaluationResponse, CriterionBreakdown
from engine.evaluator import evaluate_eligibility

router = APIRouter(prefix="/engine", tags=["Deterministic Eligibility Engine"])


@router.post(
    "/evaluate",
    response_model=EvaluationResponse,
    status_code=status.HTTP_200_OK,
    summary="Evaluate learner eligibility against an opportunity",
    description="""
    Strict deterministic evaluation of an opportunity's JSONB criteria against a learner's academic records.
    Returns one of four exact system states:
    - **STATE_ELIGIBLE**: All mandatory criteria pass.
    - **STATE_POTENTIAL**: Mandatory criteria pass, but some optional preferences are unmet.
    - **STATE_INELIGIBLE**: One or more mandatory criteria fail.
    - **STATE_INSUFFICIENT_DATA**: Mandatory fields are missing from the learner's records.
    """,
)
def evaluate_learner_opportunity(
    payload: EvaluationRequest,
    db: Session = Depends(get_db)
) -> EvaluationResponse:
    # 1. Fetch LearnerProfile
    learner = db.query(LearnerProfile).filter(LearnerProfile.id == payload.learner_id).first()
    if not learner:
        # Fallback check if user_id was provided
        learner = db.query(LearnerProfile).filter(LearnerProfile.user_id == payload.learner_id).first()

    if not learner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"LearnerProfile with id '{payload.learner_id}' not found."
        )

    # 2. Fetch Opportunity
    opportunity = db.query(Opportunity).filter(Opportunity.id == payload.opportunity_id).first()
    if not opportunity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Opportunity with id '{payload.opportunity_id}' not found."
        )

    # 3. Perform Deterministic Boolean Evaluation
    report = evaluate_eligibility(learner_profile=learner, opportunity=opportunity)

    # 4. Map criteria breakdown
    all_criteria = report.mandatory_criteria + report.optional_criteria
    breakdown = [
        CriterionBreakdown(
            field=c.field,
            operator=c.operator,
            expected=c.expected,
            actual=c.actual,
            is_mandatory=c.is_mandatory,
            status=c.status,  # type: ignore
            description=c.description,
        )
        for c in all_criteria
    ]

    return EvaluationResponse(
        learner_id=str(learner.id),
        opportunity_id=str(opportunity.id),
        state=report.state,  # type: ignore
        missing_fields=report.missing_fields,
        criteria_breakdown=breakdown,
        evaluated_at=datetime.utcnow()
    )
