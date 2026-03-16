"""add cascade to sections and garden plants3

Revision ID: 9dd7833997ea
Revises: 1e0f0812f586
Create Date: 2026-03-16 16:46:38.494627

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9dd7833997ea'
down_revision: Union[str, Sequence[str], None] = '1e0f0812f586'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint('sections_garden_id_fkey', 'sections', type_='foreignkey')
    op.create_foreign_key(
        'sections_garden_id_fkey', 'sections', 'gardens',
        ['garden_id'], ['id'], ondelete='CASCADE'
    )
    op.drop_constraint('garden_plants_garden_id_fkey', 'garden_plants', type_='foreignkey')
    op.create_foreign_key(
        'garden_plants_garden_id_fkey', 'garden_plants', 'gardens',
        ['garden_id'], ['id'], ondelete='CASCADE'
    )

def downgrade() -> None:
    op.drop_constraint('sections_garden_id_fkey', 'sections', type_='foreignkey')
    op.create_foreign_key(
        'sections_garden_id_fkey', 'sections', 'gardens',
        ['garden_id'], ['id']
    )
    op.drop_constraint('garden_plants_garden_id_fkey', 'garden_plants', type_='foreignkey')
    op.create_foreign_key(
        'garden_plants_garden_id_fkey', 'garden_plants', 'gardens',
        ['garden_id'], ['id']
    )
