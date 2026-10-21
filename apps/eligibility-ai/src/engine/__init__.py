"""Deterministic Rules Engine package for opportunity evaluation."""

from .evaluator import (
    evaluate_eligibility,
    EvaluationState,
    STATE_ELIGIBLE,
    STATE_POTENTIAL,
    STATE_INELIGIBLE,
    STATE_INSUFFICIENT_DATA,
)
from .operators import evaluate_operator, SUPPORTED_OPERATORS

__all__ = [
    "evaluate_eligibility",
    "EvaluationState",
    "STATE_ELIGIBLE",
    "STATE_POTENTIAL",
    "STATE_INELIGIBLE",
    "STATE_INSUFFICIENT_DATA",
    "evaluate_operator",
    "SUPPORTED_OPERATORS",
]
