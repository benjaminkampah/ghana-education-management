"""
Deterministic operators for boolean eligibility rule evaluation.
Strict, isolated logic without reliance on external LLM inference.
"""

from typing import Any, List, Set, Union


def _to_number(val: Any) -> Union[int, float, None]:
    """Safely cast value to float or int for numeric comparisons."""
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return val
    if isinstance(val, str):
        try:
            cleaned = val.strip()
            if "." in cleaned:
                return float(cleaned)
            return int(cleaned)
        except ValueError:
            return None
    return None


def op_eq(actual: Any, expected: Any) -> bool:
    """Equality check, supporting case-insensitive strings and numeric casting."""
    if actual is None:
        return expected is None
    if isinstance(actual, str) and isinstance(expected, str):
        return actual.strip().lower() == expected.strip().lower()
    
    num_a = _to_number(actual)
    num_e = _to_number(expected)
    if num_a is not None and num_e is not None:
        return num_a == num_e
        
    return actual == expected


def op_ne(actual: Any, expected: Any) -> bool:
    """Not equal check."""
    return not op_eq(actual, expected)


def op_lt(actual: Any, expected: Any) -> bool:
    """Less than check (<). Supports numbers."""
    num_a = _to_number(actual)
    num_e = _to_number(expected)
    if num_a is not None and num_e is not None:
        return num_a < num_e
    return False


def op_lte(actual: Any, expected: Any) -> bool:
    """Less than or equal check (<=). Critical for BECE aggregate (e.g., aggregate <= 15)."""
    num_a = _to_number(actual)
    num_e = _to_number(expected)
    if num_a is not None and num_e is not None:
        return num_a <= num_e
    return False


def op_gt(actual: Any, expected: Any) -> bool:
    """Greater than check (>)."""
    num_a = _to_number(actual)
    num_e = _to_number(expected)
    if num_a is not None and num_e is not None:
        return num_a > num_e
    return False


def op_gte(actual: Any, expected: Any) -> bool:
    """Greater than or equal check (>=)."""
    num_a = _to_number(actual)
    num_e = _to_number(expected)
    if num_a is not None and num_e is not None:
        return num_a >= num_e
    return False


def op_in(actual: Any, expected: Any) -> bool:
    """Checks if actual value is present in expected collection."""
    if expected is None:
        return False
    if isinstance(expected, (list, tuple, set)):
        if isinstance(actual, str):
            clean_actual = actual.strip().lower()
            return any(str(item).strip().lower() == clean_actual for item in expected)
        return actual in expected
    if isinstance(expected, str) and isinstance(actual, str):
        return actual.strip().lower() in expected.strip().lower()
    return False


def op_not_in(actual: Any, expected: Any) -> bool:
    """Checks if actual value is NOT present in expected collection."""
    return not op_in(actual, expected)


def op_contains(actual: Any, expected: Any) -> bool:
    """
    Checks if actual container includes the expected value.
    Supports list/set membership, or substring in string.
    """
    if actual is None:
        return False
    if isinstance(actual, (list, tuple, set)):
        if isinstance(expected, str):
            clean_expected = expected.strip().lower()
            return any(str(item).strip().lower() == clean_expected for item in actual)
        return expected in actual
    if isinstance(actual, str):
        return str(expected).strip().lower() in actual.strip().lower()
    return False


def op_intersects(actual: Any, expected: Any) -> bool:
    """Checks if there is any intersection between two lists/sets (overlap)."""
    if not isinstance(actual, (list, tuple, set)) or not isinstance(expected, (list, tuple, set)):
        return False
    set_a = {str(item).strip().lower() for item in actual}
    set_e = {str(item).strip().lower() for item in expected}
    return bool(set_a.intersection(set_e))


def op_between(actual: Any, expected: Any) -> bool:
    """Checks if actual number falls between [min, max] inclusive."""
    num_a = _to_number(actual)
    if num_a is None or not isinstance(expected, (list, tuple)) or len(expected) < 2:
        return False
    num_min = _to_number(expected[0])
    num_max = _to_number(expected[1])
    if num_min is None or num_max is None:
        return False
    return num_min <= num_a <= num_max


def op_all(actual: Any, expected: Any) -> bool:
    """Checks if ALL items in expected list exist in actual list."""
    if not isinstance(actual, (list, tuple, set)) or not isinstance(expected, (list, tuple, set)):
        return False
    set_a = {str(item).strip().lower() for item in actual}
    set_e = {str(item).strip().lower() for item in expected}
    return set_e.issubset(set_a)


# Operator registry mapping operator string names to evaluation functions
OPERATOR_MAP = {
    "eq": op_eq,
    "equals": op_eq,
    "==": op_eq,
    "ne": op_ne,
    "!=": op_ne,
    "lt": op_lt,
    "<": op_lt,
    "lte": op_lte,
    "le": op_lte,
    "<=": op_lte,
    "gt": op_gt,
    ">": op_gt,
    "gte": op_gte,
    "ge": op_gte,
    ">=": op_gte,
    "in": op_in,
    "not_in": op_not_in,
    "contains": op_contains,
    "intersects": op_intersects,
    "overlap": op_intersects,
    "between": op_between,
    "all": op_all,
}

SUPPORTED_OPERATORS = list(OPERATOR_MAP.keys())


def evaluate_operator(operator: str, actual: Any, expected: Any) -> bool:
    """
    Evaluate a registered boolean operator.
    Returns False if operator is unrecognized or evaluation raises an unexpected error.
    """
    clean_op = str(operator).strip().lower()
    fn = OPERATOR_MAP.get(clean_op)
    if not fn:
        return False
    try:
        return fn(actual, expected)
    except Exception:
        return False
