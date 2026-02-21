"""remove many-to-many for garden sections, add sectionPlant table to track added plants with date and notes

Revision ID: 71ca9921cbb1
Revises: d8e57be2e723
Create Date: 2026-02-21 20:38:07.704486
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '71ca9921cbb1'
down_revision = 'd8e57be2e723'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Upgrade schema."""

    conn = op.get_bind()

    # Drop old many-to-many table if it exists
    result = conn.execute(sa.text("SELECT tablename FROM pg_tables WHERE schemaname='public'"))
    tables = [row[0] for row in result.fetchall()]
    if 'garden_sections' in tables:
        op.drop_table('garden_sections')

    # Create new section_plants table
    op.create_table(
        'section_plants',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('section_id', sa.Integer, sa.ForeignKey('sections.id'), nullable=False),
        sa.Column('plant_id', sa.Integer, sa.ForeignKey('plants.id'), nullable=False),
        sa.Column('planted_date', sa.Date, nullable=True),
        sa.Column('notes', sa.String(256), nullable=True),
    )

    # Add garden_id column to sections
    op.add_column('sections', sa.Column('garden_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'sections', 'gardens', ['garden_id'], ['id'])
    op.alter_column('sections', 'description',
                    existing_type=sa.VARCHAR(length=256),
                    nullable=True)


def downgrade() -> None:
    """Downgrade schema."""

    # Drop foreign key and garden_id column
    op.drop_constraint(None, 'sections', type_='foreignkey')
    op.drop_column('sections', 'garden_id')
    op.alter_column('sections', 'description',
                    existing_type=sa.VARCHAR(length=256),
                    nullable=False)

    # Drop section_plants table
    op.drop_table('section_plants')

    # Recreate garden_sections table
    op.create_table(
        'garden_sections',
        sa.Column('garden_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column('section_id', sa.INTEGER(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['garden_id'], ['gardens.id'], name=op.f('garden_sections_garden_id_fkey')),
        sa.ForeignKeyConstraint(['section_id'], ['sections.id'], name=op.f('garden_sections_section_id_fkey')),
        sa.PrimaryKeyConstraint('garden_id', 'section_id', name=op.f('garden_sections_pkey'))
    )