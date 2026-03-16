"""add cascade to sections and garden plants2

Revision ID: 1e0f0812f586
Revises: add_cascade_garden_relations
Create Date: 2026-03-16 16:39:31.145622

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1e0f0812f586'
down_revision: Union[str, Sequence[str], None] = 'add_cascade_garden_relations'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None




def upgrade():

    # --- sections → gardens ---
    op.drop_constraint(
        "sections_garden_id_fkey",
        "sections",
        type_="foreignkey"
    )

    op.create_foreign_key(
        "sections_garden_id_fkey",
        "sections",
        "gardens",
        ["garden_id"],
        ["id"],
        ondelete="CASCADE"
    )

    # --- garden_plants → gardens ---
    op.drop_constraint(
        "garden_plants_garden_id_fkey",
        "garden_plants",
        type_="foreignkey"
    )

    op.create_foreign_key(
        "garden_plants_garden_id_fkey",
        "garden_plants",
        "gardens",
        ["garden_id"],
        ["id"],
        ondelete="CASCADE"
    )

    # --- garden_plants → sections ---
    op.drop_constraint(
        "garden_plants_section_id_fkey",
        "garden_plants",
        type_="foreignkey"
    )

    op.create_foreign_key(
        "garden_plants_section_id_fkey",
        "garden_plants",
        "sections",
        ["section_id"],
        ["id"],
        ondelete="CASCADE"
    )


def downgrade():

    # reverse order

    op.drop_constraint("garden_plants_section_id_fkey", "garden_plants", type_="foreignkey")
    op.create_foreign_key(
        "garden_plants_section_id_fkey",
        "garden_plants",
        "sections",
        ["section_id"],
        ["id"],
    )

    op.drop_constraint("garden_plants_garden_id_fkey", "garden_plants", type_="foreignkey")
    op.create_foreign_key(
        "garden_plants_garden_id_fkey",
        "garden_plants",
        "gardens",
        ["garden_id"],
        ["id"],
    )

    op.drop_constraint("sections_garden_id_fkey", "sections", type_="foreignkey")
    op.create_foreign_key(
        "sections_garden_id_fkey",
        "sections",
        "gardens",
        ["garden_id"],
        ["id"],
    )
