-- Migration 029: Curated profile avatar presets
-- Keeps profile avatar selection server-authoritative and extensible without
-- storing arbitrary client-provided URLs.

CREATE TABLE IF NOT EXISTS profile_avatar_presets (
    preset_id    TEXT PRIMARY KEY,
    label        TEXT NOT NULL,
    asset_path   TEXT NOT NULL UNIQUE,
    alt_text     TEXT NOT NULL,
    sort_order   INTEGER NOT NULL UNIQUE CHECK (sort_order > 0),
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO profile_avatar_presets (preset_id, label, asset_path, alt_text, sort_order, is_active)
VALUES
    ('jetsetter',       'Jetsetter',        '/avatars/presets/v1/jetsetter.webp',       'Stylish traveler avatar with a sun hat and sunglasses', 1, TRUE),
    ('night_shift',     'Night Shift',      '/avatars/presets/v1/night-shift.webp',     'Bold masked character avatar in a dark suit',            2, TRUE),
    ('pixel_executive', 'Pixel Executive',  '/avatars/presets/v1/pixel-executive.webp','Executive avatar with pixel sunglasses and an afro',      3, TRUE),
    ('golden_executive','Golden Executive', '/avatars/presets/v1/golden-executive.webp','Golden character avatar wearing a formal suit',           4, TRUE),
    ('vr_builder',      'VR Builder',       '/avatars/presets/v1/vr-builder.webp',      'Tech creator avatar wearing a VR headset',                 5, TRUE),
    ('owl_operator',    'Owl Operator',     '/avatars/presets/v1/owl-operator.webp',    'Tech creator avatar wearing an owl costume',               6, TRUE),
    ('dojo_spirit',     'Dojo Spirit',      '/avatars/presets/v1/dojo-spirit.webp',     'Martial arts inspired avatar with a focused expression',   7, TRUE)
ON CONFLICT (preset_id) DO UPDATE SET
    label = EXCLUDED.label,
    asset_path = EXCLUDED.asset_path,
    alt_text = EXCLUDED.alt_text,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS avatar_mode TEXT NOT NULL DEFAULT 'account',
    ADD COLUMN IF NOT EXISTS preset_avatar_id TEXT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_users_avatar_mode'
    ) THEN
        ALTER TABLE users
            ADD CONSTRAINT chk_users_avatar_mode
            CHECK (avatar_mode IN ('account', 'preset'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_preset_avatar'
    ) THEN
        ALTER TABLE users
            ADD CONSTRAINT fk_users_preset_avatar
            FOREIGN KEY (preset_avatar_id)
            REFERENCES profile_avatar_presets(preset_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_users_avatar_selection'
    ) THEN
        ALTER TABLE users
            ADD CONSTRAINT chk_users_avatar_selection
            CHECK (
                (avatar_mode = 'account' AND preset_avatar_id IS NULL)
                OR
                (avatar_mode = 'preset' AND preset_avatar_id IS NOT NULL)
            );
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profile_avatar_presets_active
    ON profile_avatar_presets (sort_order)
    WHERE is_active = TRUE;

COMMENT ON COLUMN users.avatar_mode IS 'Profile avatar source: signed-in account image/default initials or a curated FinCopilot preset.';
COMMENT ON COLUMN users.preset_avatar_id IS 'Selected curated profile avatar. Only populated when avatar_mode=preset.';
