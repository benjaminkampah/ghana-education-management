"""
Deterministic Rule Evaluator for Project Antigravity.
Evaluates Opportunity.eligibilityRules against LearnerProfile.academicRecords.
"""

from typing import Any, Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime

from .operators import evaluate_operator


# The 4 Exact System States required by the specification
STATE_ELIGIBLE = "STATE_ELIGIBLE"
STATE_POTENTIAL = "STATE_POTENTIAL"
STATE_INELIGIBLE = "STATE_INELIGIBLE"
STATE_INSUFFICIENT_DATA = "STATE_INSUFFICIENT_DATA"

EvaluationState = (
    STATE_ELIGIBLE,
    STATE_POTENTIAL,
    STATE_INELIGIBLE,
    STATE_INSUFFICIENT_DATA,
)


@dataclass
class CriterionResult:
    field: str
    operator: str
    expected: Any
    actual: Optional[Any] = None
    is_mandatory: bool = True
    status: str = "PENDING"  # PASSED, FAILED, MISSING
    description: Optional[str] = None


@dataclass
class EvaluationReport:
    state: str
    missing_fields: List[str]
    mandatory_criteria: List[CriterionResult] = field(default_factory=list)
    optional_criteria: List[CriterionResult] = field(default_factory=list)
    evaluated_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())


def _resolve_nested_value(data: Dict[str, Any], path: str) -> Tuple[bool, Any]:
    """
    Traverses dictionary keys with dot notation (e.g. 'core_subjects.mathematics').
    Returns (found: bool, value: Any).
    """
    if not isinstance(data, dict):
        return False, None
        
    parts = path.strip().split(".")
    curr: Any = data
    for part in parts:
        if isinstance(curr, dict) and part in curr:
            curr = curr[part]
        else:
            return False, None
    return True, curr


def extract_field_value(
    academic_records: Optional[Dict[str, Any]],
    learner_profile: Optional[Any],
    field_name: str
) -> Tuple[bool, Any]:
    """
    Extracts field value first from academic_records JSONB,
    then falls back to root LearnerProfile attributes (e.g. region, education_stage).
    """
    clean_name = field_name.strip()
    
    # 1. Check academic records JSONB
    if academic_records and isinstance(academic_records, dict):
        found, val = _resolve_nested_value(academic_records, clean_name)
        if found and val is not None:
            return True, val

    # 2. Check root LearnerProfile attributes
    if learner_profile is not None:
        # Check direct attribute or snake_case / camelCase variants
        attr_candidates = [
            clean_name,
            clean_name.lower(),
            clean_name.replace(".", "_"),
        ]
        for attr in attr_candidates:
            if hasattr(learner_profile, attr):
                val = getattr(learner_profile, attr)
                # Unwrap enums if applicable
                if hasattr(val, "value"):
                    val = val.value
                if val is not None:
                    return True, val

    return False, None


