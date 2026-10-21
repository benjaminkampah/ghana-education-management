"""
Project Antigravity (TIA Phase 1.0 - Ghana JHS MVP)
SQLAlchemy Database Models with pgvector Support
"""

import enum
import uuid
from datetime import datetime
from typing import Optional, List, Any

from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    Integer,
    CheckConstraint,
    UniqueConstraint,
    Index,
    Enum as SQLEnum,
    func,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import declarative_base, relationship, synonym

try:
    from pgvector.sqlalchemy import Vector
except ImportError:
    # Fallback to Text or custom type for testing environments without pgvector installed
    from sqlalchemy.types import UserDefinedType
    class Vector(UserDefinedType):
        def __init__(self, dim: int):
            self.dim = dim
        def get_col_spec(self, **kw):
            return f"vector({self.dim})"

Base = declarative_base()


class UserRole(str, enum.Enum):
    LEARNER = "LEARNER"
    GUARDIAN = "GUARDIAN"
    ADMIN = "ADMIN"


class EducationLevel(str, enum.Enum):
    JHS = "JHS"
    SHS = "SHS"
    TERTIARY = "TERTIARY"
    POSTGRADUATE = "POSTGRADUATE"
    OTHER = "OTHER"


class EducationStage(str, enum.Enum):
    JHS_1 = "JHS_1"
    JHS_2 = "JHS_2"
    JHS_3 = "JHS_3"
    COMPLETED_JHS = "COMPLETED_JHS"


class ConsentStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    REVOKED = "REVOKED"


class InstitutionType(str, enum.Enum):
    SHS = "SHS"
    TVET = "TVET"
    STEM_ACADEMY = "STEM_ACADEMY"
    TERTIARY_PARTNER = "TERTIARY_PARTNER"


class InstitutionGender(str, enum.Enum):
    MIXED = "MIXED"
    BOYS = "BOYS"
    GIRLS = "GIRLS"


class InstitutionResidence(str, enum.Enum):
    DAY = "DAY"
    BOARDING = "BOARDING"
    DAY_AND_BOARDING = "DAY_AND_BOARDING"


class OpportunityType(str, enum.Enum):
    SCHOLARSHIP = "SCHOLARSHIP"
    SHS_PLACEMENT = "SHS_PLACEMENT"
    TVET_TRACK = "TVET_TRACK"
    STEM_GRANT = "STEM_GRANT"
    MENTORSHIP = "MENTORSHIP"


class OpportunityStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"
    ARCHIVED = "ARCHIVED"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(
        SQLEnum(UserRole, name="user_role", create_type=False),
        nullable=False,
        default=UserRole.LEARNER,
        index=True
    )
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    learner_profile = relationship("LearnerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    guardianships = relationship("Guardianship", back_populates="guardian", foreign_keys="Guardianship.guardian_id")
    verified_institutions = relationship("Institution", back_populates="verifier")


class LearnerProfile(Base):
    __tablename__ = "learner_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    education_stage = Column(
        SQLEnum(EducationStage, name="education_stage", create_type=False),
        nullable=False,
        index=True
    )
    academic_data = Column(JSONB, nullable=False, server_default="{}")
    academic_records = synonym("academic_data")
    academicRecords = synonym("academic_data")
    encrypted_pii = Column(Text, nullable=False)
    current_school = Column(String(255), nullable=True)
    region = Column(String(100), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint(
            "education_stage IN ('JHS_1', 'JHS_2', 'JHS_3', 'COMPLETED_JHS')",
            name="chk_jhs_education_stage"
        ),
    )

    # Relationships
    user = relationship("User", back_populates="learner_profile")
    guardianships = relationship("Guardianship", back_populates="learner", cascade="all, delete-orphan")


class Guardianship(Base):
    __tablename__ = "guardianships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    learner_id = Column(UUID(as_uuid=True), ForeignKey("learner_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    guardian_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    relationship_type = Column(String(50), nullable=False)
    consent_status = Column(
        SQLEnum(ConsentStatus, name="consent_status", create_type=False),
        nullable=False,
        default=ConsentStatus.PENDING,
        index=True
    )
    consent_timestamp = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("learner_id", "guardian_id", name="uq_guardianship_learner_guardian"),
    )

    # Relationships
    learner = relationship("LearnerProfile", back_populates="guardianships")
    guardian = relationship("User", back_populates="guardianships", foreign_keys=[guardian_id])


class Institution(Base):
    __tablename__ = "institutions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    cssps_code = Column(String(50), unique=True, nullable=False, index=True)
    institution_type = Column(
        SQLEnum(InstitutionType, name="institution_type", create_type=False),
        nullable=False,
        default=InstitutionType.SHS,
        index=True
    )
    category = Column(String(10), nullable=True)
    gender_type = Column(
        SQLEnum(InstitutionGender, name="institution_gender", create_type=False),
        nullable=False,
        default=InstitutionGender.MIXED
    )
    residence_type = Column(
        SQLEnum(InstitutionResidence, name="institution_residence", create_type=False),
        nullable=False,
        default=InstitutionResidence.DAY_AND_BOARDING
    )
    region = Column(String(100), nullable=False, index=True)
    district = Column(String(150), nullable=True)
    is_verified = Column(Boolean, nullable=False, default=False, index=True)
    verified_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    website = Column(String(255), nullable=True)
    contact_email = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    verifier = relationship("User", back_populates="verified_institutions")
    opportunities = relationship("Opportunity", back_populates="institution")


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="SET NULL"), nullable=True, index=True)
    type = Column(
        SQLEnum(OpportunityType, name="opportunity_type", create_type=False),
        nullable=False,
        index=True
    )
    rules_jsonb = Column(JSONB, nullable=False, server_default="{}")
    eligibility_rules = synonym("rules_jsonb")
    eligibilityRules = synonym("rules_jsonb")
    benefits = Column(JSONB, nullable=True, server_default="[]")
    application_deadline = Column(DateTime(timezone=True), nullable=True)
    expiry_date = Column(DateTime(timezone=True), nullable=False, index=True)
    status = Column(
        SQLEnum(OpportunityStatus, name="opportunity_status", create_type=False),
        nullable=False,
        default=OpportunityStatus.ACTIVE,
        index=True
    )
    slots_available = Column(Integer, nullable=True)
    source_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        Index("idx_opportunities_rules_jsonb", "rules_jsonb", postgresql_using="gin"),
    )

    # Relationships
    institution = relationship("Institution", back_populates="opportunities")


class VectorDocument(Base):
    __tablename__ = "vector_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(1536), nullable=False)
    source_url = Column(String(500), nullable=False, index=True)
    document_type = Column(String(100), nullable=True, index=True)
    chunk_index = Column(Integer, nullable=False, default=0)
    metadata_ = Column("metadata", JSONB, nullable=False, server_default="{}")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        Index("idx_vector_docs_metadata", "metadata", postgresql_using="gin"),
    )
