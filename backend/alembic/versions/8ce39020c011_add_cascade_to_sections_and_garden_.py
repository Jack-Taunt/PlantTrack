"""add cascade deletes for garden relationships

Revision ID: add_cascade_garden_relations
Revises: 91b48cb6d9e3
Create Date: 2026-03-16
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision: str = "add_cascade_garden_relations"
down_revision: Union[str, Sequence[str], None] = "91b48cb6d9e3"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ---- sections.garden_id ----
    op.drop_constraint(
        "sections_garden_id_fkey",
        "sections",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "sections_garden_id_fkey",
        "sections",
        "gardens",
        ["garden_id"],
        ["id"],
        ondelete="CASCADE",
    )

    # ---- garden_plants.garden_id ----
    op.drop_constraint(
        "garden_plants_garden_id_fkey",
        "garden_plants",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "garden_plants_garden_id_fkey",
        "garden_plants",
        "gardens",
        ["garden_id"],
        ["id"],
        ondelete="CASCADE",
    )

    # ---- garden_plants.section_id ----
    op.drop_constraint(
        "garden_plants_section_id_fkey",
        "garden_plants",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "garden_plants_section_id_fkey",
        "garden_plants",
        "sections",
        ["section_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    # Reverse everything (remove CASCADE)

    op.drop_constraint(
        "garden_plants_section_id_fkey",
        "garden_plants",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "garden_plants_section_id_fkey",
        "garden_plants",
        "sections",
        ["section_id"],
        ["id"],
    )

    op.drop_constraint(
        "garden_plants_garden_id_fkey",
        "garden_plants",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "garden_plants_garden_id_fkey",
        "garden_plants",
        "gardens",
        ["garden_id"],
        ["id"],
    )

    op.drop_constraint(
        "sections_garden_id_fkey",
        "sections",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "sections_garden_id_fkey",
        "sections",
        "gardens",
        ["garden_id"],
        ["id"],
    )