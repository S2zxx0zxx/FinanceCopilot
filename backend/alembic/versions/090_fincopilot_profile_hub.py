"""FinCopilot Personal Hub profile fields and curated avatars."""
from alembic import op
import sqlalchemy as sa

revision = "090"
down_revision = "089"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "profile_avatar_presets",
        sa.Column("preset_id", sa.String(length=64), primary_key=True),
        sa.Column("label", sa.String(length=120), nullable=False),
        sa.Column("asset_path", sa.String(length=255), nullable=False, unique=True),
        sa.Column("alt_text", sa.String(length=255), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, unique=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.CheckConstraint("sort_order > 0", name="ck_profile_avatar_presets_sort_order"),
    )
    op.create_index(
        "idx_profile_avatar_presets_active",
        "profile_avatar_presets",
        ["sort_order"],
        unique=False,
        postgresql_where=sa.text("is_active = true"),
    )

    op.add_column("users", sa.Column("display_name", sa.String(length=160), nullable=True))
    op.add_column(
        "users",
        sa.Column("avatar_mode", sa.String(length=16), nullable=False, server_default="account"),
    )
    op.add_column("users", sa.Column("preset_avatar_id", sa.String(length=64), nullable=True))
    op.create_check_constraint(
        "chk_users_avatar_mode",
        "users",
        "avatar_mode IN ('account', 'preset')",
    )
    op.create_foreign_key(
        "fk_users_preset_avatar",
        "users",
        "profile_avatar_presets",
        ["preset_avatar_id"],
        ["preset_id"],
        ondelete="SET NULL",
    )
    op.create_check_constraint(
        "chk_users_avatar_selection",
        "users",
        "(avatar_mode = 'account' AND preset_avatar_id IS NULL) OR "
        "(avatar_mode = 'preset' AND preset_avatar_id IS NOT NULL)",
    )

    presets = sa.table(
        "profile_avatar_presets",
        sa.column("preset_id", sa.String),
        sa.column("label", sa.String),
        sa.column("asset_path", sa.String),
        sa.column("alt_text", sa.String),
        sa.column("sort_order", sa.Integer),
        sa.column("is_active", sa.Boolean),
    )
    op.bulk_insert(
        presets,
        [
            {"preset_id": "jetsetter", "label": "Jetsetter", "asset_path": "/avatars/presets/v1/jetsetter.svg", "alt_text": "FinCopilot jetsetter avatar", "sort_order": 1, "is_active": True},
            {"preset_id": "night_shift", "label": "Night Shift", "asset_path": "/avatars/presets/v1/night-shift.svg", "alt_text": "FinCopilot night shift avatar", "sort_order": 2, "is_active": True},
            {"preset_id": "pixel_executive", "label": "Pixel Executive", "asset_path": "/avatars/presets/v1/pixel-executive.svg", "alt_text": "FinCopilot pixel executive avatar", "sort_order": 3, "is_active": True},
            {"preset_id": "golden_executive", "label": "Golden Executive", "asset_path": "/avatars/presets/v1/golden-executive.svg", "alt_text": "FinCopilot golden executive avatar", "sort_order": 4, "is_active": True},
            {"preset_id": "vr_builder", "label": "VR Builder", "asset_path": "/avatars/presets/v1/vr-builder.svg", "alt_text": "FinCopilot VR builder avatar", "sort_order": 5, "is_active": True},
            {"preset_id": "owl_operator", "label": "Owl Operator", "asset_path": "/avatars/presets/v1/owl-operator.svg", "alt_text": "FinCopilot owl operator avatar", "sort_order": 6, "is_active": True},
            {"preset_id": "dojo_spirit", "label": "Dojo Spirit", "asset_path": "/avatars/presets/v1/dojo-spirit.svg", "alt_text": "FinCopilot dojo spirit avatar", "sort_order": 7, "is_active": True},
        ],
    )


def downgrade() -> None:
    op.drop_constraint("chk_users_avatar_selection", "users", type_="check")
    op.drop_constraint("fk_users_preset_avatar", "users", type_="foreignkey")
    op.drop_constraint("chk_users_avatar_mode", "users", type_="check")
    op.drop_column("users", "preset_avatar_id")
    op.drop_column("users", "avatar_mode")
    op.drop_column("users", "display_name")
    op.drop_index("idx_profile_avatar_presets_active", table_name="profile_avatar_presets")
    op.drop_table("profile_avatar_presets")