def parse_rules_payload(rules_payload: Any) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Normalizes eligibility rules JSON structure into (mandatory_rules, optional_rules).
    Supports:
      1. { "mandatory": [...], "optional": [...] }
      2. { "criteria": [ {"field": ..., "is_mandatory": true/false} ] }
      3. [ {"field": ..., "is_mandatory": true/false} ]
    """
    mandatory: List[Dict[str, Any]] = []
    optional: List[Dict[str, Any]] = []

    if not rules_payload:
        return mandatory, optional

    if isinstance(rules_payload, dict):
        if "mandatory" in rules_payload or "optional" in rules_payload:
            for item in rules_payload.get("mandatory", []):
                if isinstance(item, dict):
                    mandatory.append(item)
            for item in rules_payload.get("optional", []):
                if isinstance(item, dict):
                    optional.append(item)
            return mandatory, optional

        if "criteria" in rules_payload and isinstance(rules_payload["criteria"], list):
            for item in rules_payload["criteria"]:
                if isinstance(item, dict):
                    if item.get("is_mandatory", True):
                        mandatory.append(item)
                    else:
                        optional.append(item)
            return mandatory, optional

    elif isinstance(rules_payload, list):
        for item in rules_payload:
            if isinstance(item, dict):
                if item.get("is_mandatory", True):
                    mandatory.append(item)
                else:
                    optional.append(item)
        return mandatory, optional

    return mandatory, optional


def evaluate_eligibility(
    learner_profile: Any,
    opportunity: Any,
    academic_records_override: Optional[Dict[str, Any]] = None,
    rules_override: Optional[Dict[str, Any]] = None,
) -> EvaluationReport:
    """
    Deterministic rule evaluation logic.
    Computes eligibility state and missing fields based strictly on boolean logic.
    """
    # 1. Resolve Academic Records
    academic_records = academic_records_override
    if academic_records is None:
        if hasattr(learner_profile, "academic_records") and learner_profile.academic_records is not None:
            academic_records = learner_profile.academic_records
        elif hasattr(learner_profile, "academic_data") and learner_profile.academic_data is not None:
            academic_records = learner_profile.academic_data
        else:
            academic_records = {}

    # 2. Resolve Eligibility Rules
    rules_payload = rules_override
    if rules_payload is None:
        if hasattr(opportunity, "eligibility_rules") and opportunity.eligibility_rules is not None:
            rules_payload = opportunity.eligibility_rules
        elif hasattr(opportunity, "rules_jsonb") and opportunity.rules_jsonb is not None:
            rules_payload = opportunity.rules_jsonb
        else:
            rules_payload = {}

    mandatory_specs, optional_specs = parse_rules_payload(rules_payload)

    missing_fields: List[str] = []
    mandatory_results: List[CriterionResult] = []
    optional_results: List[CriterionResult] = []

    has_mandatory_failure = False
    has_mandatory_missing = False

    # 3. Evaluate Mandatory Criteria
    for spec in mandatory_specs:
        field_name = spec.get("field", "")
        op = spec.get("operator", "eq")
        expected = spec.get("value")
        desc = spec.get("description")

        found, actual = extract_field_value(academic_records, learner_profile, field_name)
        if not found or actual is None:
            has_mandatory_missing = True
            if field_name and field_name not in missing_fields:
                missing_fields.append(field_name)
            mandatory_results.append(CriterionResult(
                field=field_name,
                operator=op,
                expected=expected,
                actual=None,
                is_mandatory=True,
                status="MISSING",
                description=desc
            ))
        else:
            passes = evaluate_operator(op, actual, expected)
            status = "PASSED" if passes else "FAILED"
            if not passes:
                has_mandatory_failure = True
            mandatory_results.append(CriterionResult(
                field=field_name,
                operator=op,
                expected=expected,
                actual=actual,
                is_mandatory=True,
                status=status,
                description=desc
            ))

    # 4. Evaluate Optional Criteria
    has_optional_unmet = False
    for spec in optional_specs:
        field_name = spec.get("field", "")
        op = spec.get("operator", "eq")
        expected = spec.get("value")
        desc = spec.get("description")

        found, actual = extract_field_value(academic_records, learner_profile, field_name)
        if not found or actual is None:
            has_optional_unmet = True
            optional_results.append(CriterionResult(
                field=field_name,
                operator=op,
                expected=expected,
                actual=None,
                is_mandatory=False,
                status="MISSING",
                description=desc
            ))
        else:
            passes = evaluate_operator(op, actual, expected)
            status = "PASSED" if passes else "FAILED"
            if not passes:
                has_optional_unmet = True
            optional_results.append(CriterionResult(
                field=field_name,
                operator=op,
                expected=expected,
                actual=actual,
                is_mandatory=False,
                status=status,
                description=desc
            ))

    # 5. Determine State Output (The 4 System States)
    # Rule 1: If any mandatory rule explicitly failed -> STATE_INELIGIBLE
    if has_mandatory_failure:
        state = STATE_INELIGIBLE

    # Rule 2: If no mandatory rule failed, but mandatory fields are missing -> STATE_INSUFFICIENT_DATA
    elif has_mandatory_missing:
        state = STATE_INSUFFICIENT_DATA

    # Rule 3: All mandatory rules passed.
    # If there are optional rules and some were not met -> STATE_POTENTIAL
    elif optional_specs and has_optional_unmet:
        state = STATE_POTENTIAL

    # Rule 4: All mandatory criteria passed and any optional criteria passed (or none specified) -> STATE_ELIGIBLE
    else:
        state = STATE_ELIGIBLE

    return EvaluationReport(
        state=state,
        missing_fields=missing_fields,
        mandatory_criteria=mandatory_results,
        optional_criteria=optional_results
    )
